import { authorizeMerchant } from "@/lib/auth";
import { signPayload } from "@/app/gateway/utils/signWebhook";
import { NextResponse } from "next/server";
import { appendEvent } from "@/app/gateway/core/eventStore";
import { supabaseServer } from "@/lib/supabaseServer";


export async function POST(req) {
  try {
    // 1. Authenticate the Merchant!
    const merchant = await authorizeMerchant(req);

    if (!merchant) {
      return NextResponse.json({ error: "Invalid Secret Key" }, { status: 401 });
    }

    // 2. Check for Idempotency-Key
    const idempotencyKey = req.headers.get("x-idempotency-key");
    if (idempotencyKey) {
      const { data: existingCharge } = await supabaseServer
        .from("gateway_charges")
        .select("id, amount, status")
        .eq("merchant_id", merchant.id)
        .eq("idempotenct_key", idempotencyKey)
        .single();

      if (existingCharge) {
        console.warn(`Idempotent hit for ${idempotencyKey}`);
        return NextResponse.json({
          id: existingCharge.id,
          status: existingCharge.status,
          amount: existingCharge.amount,
          remark: "Cached hit"
        });
      }
    }

    const body = await req.json();
    const { amount, payment_method, order_id, webhook_url, customer_name, simulate_webhook_failure } = body;
    const platform_fee = Math.round(amount * (0.03));
    const net_amount = amount - platform_fee;

    if (!amount || !payment_method || !order_id || !webhook_url || !customer_name) {
      return NextResponse.json(
        {
          error: "Missing fields: amount, payment_method, order_id, webhook_url, customer_name required"
        },
        { status: 400 }
      );
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
        platform_fee,
        net_amount,
        webhook_url,
        simulate_webhook_failure,
        merchant_id: merchant.id // NEW: Track merchant in events!
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
    const chargePayload = {
      id: charge_id,
      merchant_id: merchant.id, // NEW: Filterable by dashboard
      idempotenct_key: idempotencyKey, // NEW: Reliability
      amount,
      currency: "INR",
      platform_fee,
      net_amount,
      payment_method,
      customer_name,
      order_id,
      status: "authorized" // Start as authorized!
    };


    const { error: insertError } = await supabaseServer
      .from("gateway_charges")
      .insert(chargePayload);

    if (insertError) {
      console.error("Failed to insert into gateway_charges:", insertError);
      throw new Error(`Projection update failed: ${insertError.message}`);
    }

    // QUEUE -> WORKER: Enqueue the webhook delivery instead of synchronous fetch!
    await supabaseServer.from("webhook_deliveries").insert({
      event_type: "charge.authorized",
      webhook_url: webhook_url,
      status: "pending",
      next_retry_at: new Date().toISOString(),
      attempt_count: 0,
      payload: {
        type: "charge.authorized",
        data: { charge_id, order_id, amount, merchant_id: merchant.id },
        simulate_failure: simulate_webhook_failure === true
      }
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
