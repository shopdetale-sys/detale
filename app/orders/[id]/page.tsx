import Link from "next/link";
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

export function generateStaticParams() {
  return [
    { id: "ORD-948123-K7A9" },
    { id: "ORD-821940-X2B4" },
  ];
}

export default async function OrderDetailPage(props: PageProps<"/orders/[id]">) {
  const { id } = await props.params;

  // Timeline stages
  const timeline = [
    { title: "Order Placed", desc: "Received and authenticated via MSG91", time: "18 Nov, 10:30 AM", done: true },
    { title: "Payment Confirmed", desc: "Processed via Cashfree Payment Gateway", time: "18 Nov, 10:31 AM", done: true },
    { title: "Packed at Warehouse", desc: "QC verified & bubble packaged for liquids", time: "18 Nov, 02:15 PM", done: true },
    { title: "In Transit with Shiprocket", desc: "AWB #SRK-98231049 dispatched from Mumbai Hub", time: "19 Nov, 09:00 AM", done: true, current: true },
    { title: "Out for Delivery", desc: "Courier partner on the way to your doorstep", time: "Expected 20 Nov", done: false },
    { title: "Delivered", desc: "Package handed over safely", time: "Expected 20 Nov, 05:00 PM", done: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/orders"
        className="inline-flex items-center text-xs text-gray-500 hover:text-purple-700 mb-6 transition"
      >
        <ArrowLeft size={14} className="mr-1" /> Back to My Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
        <div>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Live Shipment Tracking
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 font-mono">
            {id}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Courier: <strong className="text-gray-800">Shiprocket Express Air</strong> • AWB: <strong className="text-gray-800">SRK-98231049</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-2xl text-xs font-semibold">
          <Truck size={16} />
          <span>On Schedule — Est. Delivery Tomorrow</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tracking Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
            <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package size={18} className="text-purple-700" />
              Package Journey
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-100">
              {timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div
                    className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      step.current
                        ? "bg-purple-700 text-white ring-4 ring-purple-100 animate-pulse"
                        : step.done
                        ? "bg-purple-700 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.done ? <CheckCircle2 size={13} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${step.done ? "text-gray-900" : "text-gray-400"}`}>
                        {step.title}
                      </h4>
                      {step.current && (
                        <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-bold">
                          Current Status
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in order */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Items in this Package</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl">🚗</div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Ceramic Spray Coating (SiO2)</h5>
                    <p className="text-[11px] text-gray-400">Qty: 1 • Paint Protection</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">₹1,499</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Info & Address */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <MapPin size={15} className="text-purple-700" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs text-gray-600 leading-relaxed pl-6">
              <p className="font-bold text-gray-900">Rahul Sharma</p>
              <p>+91 98765 43210</p>
              <p className="mt-1">Flat 402, Lotus Grand Residences</p>
              <p>Opposite Powai Lake Road</p>
              <p>Mumbai, Maharashtra — 400076</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <CreditCard size={15} className="text-purple-700" />
              <span>Payment Breakdown</span>
            </div>
            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold text-purple-700">Cashfree PG (UPI)</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full text-[10px]">
                  PAID
                </span>
              </div>
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹1,499</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-gray-100 pt-2">
                <span>Total Paid</span>
                <span className="text-purple-800 text-base">₹1,499</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
