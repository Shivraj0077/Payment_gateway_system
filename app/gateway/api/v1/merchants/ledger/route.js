import { authorizeMerchant } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const merchant = await authorizeMerchant(req);

    if (!merchant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: entries, error } = await supabaseServer
      .from("ledger_entries")
      .select("*")
      .eq("merchant_id", merchant.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch ledger" }, { status: 500 });
    }

    return NextResponse.json({ entries: entries || [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
