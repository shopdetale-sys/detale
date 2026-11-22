"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Package, Truck, ArrowRight, Clock, CheckCircle2, ShoppingBag } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummary {
  id: string;
  createdAt: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  trackingId?: string;
}

export default function OrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleOrders: OrderSummary[] = [
      {
        id: "ORD-948123-K7A9",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
        total: 1499,
        status: "shipped",
        paymentMethod: "online (Cashfree)",
        paymentStatus: "paid",
        trackingId: "SRK-98231049",
        items: [
          { name: "Ceramic Spray Coating (SiO2)", price: 1499, quantity: 1 },
        ],
      },
      {
        id: "ORD-821940-X2B4",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
        total: 1048,
        status: "delivered",
        paymentMethod: "cod",
        paymentStatus: "paid",
        trackingId: "SRK-71829341",
        items: [
          { name: "Premium Car Wash Shampoo", price: 599, quantity: 1 },
          { name: "Tire Shine & Dressing", price: 449, quantity: 1 },
        ],
      },
    ];

    setOrders(sampleOrders);
    setLoading(false);
  }, [profile]);

  return (
    <div className="bg-black min-h-screen text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-neutral-900">
          <h1 className="text-3xl font-extrabold text-white">My Orders & Shipments</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track packages, view delivery timeline, and past invoices.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#141414] rounded-2xl border border-neutral-800 p-8">
            <div className="w-16 h-16 bg-[#181818] border border-neutral-800 text-[#FFE500] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-base font-bold text-white mb-1">No orders found</h2>
            <p className="text-xs text-neutral-400 mb-6">You haven't placed any orders with this number yet.</p>
            <Link
              href="/products"
              className="bg-[#FFE500] hover:bg-[#F5D800] text-black text-xs font-extrabold px-5 py-2.5 rounded-lg transition uppercase tracking-wider"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#141414] rounded-2xl border border-neutral-800 hover:border-neutral-700 transition p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">{order.id}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                          order.status === "delivered"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : order.status === "shipped"
                            ? "bg-[#FFE500]/20 text-[#FFE500] border border-[#FFE500]/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Total Amount</p>
                      <p className="text-base font-extrabold text-[#FFE500] font-mono">₹{order.total}</p>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-[#FFE500] hover:bg-[#F5D800] px-4 py-2 rounded-lg transition uppercase tracking-wider"
                    >
                      Track Order <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Items summary */}
                <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFE500]" />
                        <span>{item.name} × {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-400 bg-[#1C1C1C] border border-neutral-800 px-3 py-1.5 rounded-lg">
                    <Truck size={14} className="text-[#FFE500]" />
                    <span>Shiprocket AWB: <strong className="font-mono text-white">{order.trackingId}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
