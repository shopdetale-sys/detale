import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { getProductsFromFirestore } from "@/lib/products-service";
import ProductCard from "@/app/components/ProductCard";

export const revalidate = 60; // revalidate every 60 seconds

export default async function HomePage() {
  const { products: allProducts } = await getProductsFromFirestore();
  const featured = allProducts.filter((p) => p.badge);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-black text-white py-20 sm:py-28 border-b border-neutral-900">
        {/* Subtle Dark Glow Backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-neutral-800 rounded-full px-4 py-1.5 text-xs font-semibold text-neutral-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFE500] animate-pulse" />
            <span>High-Performance Automotive Care Formulations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Engineered For An
            <span className="block text-[#FFE500] uppercase mt-1">
              Unmatched Shine
            </span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Professional-grade SiO2 ceramic coatings, pH-balanced shampoos, and ultra-plush detailing accessories trusted across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#FFE500] hover:bg-[#F5D800] text-black font-extrabold text-sm px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/10 active:scale-[0.98]"
            >
              Shop All Products <ArrowRight size={16} />
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-[#181818] hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-sm px-7 py-3.5 rounded-lg border border-neutral-800 transition-colors"
            >
              Track Existing Order
            </Link>
          </div>

          {/* Social Proof Counter */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-14 mt-16 pt-10 border-t border-neutral-900/80">
            {[
              { label: "Active Detailing Products", value: `${allProducts.length}+` },
              { label: "Happy Car Owners", value: "20,00,000+" },
              { label: "Pan-India Free Shipping", value: "Orders > ₹999" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-[#FFE500] font-mono">{stat.value}</div>
                <div className="text-neutral-400 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products Grid (Shop Look) ── */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-neutral-900">
            <div>
              <p className="text-xs font-bold text-[#FFE500] tracking-widest uppercase mb-1">
                Best Sellers
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Featured Formulations
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#FFE500] hover:underline flex items-center gap-1"
            >
              View Full Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Pillars (Dark & Yellow) ── */}
      <section className="py-16 bg-[#0D0D0D] border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Express Dispatch", desc: "Shiprocket logistics across 28,000+ pin codes" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Formulated & tested for Indian road conditions" },
              { icon: RefreshCw, title: "Cash on Delivery", desc: "Pay safely with COD or Instant UPI via Cashfree" },
              { icon: Star, title: "Showroom Finish", desc: "Hydrophobic SiO2 ceramic water beading protection" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-[#141414] border border-neutral-800/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE500] text-black flex items-center justify-center flex-shrink-0 font-bold">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
