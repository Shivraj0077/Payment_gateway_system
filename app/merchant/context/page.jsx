"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // SSR-safe initial state
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage (client only)
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
    setHydrated(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  function addToCart(product) {
    setCart(prev => [...prev, product]);
  }

  function clearCart() {
    setCart([]);
  }

  if (!hydrated) return null; // prevents hydration mismatch

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
