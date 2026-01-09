import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
    try {
        const auth = req.headers.get("authorization");
        if (!auth || !auth.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const { data, error } = await supabaseServer
            .from("events")
            .select("*")
            .eq("aggregate_id", id)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Events fetch failed:", error);
            return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
        }

        return NextResponse.json({ events: data || [] });
    } catch (err) {
        console.error("Events API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
