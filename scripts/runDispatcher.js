
import { runWebhookDispatcher } from "../app/gateway/workers/webhookDispatcher.js";

// This simulates a background process
console.log("🚀 Webhook Dispatcher started...");
setInterval(async () => {
  try {
    await runWebhookDispatcher();
  } catch (err) {
    console.error("Dispatcher Error:", err.message);
  }
}, 3000); 
