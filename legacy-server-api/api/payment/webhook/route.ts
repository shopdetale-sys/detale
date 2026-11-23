import { NextRequest, NextResponse } from "next/server";
import { isFirebaseAdminConfigured, adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = body.data || body;
    const orderId = data.order?.order_id || data.order_id;
    const paymentStatus = data.payment?.payment_status || data.order_status;

    if (orderId && isFirebaseAdminConfigured && adminDb) {
      const isPaid = paymentStatus === "SUCCESS" || paymentStatus === "PAID";
      await adminDb.collection("orders").doc(orderId).update({
        paymentStatus: isPaid ? "paid" : "failed",
        status: isPaid ? "confirmed" : "pending",
        cashfreePaymentId: data.payment?.cf_payment_id || null,
        updatedAt: Date.now(),
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Cashfree webhook error:", error);
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
}
