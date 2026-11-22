// Collection names
export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  CART: "cart",
};

// Firestore document types
export interface UserDoc {
  uid: string;
  phone: string;
  name?: string;
  email?: string;
  role: "customer" | "admin";
  createdAt: number;
  addresses?: Address[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderDoc {
  id: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "online" | "cod";
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
