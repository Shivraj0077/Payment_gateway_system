import { supabase } from "@/lib/supabaseClient";

/**
 * Enforces double-entry accounting
 */
export async function postLedgerEntries({ event, entries }) {
  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0);

  if (totalDebit !== totalCredit) {
    throw new Error("Ledger imbalance: debit != credit");
  }

  const rows = entries.map(e => ({
    event_id: event.id,
    aggregate_id: event.aggregate_id,
    aggregate_type: event.aggregate_type,
    account: e.account,
    debit: e.debit,
    credit: e.credit,
    currency: "INR"
  }));

  const { error } = await supabase
    .from("ledger_entries")
    .insert(rows);

  if (error) {
    console.error(error);
    throw new Error("Ledger write failed");
  }
}
