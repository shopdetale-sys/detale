import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Car Care & Detailing Products",
  description:
    "Browse Detale's premium car care range, including car wash, ceramic paint protection, interior and glass cleaners, and detailing accessories.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Shop Car Care & Detailing Products",
    description:
      "Browse premium car wash, ceramic protection, interior care, and detailing accessories from Detale.",
    url: "/products",
  },
};

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
