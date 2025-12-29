"use client";

import { useState } from "react";
import { useCart } from "../context/page";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const params = useSearchParams();
  const amount = Number(params.get("amount"));

  const [card, setCard] = useState("");
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");

  async function handlePay() {
    setMessage("Processing...");

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

    const order = await orderRes.json();

    // Pay
    const payRes = await fetch("/merchant/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customerName,
        order_id: order.order.id,
        card_token: token.token
      })
    });

    const result = await payRes.json();

    if (result.success) {
      clearCart();
      setMessage("Payment Successful :)");
    } else {
      setMessage("Payment Failed :(");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Checkout</h1>

      <p>Total: ₹{amount}</p>

      <input
        placeholder="Card number"
        value={card}
        onChange={e => setCard(e.target.value)}
      />

      <input
        placeholder="Customer name"
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
      />

      <br /><br />

      <button onClick={handlePay}>Pay Now</button>

      <h3>{message}</h3>
    </div>
  );
}
