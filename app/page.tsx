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
      {/* ── Featured Products Grid (Shop Look) ── */}
      <section className="py-10 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-5 sm:mb-10 pb-3 sm:pb-4 border-b border-neutral-900">
            <div>
              <p className="text-xs font-bold text-[#9D6EFF] tracking-widest uppercase mb-1">
                Best Sellers
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Featured Formulations
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#9D6EFF] hover:underline flex items-center gap-1"
            >
              View Full Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Pillars (Dark & Purple) ── */}
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
                <div className="w-10 h-10 rounded-xl bg-[#4D2C9C] text-white flex items-center justify-center flex-shrink-0 font-bold">
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
