import { supabaseServer } from "../../../lib/supabaseServer.js";
import crypto from "node:crypto";

function signPayload(payload) {
    const secret = process.env.GATEWAY_WEBHOOK_SECRET || "whsec_0e69200438b39bb3cbc5de1f01f9302ea2edca9bd5538b938f85891f50afae02";
    return crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");
}

function getNextRetry(attempt) {
    // exponential backoff: 5s, 25s, 125s
    return new Date(Date.now() + Math.pow(5, attempt) * 1000);
}

export async function runWebhookDispatcher() {
    const { data: jobs, error: fetchError } = await supabaseServer
        .from("webhook_deliveries")
        .select("*")
        .eq("status", "pending")
        .lte("next_retry_at", new Date().toISOString())
        .limit(5);

    if (fetchError) {
        console.error("Failed to fetch webhook jobs:", fetchError);
        return;
    }

    if (!jobs || jobs.length === 0) return;

    for (const job of jobs) {
        try {
            // 💥 DEMO FAILURE (first 2 attempts if flag is set)
            if (
                job.payload.simulate_failure === true &&
                job.attempt_count < 2
            ) {
                throw new Error("Simulated webhook failure (Dispatcher demo)");
            }

            const payload = JSON.stringify(job.payload);
            const signature = signPayload(payload);

            const res = await fetch(job.webhook_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-webhook-signature": signature
                },
                body: payload
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            await supabaseServer
                .from("webhook_deliveries")
                .update({
                    status: "success",
                    delivered_at: new Date().toISOString()
                })
                .eq("id", job.id);

            console.log(`✅ Webhook delivered: ${job.id}`);

        } catch (err) {
            console.log(`❌ Webhook delivery failed (Attempt ${job.attempt_count}): ${err.message}`);
            const attempts = job.attempt_count + 1;

            if (attempts >= 5) {
                await supabaseServer
                    .from("webhook_deliveries")
                    .update({
                        status: "failed",
                        attempt_count: attempts,
                        last_error: err.message
                    })
                    .eq("id", job.id);
            } else {
                await supabaseServer
                    .from("webhook_deliveries")
                    .update({
                        attempt_count: attempts,
                        next_retry_at: getNextRetry(attempts).toISOString(),
                        last_error: err.message
                    })
                    .eq("id", job.id);
            }
        }
    }
}
