import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate random keys
    const publicKey = "pk_test_" + crypto.randomBytes(16).toString("hex");
    const privateKey = "sk_test_" + crypto.randomBytes(24).toString("hex");

    const { data: merchant, error } = await supabaseServer
      .from("merchants")
      .insert({
        name,
        public_key: publicKey,
        private_key: privateKey
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to create merchant" }, { status: 500 });
    }

    return NextResponse.json(merchant);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
