import { NextResponse } from "next/server";
import { appendEvent } from "@/app/gateway/core/eventStore";
import { rebuildCharge } from "@/app/gateway/core/rebuildCharge";
import { supabaseServer } from "@/lib/supabaseServer";
import crypto from "node:crypto";
import { authorizeMerchant } from "@/lib/auth";

import { recordCaptureLedger } from "@/app/gateway/core/ledger";
import { runWebhookDispatcher } from "@/app/gateway/workers/webhookDispatcher";

export async function POST(req, { params }) {
  try {
    /* ---------- auth ---------- */
    const merchant = await authorizeMerchant(req);

    if (!merchant) {
      return NextResponse.json({ error: "Invalid Private Key" }, { status: 401 });
    }

    /* ---------- params ---------- */
    const { id: chargeId } = await params;

    if (!chargeId) {
      return NextResponse.json(
        { error: "Charge ID required" },
        { status: 400 }
      );
    }

    /* ---------- load events ---------- */
    const { data: events, error } = await supabaseServer
      .from("events")
      .select("*")
      .eq("aggregate_id", chargeId)
      .order("created_at");

    if (error || !events || events.length === 0) {
      return NextResponse.json(
        { error: "Charge not found" },
        { status: 404 }
      );
    }

    /* ---------- rebuild charge ---------- */
    const charge = rebuildCharge(events);

    // SECURITY: Ensure ONLY the merchant owning the charge can process it
    if (charge.merchant_id !== merchant.id) {
       return NextResponse.json({ error: "Unauthorized access to this charge" }, { status: 403 });
    }

    if (charge.status !== "authorized") {
      return NextResponse.json(
        { error: "Charge cannot be captured (status: " + charge.status + ")" },
        { status: 400 }
      );
    }

    /* ---------- append event ---------- */
    await appendEvent({
      aggregate_id: charge.id,
      aggregate_type: "charge",
      event_type: "charge.captured",
      event_data: {
        amount: charge.amount,
        order_id: charge.order_id
      }
    });

    /* ---------- record ledger ---------- */
    // This is where the double-entry accounting happens
    await recordCaptureLedger({
      merchant_id: charge.merchant_id,
      chargeId: charge.id,
      amount: charge.amount,
      currency: charge.currency || "INR",
      platform_fee: charge.platform_fee,
      net_amount: charge.net_amount,
      customer_name: charge.customer_name,
      payment_method: charge.payment_method
    });

    /* ---------- update projection ---------- */
    await supabaseServer
      .from("gateway_charges")
      .update({ status: "paid" })
      .eq("id", charge.id);

    /* ---------- enqueue webhook ---------- */
    await supabaseServer.from("webhook_deliveries").insert({
      event_type: "charge.captured",
      webhook_url: charge.webhook_url,
      status: "pending",
      next_retry_at: new Date().toISOString(),
      attempt_count: 0,
      payload: {
        type: "charge.captured",
        data: {
          charge_id: charge.id,
          order_id: charge.order_id,
          amount: charge.amount
        },
        simulate_failure: charge.simulate_webhook_failure === true
      }
    });

    return NextResponse.json({
      id: charge.id,
      status: "paid"
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
