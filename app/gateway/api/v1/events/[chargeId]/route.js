import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // In latest Next.js, params is a Promise in route handlers.
  const { id: chargeId } = await params;

  if (!chargeId) {
    return Response.json(
      { error: "chargeId is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("events")
    .select("*")
    .eq("aggregate_id", chargeId)
    .eq("event_type", "charge.created")
    .order("created_at", { ascending: true });

  if (error) {
    return Response.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }

  console.log("Event Count: ", data?.length);

  return Response.json({ events: data });
}


