import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pk = searchParams.get("pk");

    if (!pk) return NextResponse.json({ error: "No key" }, { status: 400 });

    const { data: merchant, error } = await supabaseServer
      .from("merchants")
      .select("id, name, private_key") // We include private_key ONLY for the demo checkout flow to work
      .eq("public_key", pk)
      .single();

    if (error || !merchant) {
        return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    return NextResponse.json(merchant);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
