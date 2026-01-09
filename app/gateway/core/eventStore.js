import { supabase } from "@/lib/supabaseClient";

export async function appendEvent({ aggregate_id, aggregate_type, event_type, event_data}) {
    const { error} = await supabase.from("events").insert({
        aggregate_id,
        aggregate_type,
        event_type,
        event_data,
    })

    if(error) {
        console.error(error);
        throw new Error("Failed to append event");
    }
}

