import { supabase } from "@/lib/supabaseClient";

// List gateway charges (payment attempts)
export async function GET() {
  const { data, error } = await supabase
    .from("gateway_charges")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: "Failed to fetch payments" }, { status: 500 });
  }

  return Response.json({ payments: data || [] });
}