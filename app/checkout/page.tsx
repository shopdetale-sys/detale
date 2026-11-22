"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Lock,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { profile } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<"cashfree" | "cod">("cashfree");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    line1: "",
    line2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      return "Please enter a valid 10-digit mobile number.";
    if (!formData.line1.trim()) return "Please enter your address.";
    if (!formData.city.trim()) return "Please enter your city.";
    if (!/^\d{6}$/.test(formData.pincode.trim())) return "Please enter a 6-digit pin code.";
    return null;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in Backend / Firestore
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address: formData,
          paymentMethod: paymentMethod === "cashfree" ? "online" : "cod",
          subtotal,
          shipping,
          total,
          userId: profile?.uid,
          userPhone: formData.phone,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      const createdOrderId = orderData.orderId;

      // 2. Handle Payment Method
      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/payment/callback?order_id=${createdOrderId}`);
      } else {
        // Cashfree Online Payment
        const paymentRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: createdOrderId,
            amount: total,
            customerPhone: formData.phone,
            customerName: formData.name,
            customerEmail: formData.email,
          }),
        });

        const paymentData = await paymentRes.json();
        if (!paymentRes.ok) throw new Error(paymentData.error || "Failed to initiate Cashfree payment");

        router.push(`/payment/callback?order_id=${createdOrderId}`);
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-[70vh] flex items-center justify-center py-24 px-4 text-center text-white">
        <div className="max-w-md w-full">
          <div className="w-20 h-20 bg-[#181818] border border-neutral-800 rounded-full flex items-center justify-center text-[#FFE500] mx-auto mb-4">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">No Items in Cart</h1>
          <p className="text-xs text-neutral-400 mb-6">Add car care products to your cart before checking out.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#FFE500] hover:bg-[#F5D800] text-black font-extrabold px-6 py-3 rounded-lg text-xs transition uppercase tracking-wider"
          >
            Browse Products <ArrowRight size={14} />
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
            <Link href="/cart" className="inline-flex items-center text-xs text-neutral-400 hover:text-[#FFE500] mb-1 transition">
              <ArrowLeft size={14} className="mr-1" /> Back to Cart
            </Link>
            <h1 className="text-3xl font-extrabold text-white">Secure Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#FFE500] bg-[#181818] border border-neutral-800 px-3 py-1.5 rounded-full font-bold">
            <Lock size={13} />
            <span>256-Bit Encrypted</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-500/40 rounded-xl p-4 mb-6">
            <p className="text-xs text-red-400 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Delivery & Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Shipping Address */}
            <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <div className="w-6 h-6 rounded-full bg-[#FFE500] text-black text-xs font-black flex items-center justify-center">
                  1
                </div>
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#FFE500] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#FFE500] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Street Address / House / Flat No. *
                  </label>
                  <input
                    type="text"
                    name="line1"
                    required
                    placeholder="House number, apartment, street name"
                    value={formData.line1}
                    onChange={handleInputChange}
                    className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#FFE500] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Landmark / Area (Optional)
                  </label>
                  <input
                    type="text"
                    name="line2"
                    placeholder="Near petrol pump, opposite metro station"
                    value={formData.line2}
                    onChange={handleInputChange}
                    className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#FFE500] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#FFE500] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-white focus:border-[#FFE500] outline-none"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="e.g. 400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#FFE500] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Payment Method */}
            <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <div className="w-6 h-6 rounded-full bg-[#FFE500] text-black text-xs font-black flex items-center justify-center">
                  2
                </div>
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cashfree Online Option */}
                <label
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === "cashfree"
                      ? "border-[#FFE500] bg-yellow-500/5"
                      : "border-neutral-800 hover:border-neutral-700 bg-[#181818]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cashfree"}
                        onChange={() => setPaymentMethod("cashfree")}
                        className="accent-[#FFE500] w-4 h-4"
                      />
                      <span className="font-bold text-sm text-white">Online Payment</span>
                    </div>
                    <span className="text-[10px] bg-[#FFE500] text-black font-extrabold px-2 py-0.5 rounded">
                      Cashfree PG
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 pl-6">
                    UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, NetBanking.
                  </p>
                  <div className="flex gap-2 pl-6 mt-3 text-[11px] text-[#FFE500] font-bold items-center">
                    <Sparkles size={12} />
                    <span>Instant order confirmation</span>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-[#FFE500] bg-yellow-500/5"
                      : "border-neutral-800 hover:border-neutral-700 bg-[#181818]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-[#FFE500] w-4 h-4"
                      />
                      <span className="font-bold text-sm text-white">Cash on Delivery</span>
                    </div>
                    <Truck size={16} className="text-neutral-400" />
                  </div>
                  <p className="text-xs text-neutral-400 pl-6">Pay cash or UPI upon delivery at your doorstep.</p>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 sticky top-24 space-y-5">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Order Summary ({items.length} items)
              </h3>

              <div className="divide-y divide-neutral-800 max-h-56 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 h-5 rounded bg-[#202020] text-[#FFE500] flex items-center justify-center font-bold text-[10px]">
                        {i.quantity}×
                      </span>
                      <span className="truncate text-neutral-300 font-medium">{i.name}</span>
                    </div>
                    <span className="font-bold text-white font-mono flex-shrink-0">
                      ₹{i.price * i.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping via Shiprocket</span>
                  <span className="font-semibold font-mono">
                    {shipping === 0 ? <span className="text-[#FFE500] font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-neutral-800 pt-3 flex justify-between text-base font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-[#FFE500] text-xl font-mono">₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFE500] hover:bg-[#F5D800] disabled:opacity-50 text-black font-extrabold py-3.5 rounded-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/10 active:scale-[0.98]"
              >
                {loading ? (
                  "Processing Order..."
                ) : (
                  <>
                    {paymentMethod === "cashfree" ? "Pay via Cashfree" : "Confirm COD Order"}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck size={14} className="text-[#FFE500]" />
                <span>Cashfree Verified • 100% Genuine Detailing</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
