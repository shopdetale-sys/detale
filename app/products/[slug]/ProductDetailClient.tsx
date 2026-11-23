"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Check,
} from "lucide-react";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      slug: product.slug,
      category: product.category,
      image: product.image,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 50;

  return (
    <div className="flex flex-col text-white">
      {/* Category */}
      <p className="text-xs font-bold text-[#9D6EFF] uppercase tracking-wider mb-2">
        {product.category}
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={15}
              className={
                i < Math.floor(product.rating)
                  ? "text-[#9D6EFF] fill-[#9D6EFF]"
                  : "text-neutral-700 fill-neutral-700"
              }
            />
          ))}
        </div>
        <span className="text-white font-bold text-sm">{product.rating}</span>
        <span className="text-neutral-400 text-xs">({product.reviews} reviews)</span>
      </div>

      {/* Price Block */}
      <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-800">
        <span className="text-3xl sm:text-4xl font-black text-white font-mono">
          ₹ {product.price.toLocaleString("en-IN")}.00
        </span>
        {product.originalPrice ? (
          <>
            <span className="text-base text-neutral-500 line-through font-mono">
              ₹ {product.originalPrice.toLocaleString("en-IN")}.00
            </span>
            <span className="bg-[#4D2C9C] text-white text-xs font-black px-2 py-0.5 rounded uppercase shadow-sm">
              {discountPercent}% OFF
            </span>
          </>
        ) : (
          <>
            <span className="text-base text-neutral-500 line-through font-mono">
              ₹ {(product.price * 2).toLocaleString("en-IN")}.00
            </span>
            <span className="bg-[#4D2C9C] text-white text-xs font-black px-2 py-0.5 rounded uppercase shadow-sm">
              50% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2 mb-6">
        {product.inStock ? (
          <>
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-bold">In Stock — Dispatched within 24 Hours</span>
          </>
        ) : (
          <>
            <XCircle size={16} className="text-red-400" />
            <span className="text-red-400 text-xs font-bold">Currently Out of Stock</span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">{product.description}</p>

      {/* Key Features */}
      <div className="mb-8 bg-[#141414] border border-neutral-800/80 rounded-2xl p-5">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
          Key Features & Benefits
        </h3>
        <ul className="space-y-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-neutral-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6D3EE6] flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-xs font-bold text-neutral-300">Quantity</span>
        <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden bg-[#181818]">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-neutral-800 text-neutral-300 transition"
          >
            <Minus size={13} />
          </button>
          <span className="w-10 text-center font-bold text-xs font-mono">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-9 h-9 flex items-center justify-center hover:bg-neutral-800 text-neutral-300 transition"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Add to Cart Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold py-3.5 rounded-lg uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
            added
              ? "bg-emerald-500 text-black font-bold"
              : "bg-[#4D2C9C] hover:bg-[#6D3EE6] disabled:bg-neutral-800 disabled:text-neutral-500 text-white shadow-lg shadow-purple-900/40"
          }`}
        >
          {added ? (
            <>
              <Check size={16} className="stroke-[3]" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              {product.inStock ? `Add ${qty} to Cart • ₹${(product.price * qty).toLocaleString("en-IN")}` : "Out of Stock"}
            </>
          )}
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`w-12 h-12 rounded-lg border flex items-center justify-center transition ${
            isFavorite ? "border-purple-500 bg-purple-950/40 text-purple-400" : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Truck, label: "Fast Delivery", sub: "Shiprocket Express" },
          { icon: ShieldCheck, label: "100% Authentic", sub: "Lab Tested" },
          { icon: RefreshCw, label: "COD & UPI", sub: "Cashfree Verified" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="bg-[#141414] rounded-xl p-3 text-center border border-neutral-800/80">
            <Icon size={16} className="mx-auto text-[#9D6EFF] mb-1" />
            <div className="text-[11px] font-bold text-white">{label}</div>
            <div className="text-[10px] text-neutral-400">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
