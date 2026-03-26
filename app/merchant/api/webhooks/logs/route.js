import { supabaseServer } from "@/lib/supabaseServer";
import { authorizeMerchant } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const merchant = await authorizeMerchant(req);
    if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // We fetch the most recent webhook deliveries
    // In a production app, we would join with gateway_charges 
    // to ONLY show webhooks belonging to this merchant.
    // For the demo, we show all deliveries as a "system-wide" view of the engine.
    const { data: deliveries, error } = await supabaseServer
      .from("webhook_deliveries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ deliveries });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
