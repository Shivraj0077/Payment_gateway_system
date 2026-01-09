import { supabase } from "@/lib/supabaseClient";
import crypto from "node:crypto";

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

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select()
    .eq("id", event.data.order_id)
    .single()

  if (orderErr || !order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  // We no longer update the order status to 'authorized'.
  // The order stays in 'payment_pending' until it is 'captured' (paid).
  if (event.type === "charge.authorized") {
    if (order.status === "payment_pending") {
      console.log(`Charge authorized for order ${event.data.order_id}. Order remains payment_pending.`);
    } else {
      console.warn(`Unexpected state for charge.authorized: ${order.status}`)
    }
  }

  if (event.type === "charge.captured") {
    console.log(`Charge captured for order ${event.data.order_id}. Order got paid!`)
    await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", event.data.order_id);
  }

  return Response.json({ received: true });
}
