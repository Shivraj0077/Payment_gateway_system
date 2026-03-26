import { supabaseServer } from "@/lib/supabaseServer";
import crypto from "node:crypto";
import { NextResponse } from "next/server";

// Edge rendering forces dynamic execution, preventing caching of the webhook queue
export const dynamic = 'force-dynamic';

// Shared secret configuration
const WEBHOOK_SECRET = process.env.GATEWAY_WEBHOOK_SECRET || "whsec_0e69200438b39bb3cbc5de1f01f9302ea2edca9bd5538b938f85891f50afae02";

function signPayload(payload) {
    return crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(payload)
        .digest("hex");
}

function getNextRetry(attempt) {
    // exponential backoff: 5s, 25s, 125s
    return new Date(Date.now() + Math.pow(5, attempt) * 1000);
}

// Vercel Serverless Function Timeout is typically 10-15 seconds on Hobby Tier.
// By limiting batch size to 10, we ensure the entire block processes safely within the limit.
const BATCH_SIZE = 10;

export async function POST(req) {
    try {
        // 1. Lock rows proactively to prevent duplicate processing if triggered concurrently!
        // We use Supabase RPC or just simple atomic UUID fetching.
        // For simplicity, we fetch up to BATCH_SIZE where status is 'pending' AND time is passed.
        const { data: jobs, error: fetchError } = await supabaseServer
            .from("webhook_deliveries")
            .select("*")
            .eq("status", "pending")
            .lte("next_retry_at", new Date().toISOString())
            .limit(BATCH_SIZE);

        if (fetchError) {
            console.error("Failed to fetch webhook jobs:", fetchError);
            return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 });
        }

        if (!jobs || jobs.length === 0) {
           return NextResponse.json({ message: "No pending webhooks", processed: 0 });
        }

        // 2. Mark them as 'processing' instantly so another concurrent cron worker doesn't pick them up
        const jobIds = jobs.map(j => j.id);
        await supabaseServer
            .from("webhook_deliveries")
            .update({ status: "processing" })
            .in("id", jobIds);

        // 3. Process jobs in parallel for maximum speed within the Serverless boundary
        const results = await Promise.allSettled(jobs.map(async (job) => {
            try {
                // Formatting payload
                const payload = JSON.stringify(job.payload);
                const signature = signPayload(payload);

                let res;
                // Demo mapping
                if (job.webhook_url.includes("webhook.site/placeholder") || job.webhook_url.includes("example.com")) {
                    res = { ok: true, status: 200 };
                } else {
                    res = await fetch(job.webhook_url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-webhook-signature": signature
                        },
                        body: payload
                    });
                }

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                // Complete success
                await supabaseServer
                    .from("webhook_deliveries")
                    .update({
                        status: "success",
                        delivered_at: new Date().toISOString()
                    })
                    .eq("id", job.id);

                return { id: job.id, success: true };

            } catch (err) {
                // Handle failures and exponentiate the retry backoff
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
                            status: "pending", // Put it back into the queue!
                            attempt_count: attempts,
                            next_retry_at: getNextRetry(attempts).toISOString(),
                            last_error: err.message
                        })
                        .eq("id", job.id);
                }
                
                return { id: job.id, success: false, error: err.message };
            }
        }));

        return NextResponse.json({ 
            message: `Processed ${jobs.length} jobs`,
            results 
        });

    } catch (err) {
        console.error("Critical Worker Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
