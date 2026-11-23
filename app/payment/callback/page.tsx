"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Package, Home } from "lucide-react";
import { useCart } from "@/lib/cart-context";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = searchParams.get("order_id");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setErrorMsg("No order ID provided in callback");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (data.isPaid || data.orderStatus === "PAID") {
          setSuccess(true);
          clearCart();
        } else {
          setSuccess(false);
          setErrorMsg(data.error || "Payment was not completed.");
        }
      } catch (err: any) {
        setSuccess(false);
        setErrorMsg(err.message || "Could not verify payment");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-black min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-white">
        <Loader2 className="w-12 h-12 text-[#9D6EFF] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-1">Verifying Cashfree Payment...</h2>
        <p className="text-xs text-neutral-400">Please do not refresh or close this page.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-black min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full p-8 bg-[#141414] rounded-3xl border border-neutral-800 shadow-2xl text-center text-white">
          <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Payment Successful
          </span>
          <h1 className="text-2xl font-black text-white mt-3 mb-2">Order Confirmed!</h1>
          <p className="text-xs text-neutral-400 mb-6">
            Thank you for choosing Detale. Your car care products are being prepared for dispatch.
          </p>

          <div className="bg-[#1C1C1C] rounded-2xl p-4 text-xs text-left mb-6 space-y-2 border border-neutral-800">
            <div className="flex justify-between">
              <span className="text-neutral-400">Order Reference:</span>
              <span className="font-mono font-bold text-white">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Payment Gateway:</span>
              <span className="font-semibold text-[#9D6EFF]">Cashfree PG</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Shipping Partner:</span>
              <span className="font-medium text-white">Shiprocket Express</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/orders/${orderId}`}
              className="w-full bg-[#4D2C9C] hover:bg-[#6D3EE6] text-white font-extrabold py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-purple-900/40"
            >
              <Package size={14} /> Track Delivery Status
            </Link>
            <Link
              href="/"
              className="w-full bg-[#1C1C1C] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Home size={14} /> Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full p-8 bg-[#141414] rounded-3xl border border-neutral-800 shadow-2xl text-center text-white">
        <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 mx-auto mb-4">
          <XCircle size={36} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment Failed or Cancelled</h1>
        <p className="text-xs text-neutral-400 mb-6">{errorMsg || "Your payment could not be processed."}</p>
        <div className="flex gap-3">
          <Link
            href="/checkout"
            className="flex-1 bg-[#4D2C9C] hover:bg-[#6D3EE6] text-white font-extrabold py-3 rounded-xl transition text-xs uppercase tracking-wider shadow-md shadow-purple-900/30"
          >
            Try Again
          </Link>
          <Link
            href="/cart"
            className="flex-1 bg-[#1C1C1C] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading payment details...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
