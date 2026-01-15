import { CartProvider } from "./context/CartContext";

export default function MerchantLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
