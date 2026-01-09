import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
    try {
        const { id: chargeId } = await params;

        if (!chargeId) {
            return NextResponse.json(
                { error: "charge_id is required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseServer
            .from("ledger_entries")
            .select(`
                    id,
                    aggregate_id,
                    account_type,
                    debit,
                    credit,
                    currency,
                    created_at
                    `)
            .eq("aggregate_id", chargeId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Ledger fetch failed:", error);
            return NextResponse.json(
                { error: "Failed to fetch ledger entries" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            charge_id: chargeId,
            ledger: data || []
        });
    } catch (err) {
        console.error("Ledger API error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
