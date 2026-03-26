import { resolveMerchantByPublicKey } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id: merchantId } = await params;
  const searchParams = req.nextUrl.searchParams;
  const pk = searchParams.get("pk");

  if (!pk) {
    return NextResponse.json({ error: "Public Key (pk) required" }, { status: 400 });
  }

  const merchant = await resolveMerchantByPublicKey(merchantId, pk);

  if (!merchant) {
    return NextResponse.json({ error: "Invalid Public Key for this Merchant" }, { status: 401 });
  }

  // Return the merchant data (including the private_key for the simulator's backend simulation)
  return NextResponse.json({ merchant });
}
