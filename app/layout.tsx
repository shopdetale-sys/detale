import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import ProductExpertWidget from "@/app/components/ProductExpertWidget";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Detale — Premium Car Care Products",
  description:
    "Professional-grade car care products for enthusiasts and detailing studios. Shop car wash, ceramic coatings, interior care, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased bg-black`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans selection:bg-[#FFE500] selection:text-black">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 bg-black">{children}</main>
            <Footer />
            <CartDrawer />
            <ProductExpertWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
