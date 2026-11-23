import { NextRequest, NextResponse } from "next/server";
import { createCashfreeOrder } from "@/lib/cashfree";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, customerPhone, customerName, customerEmail } = await req.json();

    if (!orderId || !amount || !customerPhone) {
      return NextResponse.json(
        { error: "orderId, amount, and customerPhone are required" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const returnUrl = `${protocol}://${host}/payment/callback?order_id=${orderId}`;

    const cfOrder = await createCashfreeOrder({
      orderId,
      orderAmount: amount,
      customerPhone,
      customerName,
      customerEmail,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      orderId: cfOrder.order_id,
      cfOrderId: cfOrder.cf_order_id,
      paymentSessionId: cfOrder.payment_session_id,
      orderStatus: cfOrder.order_status,
      returnUrl,
    });
  } catch (error: any) {
    console.error("Cashfree order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create Cashfree payment order" },
      { status: 500 }
    );
  }
}
