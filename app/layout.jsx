import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./merchant/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.js or app/page.js

export const metadata = {
  title: 'Vault — Infrastructure for Modern Payments',
  description: 'Production-grade payment gateway with ledger-based accounting.',
  openGraph: {
    title: 'Vault',
    description: 'Infrastructure for modern payments.',
    url: 'https://payment-gateway-system-six.vercel.app/',
    images: [
      {
        url: 'https://postimg.cc/HrPj465H',
        width: 1200,
        height: 630,
        alt: 'Vault Preview'
      }
    ],
    type: 'website'
  }
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
