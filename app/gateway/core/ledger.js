import { supabaseServer } from "@/lib/supabaseServer";


export async function recordCaptureLedger({ chargeId, amount, currency, customer_name, payment_method, description }) {
  const fee = amount * 0.03; 
  // Simple 3% platform fee
  const merchantAmount = amount - fee;

  // Double-Entry Transactions:
  // 1. Debit Customer (Total Amount)
  // 2. Credit Merchant (Amount - Fee)
  // 3. Credit Platform (Fee)

  const entries = [
    {
      aggregate_id: chargeId,
      aggregate_type: "charge",
      account_type: "customer_debit",
      debit: amount,
      credit: 0,
      currency,
      customer_name,
      payment_method,
      description: description || "Payment Capture"
    },
    {
      aggregate_id: chargeId,
      aggregate_type: "charge",
      account_type: "merchant_escrow",
      debit: 0,
      credit: merchantAmount,
      currency,
      customer_name,
      payment_method,
      description: description || "Merchant Settlement share"
    },
    {
      aggregate_id: chargeId,
      aggregate_type: "charge",
      account_type: "platform_fee",
      debit: 0,
      credit: fee,
      currency,
      customer_name,
      payment_method,
      description: description || "Platform Transaction Fee"
    }
  ];

  const { error } = await supabaseServer.from("ledger_entries").insert(entries);

  if (error) {
    console.error("Ledger Entry Failed:", error);
    throw new Error("Financial Ledger recording failed");
  }
}
