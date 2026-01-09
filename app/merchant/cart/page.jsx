"use client";

import { useCart } from "../context/page";
import Link from "next/link";

export default function CartPage() {
  const { cart } = useCart();

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map((p, i) => (
        <p key={i}>
          {p.name} – ₹{p.price}
        </p>
      ))}

      <h2>Total: ₹{total}</h2>

      <Link href={`/merchant/checkout?amount=${total}`}>
        <button disabled={cart.length === 0}>Checkout</button>
      </Link>
    </div>
  );
}
