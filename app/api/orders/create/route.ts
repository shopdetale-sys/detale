import { NextRequest, NextResponse } from "next/server";
import { isFirebaseAdminConfigured, adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, address, paymentMethod, subtotal, shipping, total, userId, userPhone } = body;

    if (!items || items.length === 0 || !address) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const orderData = {
      id: orderId,
      userId: userId || `guest_${userPhone || Date.now()}`,
      userPhone: userPhone || address.phone,
      items,
      address,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      status: paymentMethod === "cod" ? "confirmed" : "pending",
      subtotal,
      shipping,
      total,
      shippingProvider: "Shiprocket Express",
      trackingId: `SRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save to Firestore if configured
    if (isFirebaseAdminConfigured && adminDb) {
      try {
        await adminDb.collection("orders").doc(orderId).set(orderData);
      } catch (err) {
        console.warn("Firestore order save warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      order: orderData,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: error?.message || "Failed to create order" }, { status: 500 });
  }
}
