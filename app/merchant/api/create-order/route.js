import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount, customer_name } = body;

        if (!amount) {
            return Response.json({ error: "amount not provided" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("orders")
            .insert([{ amount, customer_name, status: "created" }])
            .select()
            .single()

        if (error) throw error;

        return Response.json({ order: data });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}