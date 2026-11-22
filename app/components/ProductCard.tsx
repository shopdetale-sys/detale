"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { Check } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      slug: product.slug,
      category: product.category,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Calculate discount percentage if original price exists
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 50;

  return (
    <div className="group bg-[#161616] rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 flex flex-col shadow-lg">
      {/* ── Product Image Area with Pedestal Studio Look ── */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-[#1C1C1C] overflow-hidden"
      >
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#222222] via-[#1A1A1A] to-[#121212] transition-transform duration-500 group-hover:scale-105">
          {product.image &&
          (product.image.startsWith("http") || product.image.startsWith("/")) &&
          !product.image.includes("product-") ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative flex flex-col items-center justify-center">
              {/* Dark Pedestal Glow Effect */}
              <div className="w-32 h-10 rounded-full bg-yellow-400/10 blur-xl absolute bottom-2" />
              <div className="text-6xl sm:text-7xl select-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                🧴
              </div>
              <div className="w-24 h-3 bg-black/80 rounded-full blur-xs mt-2" />
            </div>
          )}
        </div>

        {/* ── Top-Right: Discount Badge ── */}
        <span className="absolute top-3 right-3 bg-[#FFE500] text-black font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
          {discountPercent}% OFF
        </span>

        {/* ── Bottom-Left: "Sale" Badge ── */}
        <span className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded border border-neutral-700 shadow-md">
          Sale
        </span>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-neutral-800 text-neutral-300 text-xs font-bold px-3 py-1.5 rounded-full border border-neutral-700">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* ── Card Info ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-[#161616]">
        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="mb-2">
          <h3 className="font-semibold text-white group-hover:text-[#FFE500] transition-colors leading-snug text-sm sm:text-base line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-baseline gap-2.5 mt-auto mb-4 font-mono">
          {product.originalPrice ? (
            <span className="text-xs sm:text-sm text-neutral-500 line-through">
              ₹ {product.originalPrice.toLocaleString("en-IN")}.00
            </span>
          ) : (
            <span className="text-xs sm:text-sm text-neutral-500 line-through">
              ₹ {(product.price * 2).toLocaleString("en-IN")}.00
            </span>
          )}
          <span className="text-base sm:text-lg font-extrabold text-[#FFE500]">
            ₹ {product.price.toLocaleString("en-IN")}.00
          </span>
        </div>

        {/* ── Add to Cart Button (Solid Yellow, Black Bold Text) ── */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all duration-200 active:scale-[0.98] ${
            added
              ? "bg-green-500 text-black font-bold"
              : "bg-[#FFE500] hover:bg-[#F5D800] disabled:bg-neutral-800 disabled:text-neutral-500 text-black shadow-md hover:shadow-yellow-400/20"
          }`}
        >
          {added ? (
            <span className="flex items-center justify-center gap-1.5">
              <Check size={16} className="stroke-[3]" /> Added
            </span>
          ) : product.inStock ? (
            "Add to Cart"
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  );
}
