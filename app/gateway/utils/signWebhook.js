import crypto from "node:crypto";

export function signPayload(payload, secret) {
    if (!secret) {
        throw new Error("Webhook secret is required");
    }
    return crypto 
    .createHmac("sha256", secret)
    .update(payload)
    .digest('hex');
}