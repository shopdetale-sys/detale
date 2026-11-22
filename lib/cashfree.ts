const CASHFREE_ENV = process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox";

const BASE_URL =
  CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export interface CreateOrderParams {
  orderId: string;
  orderAmount: number; // in INR
  customerPhone: string;
  customerName?: string;
  customerEmail?: string;
  returnUrl?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  payment_session_id: string;
  order_expiry_time?: string;
}

export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey || appId === "your_cashfree_app_id") {
    // Return a mocked session in development/sandbox if keys aren't set yet
    console.warn("Cashfree API keys not set or placeholder. Using mock payment session.");
    return {
      cf_order_id: `cf_mock_${params.orderId}`,
      order_id: params.orderId,
      entity: "order",
      order_currency: "INR",
      order_amount: params.orderAmount,
      order_status: "ACTIVE",
      payment_session_id: `session_mock_${Date.now()}`,
    };
  }

  const phoneDigits = params.customerPhone.replace(/\D/g, "").slice(-10);
  const customerId = `cust_${phoneDigits || Date.now()}`;

  const payload = {
    order_id: params.orderId,
    order_amount: Math.round(params.orderAmount * 100) / 100,
    order_currency: "INR",
    customer_details: {
      customer_id: customerId,
      customer_name: params.customerName || "Customer",
      customer_phone: phoneDigits || "9876543210",
      customer_email: params.customerEmail || `${phoneDigits}@detale.in`,
    },
    order_meta: {
      return_url:
        params.returnUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/callback?order_id={order_id}`,
    },
  };

  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to create Cashfree order");
  }

  return data;
}

export async function getCashfreeOrderStatus(orderId: string) {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey || appId === "your_cashfree_app_id" || orderId.startsWith("mock_")) {
    return {
      order_id: orderId,
      order_status: "PAID",
      order_amount: 599,
      is_mock: true,
    };
  }

  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order status from Cashfree");
  }

  return data;
}
