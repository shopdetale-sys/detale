import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { getOrderByIdFromFirestore, getOrdersFromFirestore } from "@/lib/orders-service";

export async function generateStaticParams() {
  try {
    const { orders } = await getOrdersFromFirestore();
    return orders.map((o) => ({ id: o.id }));
  } catch {
    return [
      { id: "ORD-948123-K7A9" },
      { id: "ORD-821940-X2B4" },
    ];
  }
}

export default async function OrderDetailPage(props: PageProps<"/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrderByIdFromFirestore(id);
  if (!order) notFound();

  // Timeline stages calculated based on order.status
  const isDelivered = order.status === "delivered";
  const isShipped = order.status === "shipped" || isDelivered;
  const isProcessing = order.status === "processing" || order.status === "confirmed" || isShipped;

  const timeline = [
    {
      title: "Order Placed",
      desc: "Received and authenticated via MSG91",
      time: new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      done: true,
    },
    {
      title: "Payment Confirmed",
      desc: `Processed via ${order.paymentMethod}`,
      time: new Date(order.createdAt + 60000).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      done: order.paymentStatus === "paid" || order.paymentMethod.toLowerCase().includes("cod"),
    },
    {
      title: "Packed at Warehouse",
      desc: "QC verified & bubble packaged for liquids",
      time: isProcessing ? "Completed" : "In Progress",
      done: isProcessing,
    },
    {
      title: `In Transit with ${order.shippingProvider || "Shiprocket Express"}`,
      desc: `AWB #${order.trackingId} dispatched from Hub`,
      time: isShipped ? "Dispatched" : "Pending Dispatch",
      done: isShipped,
      current: order.status === "shipped",
    },
    {
      title: "Out for Delivery",
      desc: "Courier partner on the way to your doorstep",
      time: isDelivered ? "Completed" : "Expected in 24-48 Hours",
      done: isDelivered,
    },
    {
      title: "Delivered",
      desc: "Package handed over safely",
      time: isDelivered ? "Delivered" : "Pending Delivery",
      done: isDelivered,
      current: isDelivered,
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-xs text-neutral-400 hover:text-[#9D6EFF] mb-6 transition"
        >
          <ArrowLeft size={14} className="mr-1" /> Back to My Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
          <div>
            <span className="text-[11px] font-bold text-[#9D6EFF] bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Live Shipment Tracking • Cloud Firestore
            </span>
            <h1 className="text-2xl font-bold text-white mt-2 font-mono">
              {order.id}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Courier: <strong className="text-white">{order.shippingProvider}</strong> • AWB: <strong className="text-white">{order.trackingId}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-2xl text-xs font-semibold">
            <Truck size={16} />
            <span>{isDelivered ? "Package Delivered Successfully" : "On Schedule — In Transit"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tracking Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#141414] rounded-3xl border border-neutral-800 p-6">
              <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <Package size={18} className="text-[#9D6EFF]" />
                Package Journey
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-900/40">
                {timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        step.current
                          ? "bg-[#6D3EE6] text-white ring-4 ring-purple-500/20 animate-pulse"
                          : step.done
                          ? "bg-[#4D2C9C] text-white"
                          : "bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {step.done ? <CheckCircle2 size={13} /> : <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${step.done ? "text-white" : "text-neutral-500"}`}>
                          {step.title}
                        </h4>
                        {step.current && (
                          <span className="text-[10px] bg-[#4D2C9C] text-white px-2 py-0.5 rounded-full font-bold">
                            Current Status
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{step.desc}</p>
                      <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items in order */}
            <div className="bg-[#141414] rounded-3xl border border-neutral-800 p-6">
              <h3 className="text-sm font-bold text-white mb-4">Items in this Package</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-neutral-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1C1C1C] border border-neutral-800 flex items-center justify-center text-xl overflow-hidden">
                        {item.image && (item.image.startsWith("http") || item.image.startsWith("/")) && !item.image.includes("product-") ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          "🚗"
                        )}
                      </div>
                      <div>
                        <h5 className="font-semibold text-white">{item.name}</h5>
                        <p className="text-[11px] text-neutral-400">Qty: {item.quantity} • {item.category || "Car Care"}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Info & Address */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-[#141414] rounded-3xl border border-neutral-800 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MapPin size={15} className="text-[#9D6EFF]" />
                <span>Delivery Address</span>
              </div>
              <div className="text-xs text-neutral-300 leading-relaxed pl-6">
                <p className="font-bold text-white">{order.address.name}</p>
                <p>+91 {order.address.phone}</p>
                <p className="mt-1">{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-[#141414] rounded-3xl border border-neutral-800 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <CreditCard size={15} className="text-[#9D6EFF]" />
                <span>Payment Breakdown</span>
              </div>
              <div className="space-y-2 text-xs text-neutral-300 border-t border-neutral-800 pt-3">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold text-[#9D6EFF]">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    order.paymentStatus === "paid"
                      ? "text-emerald-400 bg-emerald-950/40 border border-emerald-500/30"
                      : "text-amber-400 bg-amber-950/40 border border-amber-500/30"
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-white">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-bold">
                    {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white border-t border-neutral-800 pt-2">
                  <span>Total Amount</span>
                  <span className="text-white font-mono text-base">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  );
}
