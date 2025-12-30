import { NextResponse } from "next/server";
import crypto from "crypto";
import { appendEvent } from "@/app/gateway/core/eventStore";
import { rebuildCharge } from "@/app/gateway/core/rebuildCharge";
import { supabaseServer } from "@/lib/supabaseServer";

import { recordCaptureLedger } from "@/app/gateway/core/ledger";

export async function POST(req, { params }) {
  try {
    /* ---------- auth ---------- */
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------- params ---------- */
    const { id: chargeId } = await params;

    if (!chargeId) {
      return NextResponse.json(
        { error: "charge id required" },
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

    if (charge.status !== "authorized") {
      return NextResponse.json(
        { error: "Charge cannot be captured" },
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
      .update({ status: "captured" })
      .eq("id", charge.id);

    /* ---------- webhook ---------- */
    const webhookEvent = {
      type: "charge.captured",
      data: {
        charge_id: charge.id,
        order_id: charge.order_id,
        amount: charge.amount
      }
    };

    const payload = JSON.stringify(webhookEvent);
    const secret = process.env.GATEWAY_WEBHOOK_SECRET || "whsec_0e69200438b39bb3cbc5de1f01f9302ea2edca9bd5538b938f85891f50afae02";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    await fetch(charge.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature
      },
      body: payload
    });

    return NextResponse.json({
      id: charge.id,
      status: "captured"
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
