import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { card_number } = body;

    if (!card_number || card_number.length < 12) {
      return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
    }

    // NOTE: DO NOT SAVE CARD NUMBER IN DB (PCI-DSS)
    const token = "card_tok_" + Math.random().toString(36).slice(2, 10);

    return NextResponse.json({
      token,
      last4: card_number.slice(-4)
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
