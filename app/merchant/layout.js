import { CartProvider } from "./context/page";

export default function MerchantLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
