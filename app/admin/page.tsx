"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertCircle,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { products } from "@/lib/products";

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-948123-K7A9",
      customer: "Rahul Sharma",
      phone: "+91 98765 43210",
      total: 1499,
      paymentMethod: "Cashfree (UPI)",
      paymentStatus: "paid",
      status: "shipped",
      date: "Just now",
    },
    {
      id: "ORD-821940-X2B4",
      customer: "Amit Patel",
      phone: "+91 98112 23344",
      total: 1048,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      status: "confirmed",
      date: "2 hours ago",
    },
    {
      id: "ORD-719302-P3C1",
      customer: "Vikram Malhotra",
      phone: "+91 97654 32109",
      total: 2348,
      paymentMethod: "Cashfree (Cards)",
      paymentStatus: "paid",
      status: "delivered",
      date: "Yesterday",
    },
    {
      id: "ORD-610294-M8Q5",
      customer: "Neha Verma",
      phone: "+91 99887 76655",
      total: 599,
      paymentMethod: "Cashfree (UPI)",
      paymentStatus: "paid",
      status: "confirmed",
      date: "2 days ago",
    },
  ]);

  const kpis = [
    { label: "Total Revenue", value: "₹3,42,890", change: "+18.4% this month", icon: TrendingUp, color: "text-purple-700 bg-purple-50" },
    { label: "Orders Processed", value: "284", change: "+12 new today", icon: ShoppingBag, color: "text-blue-700 bg-blue-50" },
    { label: "Active Products", value: `${products.length} Items`, change: "1 Category: Car Care", icon: Package, color: "text-emerald-700 bg-emerald-50" },
    { label: "Inventory Alerts", value: "1 Low Stock", change: "Engine Bay Degreaser", icon: AlertCircle, color: "text-amber-700 bg-amber-50" },
  ];

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics for Detale Car Care products, Cashfree transactions, and shipments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="text-xs font-semibold bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            Manage Catalog & Stock
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-500">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${kpi.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900">{kpi.value}</h3>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live orders awaiting processing or in transit.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            View all orders <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3.5 pl-2 font-mono font-bold text-gray-800">
                    <Link href={`/orders/${order.id}`} className="hover:text-purple-700">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-3.5">
                    <p className="font-semibold text-gray-900">{order.customer}</p>
                    <p className="text-[10px] text-gray-400">{order.phone}</p>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-700">{order.paymentMethod}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 font-bold text-gray-900">₹{order.total}</td>
                  <td className="py-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-[11px] font-bold rounded-lg px-2.5 py-1 outline-none border ${
                        order.status === "delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.status === "shipped"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-purple-700 hover:text-purple-900 font-semibold text-[11px]"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
