import { supabase } from "@/lib/supabaseClient";

// Get a single gateway charge by id
export async function GET(req, { params }) {
  // Await params as it's a Promise in Next.js
  const { id: charge_id } = await params;

  const { data, error } = await supabase
    .from("gateway_charges")
    .select("*")
    .eq("id", charge_id)
    .single();

  if (error || !data) {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  return Response.json({ payment: data });
}