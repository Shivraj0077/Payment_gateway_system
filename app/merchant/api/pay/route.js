import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
    try {
        const body = await req.json();
        const { order_id, card_token } = body;

        if (!card_token || !order_id) {
            return Response.json({ error: "Order_id and card_token required" }, { status: 400 })
        }

        const { data: order, error: orderErr } = await supabase
            .from("orders")
            .select()
            .eq("id", order_id)
            .single()

        if (orderErr || !order) throw new Error("Order not found!")

        // Update status to payment_pending
        await supabase
            .from("orders")
            .update({ status: "payment_pending" })
            .eq("id", order_id)

        const gatewayRes = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/gateway/api/v1/charges`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer merchant_test_key",
                // Correct header key for JSON requests
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: order.amount,
                payment_method: card_token,
                order_id,
                // Webhook so gateway can notify merchant backend
                webhook_url: `${process.env.NEXT_PUBLIC_URL}/merchant/api/webhooks`,
            })
        }
        );

        const charge = await gatewayRes.json();

        if (!charge.id) {
            return Response.json({ error: "Payment failed", details: charge }, { status: 400 });
        }

        // Automatically capture the payment after authorization
        const captureRes = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/gateway/api/v1/charges/${charge.id}/capture`,
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer merchant_test_key",
                    "Content-Type": "application/json",
                }
            }
        );

        const capturedCharge = await captureRes.json();

        // Update order with captured charge status
        await supabase
            .from("orders")
            .update({
                charge_id: capturedCharge.id || charge.id,
                status: capturedCharge.status || charge.status
            })
            .eq("id", order_id)

        return Response.json({
            success: true,
            charge_id: capturedCharge.id || charge.id,
            status: capturedCharge.status || charge.status
        });
    } catch (err) {
        return Response.json({ error: "Error detected" })
    }
}