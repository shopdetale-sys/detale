"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import ProductArtwork from "@/app/components/ProductArtwork";

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

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 50;

  return (
    <div className="group bg-[#161616] rounded-lg sm:rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-purple-600/50 transition-all duration-300 flex flex-col shadow-xl min-w-0">
      {/* ── Product Image Area with Studio Pedestal & Glow ── */}
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
            <ProductArtwork product={product} />
          )}
        </div>

        {/* ── Top-Right: Discount Badge ── */}
        <span className="hidden sm:block absolute top-3 right-3 bg-[#6D3EE6] text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
          {discountPercent}% OFF
        </span>

        {/* ── Bottom-Left: "Sale" Badge ── */}
        <span className="hidden sm:block absolute bottom-3 left-3 bg-black/90 backdrop-blur-xs text-purple-200 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-purple-800/60 shadow-md">
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
      <div className="relative min-h-[82px] sm:min-h-0 p-2.5 sm:p-5 flex flex-col flex-1 bg-[#161616]">
        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="mb-1 sm:mb-2 pr-10 sm:pr-0">
          <h3 className="font-semibold text-white group-hover:text-[#9D6EFF] transition-colors leading-snug text-[11px] sm:text-base line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2.5 mt-auto mb-0 sm:mb-4 font-mono pr-10 sm:pr-0">
          <span className="hidden sm:inline text-xs sm:text-sm text-neutral-500 line-through">
            ₹ {(product.originalPrice || product.price * 2).toLocaleString("en-IN")}.00
          </span>
          <span className="text-[13px] sm:text-lg font-extrabold text-white sm:text-[#9D6EFF]">
            ₹ {product.price.toLocaleString("en-IN")}.00
          </span>
        </div>

        {/* Compact mobile add button; full-width desktop button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={added ? "Added to cart" : `Add ${product.name} to cart`}
          className={`w-full sm:py-3 rounded-lg text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all duration-200 active:scale-[0.98] max-sm:absolute max-sm:right-2.5 max-sm:bottom-2.5 max-sm:w-9 max-sm:h-9 max-sm:rounded-full max-sm:flex max-sm:items-center max-sm:justify-center ${
            added
              ? "bg-green-500 text-black font-bold"
              : "bg-[#4D2C9C] sm:hover:bg-[#6D3EE6] disabled:bg-neutral-800 disabled:text-neutral-500 text-white shadow-md sm:hover:shadow-purple-500/25 max-sm:bg-[#ff7a67]"
          }`}
        >
          <span className="sm:hidden">
            {added ? <Check size={17} className="stroke-[3]" /> : <Plus size={20} className="stroke-[3]" />}
          </span>
          <span className="hidden sm:flex items-center justify-center gap-1.5">
            {added ? (
              <><Check size={16} className="stroke-[3]" /> Added</>
            ) : product.inStock ? (
              "Add to Cart"
            ) : (
              "Out of Stock"
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
