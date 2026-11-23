"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, removeItem, updateQty, subtotal, shipping, total, itemCount } = useCart();

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121212] border-l border-neutral-800 shadow-2xl flex flex-col text-white">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#9D6EFF]" />
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Your Cart</h2>
              <span className="text-xs bg-[#4D2C9C] text-white font-extrabold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#181818] px-6 py-3.5 border-b border-neutral-800">
            <p className="text-xs text-neutral-300 font-semibold mb-2">
              {remainingForFree > 0 ? (
                <>Add <span className="text-[#9D6EFF] font-bold">₹{remainingForFree}</span> more for FREE Shipping!</>
              ) : (
                <span className="text-purple-300">🎉 Congratulations! FREE Shipping unlocked!</span>
              )}
            </p>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6D3EE6] h-full transition-all duration-300 shadow-[0_0_8px_rgba(109,62,230,0.6)]"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-800">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#181818] border border-neutral-800 flex items-center justify-center text-[#9D6EFF] mb-4">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your cart is empty</h3>
                <p className="text-xs text-neutral-400 mb-6 max-w-xs">
                  Discover our premium car detailing & ceramic coating range.
                </p>
                <button
                  onClick={closeDrawer}
                  className="bg-[#4D2C9C] hover:bg-[#6D3EE6] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-[#1C1C1C] border border-neutral-800 flex items-center justify-center flex-shrink-0 text-2xl select-none overflow-hidden">
                    {item.image && (item.image.startsWith("http") || item.image.startsWith("/")) && !item.image.includes("product-") ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      "🚗"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-neutral-400 mb-2 font-mono">₹{item.price}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden bg-[#181818]">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-800 text-neutral-300 transition"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-800 text-neutral-300 transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#9D6EFF] font-mono">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-500 hover:text-red-400 p-1.5 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-[#161616] space-y-4">
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold font-mono">
                    {shipping === 0 ? <span className="text-[#9D6EFF] font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Amount</span>
                  <span className="text-[#9D6EFF] text-base font-mono">₹{total}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="flex-1 py-3 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 font-bold text-xs rounded-lg text-center transition"
                >
                  View Cart
                </Link>
              </div>

              <div className="text-center text-[11px] leading-relaxed text-neutral-500">
                Static catalog: online checkout is unavailable.{" "}
                <a href="mailto:support@detale.in" className="text-[#9D6EFF] hover:underline">
                  Contact support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
