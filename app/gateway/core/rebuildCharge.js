export function rebuildCharge(events) {
    let charge = null;
  
    for (const event of events) {
      switch (event.event_type) {
        case "charge.created":
          charge = {
            ...event.event_data,
            status: "created"
          };
          break;
  
        case "charge.authorized":
          charge.status = "authorized";
          break;
  
        case "charge.captured":
          charge.status = "captured";
          charge.captured_at = event.created_at;
          break;
      }
    }
  
    return charge;
  }
  