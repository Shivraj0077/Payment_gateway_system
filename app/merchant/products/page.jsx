"use client";

import { products } from "../data/products";
import { useCart } from "../context/page";

export default function ProductsPage() {
  const { cart, addToCart } = useCart();

  return (
    <div style={{ padding: 20 }}>
      <h1>Products</h1>

      {products.map(p => (
        <div key={p.id} style={{ marginBottom: 15 }}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}

      <a href="/merchant/cart">Go to Cart ({cart.length})</a>
    </div>
  );
}
