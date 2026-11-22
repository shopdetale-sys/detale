"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, subtotal, shipping, total, itemCount } = useCart();

  const freeShippingThreshold = 999;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-[70vh] flex items-center justify-center py-20 px-4 text-center text-white">
        <div className="max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-[#181818] border border-neutral-800 flex items-center justify-center text-[#FFE500] mx-auto mb-6">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h1>
          <p className="text-neutral-400 mb-8 max-w-sm mx-auto text-xs">
            You haven't added any car detailing products to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#FFE500] hover:bg-[#F5D800] text-black font-extrabold px-6 py-3 rounded-lg text-xs transition uppercase tracking-wider"
          >
            Explore Catalog <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-900">
          <div>
            <Link href="/products" className="inline-flex items-center text-xs text-neutral-400 hover:text-[#FFE500] mb-2 transition">
              <ArrowLeft size={14} className="mr-1" /> Continue Shopping
            </Link>
            <h1 className="text-3xl font-extrabold text-white">
              Shopping Cart <span className="text-[#FFE500] text-xl font-bold font-mono">({itemCount} items)</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-neutral-400 hover:text-red-400 transition underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {remainingForFree > 0 ? (
              <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-4 flex items-center gap-3 text-xs text-neutral-300">
                <Truck size={18} className="text-[#FFE500] flex-shrink-0" />
                <span>
                  Add <strong className="text-[#FFE500]">₹{remainingForFree}</strong> more to unlock <strong>FREE Delivery</strong> across India!
                </span>
              </div>
            ) : (
              <div className="bg-[#141414] border border-yellow-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-[#FFE500] font-semibold">
                <ShieldCheck size={18} className="text-[#FFE500] flex-shrink-0" />
                <span>Congratulations! Your order qualifies for <strong>FREE Delivery</strong>!</span>
              </div>
            )}

            <div className="bg-[#141414] rounded-2xl border border-neutral-800 divide-y divide-neutral-800/80">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-20 h-20 rounded-xl bg-[#1C1C1C] border border-neutral-800 flex items-center justify-center text-3xl flex-shrink-0 select-none overflow-hidden">
                    {item.image && (item.image.startsWith("http") || item.image.startsWith("/")) && !item.image.includes("product-") ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      "🚗"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#FFE500] uppercase tracking-wider">
                      {item.category || "Car Care"}
                    </span>
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold text-white hover:text-[#FFE500] text-sm sm:text-base leading-snug transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-neutral-400 mt-1 font-mono">₹{item.price} each</p>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden bg-[#181818]">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-neutral-800 text-neutral-300 transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-neutral-800 text-neutral-300 transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right min-w-[70px]">
                      <p className="text-base font-extrabold text-[#FFE500] font-mono">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 transition rounded-lg hover:bg-neutral-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 sticky top-24 space-y-5">
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Order Summary</h2>

              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold font-mono">
                    {shipping === 0 ? (
                      <span className="text-[#FFE500] font-bold">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                <div className="border-t border-neutral-800 pt-3 flex justify-between text-sm font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="text-[#FFE500] text-xl font-mono">₹{total}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-[#FFE500] hover:bg-[#F5D800] text-black font-extrabold py-3.5 rounded-lg text-center transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/10 active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4 text-[11px] text-neutral-400 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck size={16} className="text-[#FFE500]" />
                  <span>Secure Payments by Cashfree</span>
                </div>
                <p>Supports UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, NetBanking, and Cash on Delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
