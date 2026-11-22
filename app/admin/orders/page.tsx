"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState([
    {
      id: "ORD-948123-K7A9",
      customer: "Rahul Sharma",
      phone: "+91 98765 43210",
      city: "Mumbai, MH",
      itemsCount: 1,
      total: 1499,
      paymentMethod: "Cashfree (UPI)",
      paymentStatus: "paid",
      status: "shipped",
      courier: "Shiprocket Air",
      trackingId: "SRK-98231049",
      date: "18 Nov, 10:30 AM",
    },
    {
      id: "ORD-821940-X2B4",
      customer: "Amit Patel",
      phone: "+91 98112 23344",
      city: "Ahmedabad, GJ",
      itemsCount: 2,
      total: 1048,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      status: "confirmed",
      courier: "Shiprocket Surface",
      trackingId: "SRK-71829341",
      date: "18 Nov, 08:15 AM",
    },
    {
      id: "ORD-719302-P3C1",
      customer: "Vikram Malhotra",
      phone: "+91 97654 32109",
      city: "Delhi, DL",
      itemsCount: 3,
      total: 2348,
      paymentMethod: "Cashfree (Cards)",
      paymentStatus: "paid",
      status: "delivered",
      courier: "Shiprocket Express",
      trackingId: "SRK-63109245",
      date: "17 Nov, 04:45 PM",
    },
    {
      id: "ORD-610294-M8Q5",
      customer: "Neha Verma",
      phone: "+91 99887 76655",
      city: "Bengaluru, KA",
      itemsCount: 1,
      total: 599,
      paymentMethod: "Cashfree (NetBanking)",
      paymentStatus: "paid",
      status: "pending",
      courier: "Unassigned",
      trackingId: "-",
      date: "16 Nov, 02:20 PM",
    },
  ]);

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === "all" || o.status === filter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders & Fulfillment</h1>
          <p className="text-xs text-gray-500 mt-1">
            Dispatch, verify Cashfree payments, and track Shiprocket deliveries.
          </p>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "pending", "confirmed", "shipped", "delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                filter === tab
                  ? "bg-purple-700 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl w-full sm:w-72">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 border-b border-gray-100 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Order ID & Date</th>
                <th className="py-3.5">Customer & City</th>
                <th className="py-3.5">Payment</th>
                <th className="py-3.5">Shipment & AWB</th>
                <th className="py-3.5">Amount</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-6">Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-4 pl-6">
                    <p className="font-mono font-bold text-gray-900">{order.id}</p>
                    <p className="text-[10px] text-gray-400">{order.date}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-gray-900">{order.customer}</p>
                    <p className="text-[10px] text-gray-500">{order.city} • {order.phone}</p>
                  </td>
                  <td className="py-4">
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
                  <td className="py-4">
                    <p className="font-medium text-gray-800">{order.courier}</p>
                    <p className="font-mono text-[10px] text-purple-700 font-semibold">{order.trackingId}</p>
                  </td>
                  <td className="py-4 font-bold text-gray-900">₹{order.total}</td>
                  <td className="py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-[11px] font-bold rounded-lg px-2 py-1 outline-none border border-gray-200 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-4 text-right pr-6">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold text-[11px]"
                    >
                      View <ExternalLink size={12} />
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
