import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import ProductExpertWidget from "@/app/components/ProductExpertWidget";
import { CartProvider } from "@/lib/cart-context";
import { siteUrl } from "@/lib/site-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Detale | Premium Car Care Products",
    template: "%s | Detale",
  },
  description:
    "Shop professional-grade car care products in India. Discover car wash shampoos, ceramic coatings, interior cleaners, glass care, and detailing accessories from Detale.",
  applicationName: "Detale",
  keywords: [
    "car care products India",
    "car detailing products",
    "car wash shampoo",
    "ceramic coating",
    "interior car cleaner",
    "automotive detailing",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Detale",
    title: "Detale | Premium Car Care Products",
    description:
      "Professional car care and detailing products for a showroom finish. Shop Detale online in India.",
    url: "/",
    images: [{ url: "/logo.png", alt: "Detale premium car care" }],
  },
  twitter: {
    card: "summary",
    title: "Detale | Premium Car Care Products",
    description:
      "Professional car care and detailing products for a showroom finish.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('detale-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#4D2C9C] selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1 bg-black">{children}</main>
          <Footer />
          <CartDrawer />
          <ProductExpertWidget />
        </CartProvider>
      </body>
    </html>
  );
}
