import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";

function verifySignature(payload, signature) {
  const secret = process.env.MERCHANT_WEBHOOK_SECRET || "whsec_0e69200438b39bb3cbc5de1f01f9302ea2edca9bd5538b938f85891f50afae02";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expected === signature;
}

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");

  if (!verifySignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(rawBody);

  if (event.type === "charge.authorized") {
    await supabase
      .from("orders")
      .update({ status: "authorized" })
      .eq("id", event.data.order_id);
  }

  if (event.type === "charge.captured") {
    await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", event.data.order_id);
  }

  return Response.json({ received: true });
}
