import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrderStatus } from "@/lib/cashfree";
import { isFirebaseAdminConfigured, adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const cfOrder = await getCashfreeOrderStatus(orderId);
    const isPaid = cfOrder.order_status === "PAID" || cfOrder.is_mock;

    // Update in Firestore
    if (isFirebaseAdminConfigured && adminDb) {
      try {
        await adminDb.collection("orders").doc(orderId).update({
          paymentStatus: isPaid ? "paid" : "failed",
          status: isPaid ? "confirmed" : "pending",
          cashfreeOrderId: cfOrder.cf_order_id || null,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.warn("Could not update order in Firestore:", err);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderStatus: isPaid ? "PAID" : cfOrder.order_status,
      isPaid,
    });
  } catch (error: any) {
    console.error("Cashfree verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
