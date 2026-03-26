import { supabaseServer } from "@/lib/supabaseServer";

export async function recordCaptureLedger({ merchant_id, chargeId, amount, customer_name, currency, platform_fee, net_amount, description }) {
  const entries = [
    {
      merchant_id,
      aggregate_id: chargeId,
      aggregate_type: "charge",
      account_type: "customer",
      account_ref: customer_name,
      debit: amount,
      credit: 0,
      currency,
      description: description || "Payment Capture"
    },
    {
      merchant_id,
      aggregate_id: chargeId,
      aggregate_type: "charge",
      account_type: "merchant",
      account_ref: "MERCHANT",
      debit: 0,
      credit: net_amount,
      currency,
      description: description || "Merchant Settlement share"
    },
    {
      merchant_id,
      aggregate_id: chargeId,
      aggregate_type: "charge",
      account_type: "platform",
      account_ref: "PLATFORM",
      debit: 0,
      credit: platform_fee,
      currency,
      description: description || "Platform Transaction Fee"
    }
  ];

  const { error } = await supabaseServer.from("ledger_entries").insert(entries);

  if (error) {
    console.error("Ledger Entry Failed:", error);
    throw new Error("Financial Ledger recording failed");
  }
}
