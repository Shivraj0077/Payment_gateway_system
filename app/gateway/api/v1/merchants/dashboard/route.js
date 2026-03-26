import { authorizeMerchant } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const merchant = await authorizeMerchant(req);

    if (!merchant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: payments, error } = await supabaseServer
      .from("gateway_charges")
      .select("*")
      .eq("merchant_id", merchant.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }

    const chargesList = payments || [];
    let total_volume = 0;
    let net_volume = 0;
    let platform_fees = 0;
    let success_count = 0;
    const customers = new Set();

    chargesList.forEach(c => {
      total_volume += c.amount || 0;
      net_volume += c.net_amount || 0;
      platform_fees += c.platform_fee || 0;
      if (c.status === 'captured' || c.status === 'authorized') {
        success_count += 1;
      }
      if (c.customer_name) {
          customers.add(c.customer_name);
      }
    });

    return NextResponse.json({ 
      merchant, 
      charges: chargesList,
      metrics: {
        total_volume,
        success_count,
        net_volume,
        platform_fees,
        total_customers: customers.size
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
