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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-purple-700 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Verifying Cashfree Payment...</h2>
        <p className="text-xs text-gray-500">Please do not refresh or close this page.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-gray-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-[11px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Payment Successful
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-2">Order Confirmed!</h1>
        <p className="text-xs text-gray-500 mb-6">
          Thank you for choosing Detale. Your car care products are being prepared for dispatch.
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 text-xs text-left mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Reference:</span>
            <span className="font-mono font-bold text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Gateway:</span>
            <span className="font-semibold text-purple-700">Cashfree PG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping Partner:</span>
            <span className="font-medium text-gray-800">Shiprocket Express</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/orders/${orderId}`}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
          >
            <Package size={14} /> Track Delivery Status
          </Link>
          <Link
            href="/"
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
          >
            <Home size={14} /> Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-gray-100 shadow-xl text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
        <XCircle size={36} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed or Cancelled</h1>
      <p className="text-xs text-gray-500 mb-6">{errorMsg || "Your payment could not be processed."}</p>
      <div className="flex gap-3">
        <Link
          href="/checkout"
          className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition text-xs"
        >
          Try Again
        </Link>
        <Link
          href="/cart"
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition text-xs"
        >
          Return to Cart
        </Link>
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
