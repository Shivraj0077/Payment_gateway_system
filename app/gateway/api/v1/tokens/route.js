import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { card_number, public_key } = body;

    if (!public_key || !public_key.startsWith("pk_test_")) {
      return NextResponse.json({ error: "Invalid public key" }, { status: 401 });
    }

    // Pro-level: Check if this public key is active in our DB
    const { data: merchant } = await supabaseServer
      .from("merchants")
      .select("id")
      .eq("public_key", public_key)
      .single();

    if (!merchant) {
      return NextResponse.json({ error: "Merchant for this key not found" }, { status: 404 });
    }

    if (!card_number || card_number.length < 12) {
      return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
    }

    // PCI-DSS Rule: Never store full CC number. Only create a safe token.
    const token = "tok_" + Math.random().toString(36).slice(2, 10);

    return NextResponse.json({
      token,
      last4: card_number.slice(-4),
      merchant_id: merchant.id
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
