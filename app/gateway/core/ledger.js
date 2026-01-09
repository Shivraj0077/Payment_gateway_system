import { supabaseServer } from "@/lib/supabaseServer";


export async function recordCaptureLedger({ chargeId, amount, customer_name, currency, platform_fee, net_amount, description }) {
  // Simple 3% platform fee
  

  // Double-Entry Transactions:
  // 1. Debit Customer (Total Amount)
  // 2. Credit Merchant (Amount - Fee)
  // 3. Credit Platform (Fee)

  const entries = [
    {
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
