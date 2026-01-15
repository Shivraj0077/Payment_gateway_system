"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const params = useSearchParams();
  const amount = Number(params.get("amount"));

  const [card, setCard] = useState("");
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");

  async function handlePay(simulateDispatcherFailure = false) {
    setMessage(simulateDispatcherFailure ? "Simulating Failure & Dispatcher Recovery..." : "Processing...");

    // Tokenize card
    const tokenRes = await fetch("/gateway/api/v1/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_number: card })
    });

    const token = await tokenRes.json();
    if (!token.token) {
      setMessage("Invalid card");
      return;
    }

    // Create order
    const orderRes = await fetch("/merchant/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, customer_name: customerName })
    });

    const orderJson = await orderRes.json();
    const orderId = orderJson.order.id;

    // Pay
    const payRes = await fetch("/merchant/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customerName,
        order_id: orderId,
        card_token: token.token,
        simulate_webhook_failure: simulateDispatcherFailure
      })
    });

    const result = await payRes.json();

    if (result.success || result.status === "captured") {
      if (simulateDispatcherFailure) {
        setMessage("Payment captured but Webhook FAILED (as expected). Dispatcher is recovering...");

        // Poll for order status
        const interval = setInterval(async () => {
          const checkRes = await fetch(`/merchant/api/orders/${orderId}`);
          const order = await checkRes.json();
          if (order.status === "paid") {
            clearInterval(interval);
            clearCart();
            setMessage("Dispatcher recovered the event! Payment Successful :)");
          }
        }, 2000);
      } else {
        clearCart();
        setMessage("Payment Successful :)");
      }
    } else {
      setMessage("Payment Failed :(");
    }
  }

  return (
    <div className="p-3 bg-blue-300">
      <h1>Checkout</h1>

      <p>Total: ₹{amount}</p>

      <input
        placeholder="Card number"
        value={card}
        onChange={e => setCard(e.target.value)}
        className="mb-2 p-2 block"
      />

      <input
        placeholder="Customer name"
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
        className="mb-4 p-2 block"
      />

      <div className="flex gap-2">
        <button
          onClick={() => handlePay(false)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Pay Normally
        </button>
        <button
          onClick={() => handlePay(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Pay with Testing Dispatcher
        </button>
      </div>

      <h3 className="mt-4 font-semibold">{message}</h3>
    </div>
  );
}
