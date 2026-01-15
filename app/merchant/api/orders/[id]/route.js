import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
