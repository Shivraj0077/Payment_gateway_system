import { signPayload } from "@/app/gateway/utils/signWebhook";
import { NextResponse } from "next/server";
import { appendEvent } from "@/app/gateway/core/eventStore";
import { supabaseServer } from "@/lib/supabaseServer";

async function sendWebhook(url, event) {
  const payload = JSON.stringify(event);
  const secret = process.env.GATEWAY_WEBHOOK_SECRET || "whsec_0e69200438b39bb3cbc5de1f01f9302ea2edca9bd5538b938f85891f50afae02";
  const signature = signPayload(payload, secret);

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature,
      },
      body: payload,
    });
  } catch (err) {
    console.error("Webhook delivery failed", err.message);
  }
}

export async function POST(req) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, payment_method, order_id, webhook_url, customer_name } = body;

    if (!amount || !payment_method || !order_id || !webhook_url || !customer_name) {
      return NextResponse.json(
        {
          error: "Missing fields: amount, payment_method, order_id, webhook_url, customer_name required"
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    // STEP 1: "Create" charge
    const charge_id = "ch_" + Math.random().toString(36).slice(2, 10);

    /* ---------- charge.created ---------- */
    await appendEvent({
      aggregate_id: charge_id,
      aggregate_type: "charge",
      event_type: "charge.created",
      event_data: {
        id: charge_id,
        amount,
        currency: "INR",
        order_id,
        payment_method,
        customer_name,
        webhook_url
      }
    });

    /* ---------- charge.authorized ---------- */
    await appendEvent({
      aggregate_id: charge_id,
      aggregate_type: "charge",
      event_type: "charge.authorized",
      event_data: {}
    });

    // Persist charge snapshot into gateway_charges read model
    await supabaseServer.from("gateway_charges").insert({
      id: charge_id,
      amount,
      currency: "INR",
      payment_method,
      customer_name,
      order_id,
      status: "created"
    });

    await supabaseServer.from("gateway_charges").update({
      status: "authorized"
    }).eq("id", charge_id);

    // Notify merchant backend
    await sendWebhook(webhook_url, {
      type: "charge.authorized",
      data: { charge_id, order_id, amount }
    });

    // STEP 3: Return charge to merchant backend
    return NextResponse.json({
      id: charge_id,
      status: "authorized",
      amount,
      currency: "INR"
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
