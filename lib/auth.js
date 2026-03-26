import { supabaseServer } from "./supabaseServer";

/**
 * Validates the Secret Key used by the Merchant's Backend
 */
export async function authorizeMerchant(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const key = authHeader.split(" ")[1];

  // DEMO MODE: Allow the frontend simulator to act as an admin
  if (key === "sk_test_demo_admin_key") {
    return { id: "00000000-0000-0000-0000-000000000000", name: "System Admin" };
  }

  const { data: merchant, error } = await supabaseServer
    .from("merchants")
    .select("id, name, public_key")
    .eq("private_key", key)
    .single();

  if (error || !merchant) return null;
  return merchant;
}

/**
 * Gets the Public Key for the Customer (Frontend)
 */
export async function getMerchantPublicKey(merchantId) {
  const { data: merchant, error } = await supabaseServer
    .from("merchants")
    .select("public_key")
    .eq("id", merchantId)
    .single();

  if (error || !merchant) return null;
  return merchant.public_key;
}
/**
 * Resolves Merchant by Public Key (Frontend Resolver)
 */
export async function resolveMerchantByPublicKey(businessNameEncoded, publicKey) {
  const businessName = decodeURIComponent(businessNameEncoded);
  console.log(`[AUTH] Resolving Business Name: ${businessName} with pk: ${publicKey}`);
  const { data: merchant, error } = await supabaseServer
    .from("merchants")
    .select("id, name, private_key") 
    .eq("name", businessName)
    .eq("public_key", publicKey)
    .single();

  if (error) {
    console.error(`[AUTH ERROR] ${error.message}`, error);
    return null;
  }
  
  if (!merchant) {
    console.warn(`[AUTH] No merchant found for id: ${merchantId}`);
    return null;
  }
  
  return merchant;
}
