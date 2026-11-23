import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface OrderAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  email?: string;
}

export interface Order {
  id: string;
  userId?: string;
  userPhone: string;
  items: OrderItem[];
  address: OrderAddress;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed";
  status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  total: number;
  shippingProvider: string;
  trackingId: string;
  createdAt: number;
  updatedAt: number;
}

const ORDERS_COLLECTION = "orders";

const fallbackSampleOrders: Order[] = [
  {
    id: "ORD-948123-K7A9",
    userPhone: "9876543210",
    userId: "user_sample_1",
    total: 1499,
    subtotal: 1499,
    shipping: 0,
    status: "shipped",
    paymentMethod: "online (Cashfree)",
    paymentStatus: "paid",
    shippingProvider: "Shiprocket Express Air",
    trackingId: "SRK-98231049",
    address: {
      name: "Rahul Sharma",
      phone: "9876543210",
      line1: "Flat 402, Lotus Grand Residences",
      line2: "Opposite Powai Lake Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076",
    },
    items: [
      {
        name: "Ceramic Spray Coating (SiO2)",
        price: 1499,
        quantity: 1,
        image: "/products/product-2.jpg",
        category: "Paint Protection",
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: "ORD-821940-X2B4",
    userPhone: "9811223344",
    userId: "user_sample_2",
    total: 1048,
    subtotal: 1048,
    shipping: 0,
    status: "delivered",
    paymentMethod: "cod",
    paymentStatus: "paid",
    shippingProvider: "Shiprocket Surface",
    trackingId: "SRK-71829341",
    address: {
      name: "Amit Patel",
      phone: "9811223344",
      line1: "Plot 14, Shivalik Enclave",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
    },
    items: [
      {
        name: "Premium Car Wash Shampoo",
        price: 599,
        quantity: 1,
        image: "/products/product-1.jpg",
        category: "Exterior Wash",
      },
      {
        name: "Tire Shine & Dressing",
        price: 449,
        quantity: 1,
        image: "/products/product-4.jpg",
        category: "Tire & Wheel Care",
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "ORD-719302-P3C1",
    userPhone: "9765432109",
    userId: "user_sample_3",
    total: 2348,
    subtotal: 2348,
    shipping: 0,
    status: "delivered",
    paymentMethod: "online (Cashfree)",
    paymentStatus: "paid",
    shippingProvider: "Shiprocket Express",
    trackingId: "SRK-63109245",
    address: {
      name: "Vikram Malhotra",
      phone: "9765432109",
      line1: "B-12, Defence Colony",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110024",
    },
    items: [
      {
        name: "Clay Bar Kit",
        price: 849,
        quantity: 1,
        category: "Surface Preparation",
      },
      {
        name: "Ceramic Spray Coating (SiO2)",
        price: 1499,
        quantity: 1,
        category: "Paint Protection",
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
];

/**
 * Save an order to Cloud Firestore.
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(docRef, {
      ...order,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn("Could not save order to Firestore:", err);
  }
}

/**
 * Fetch all orders or filter by userPhone from Cloud Firestore.
 */
export async function getOrdersFromFirestore(userPhone?: string): Promise<{
  orders: Order[];
  fromFirestore: boolean;
}> {
  if (!db) {
    return { orders: fallbackSampleOrders, fromFirestore: false };
  }

  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      // Seed sample orders to Firestore so the user has immediate data
      await seedSampleOrdersToFirestore();
      return { orders: fallbackSampleOrders, fromFirestore: true };
    }

    let items: Order[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        userPhone: data.userPhone || "",
        items: data.items || [],
        address: data.address || {
          name: "Customer",
          phone: data.userPhone || "",
          line1: "",
          city: "",
          state: "",
          pincode: "",
        },
        paymentMethod: data.paymentMethod || "cod",
        paymentStatus: data.paymentStatus || "pending",
        status: data.status || "confirmed",
        subtotal: Number(data.subtotal || data.total || 0),
        shipping: Number(data.shipping || 0),
        total: Number(data.total || 0),
        shippingProvider: data.shippingProvider || "Shiprocket Express",
        trackingId: data.trackingId || `SRK-${d.id.slice(-6)}`,
        createdAt: Number(data.createdAt || Date.now()),
        updatedAt: Number(data.updatedAt || Date.now()),
      };
    });

    // Sort newest first
    items.sort((a, b) => b.createdAt - a.createdAt);

    if (userPhone) {
      const cleanPhone = userPhone.replace(/\D/g, "").slice(-10);
      const filtered = items.filter((o) =>
        o.userPhone.replace(/\D/g, "").slice(-10).includes(cleanPhone)
      );
      if (filtered.length > 0) items = filtered;
    }

    return { orders: items, fromFirestore: true };
  } catch (err) {
    console.warn("Could not fetch orders from Firestore:", err);
    return { orders: fallbackSampleOrders, fromFirestore: false };
  }
}

/**
 * Get single order by order ID from Cloud Firestore.
 */
export async function getOrderByIdFromFirestore(orderId: string): Promise<Order | undefined> {
  if (!db) {
    return fallbackSampleOrders.find((o) => o.id === orderId);
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        userId: data.userId,
        userPhone: data.userPhone || "",
        items: data.items || [],
        address: data.address || {
          name: "Customer",
          phone: data.userPhone || "",
          line1: "",
          city: "",
          state: "",
          pincode: "",
        },
        paymentMethod: data.paymentMethod || "cod",
        paymentStatus: data.paymentStatus || "pending",
        status: data.status || "confirmed",
        subtotal: Number(data.subtotal || data.total || 0),
        shipping: Number(data.shipping || 0),
        total: Number(data.total || 0),
        shippingProvider: data.shippingProvider || "Shiprocket Express",
        trackingId: data.trackingId || `SRK-${snap.id.slice(-6)}`,
        createdAt: Number(data.createdAt || Date.now()),
        updatedAt: Number(data.updatedAt || Date.now()),
      };
    }

    return fallbackSampleOrders.find((o) => o.id === orderId);
  } catch (err) {
    console.warn("Could not fetch order from Firestore:", err);
    return fallbackSampleOrders.find((o) => o.id === orderId);
  }
}

/**
 * Update order status (confirmed, shipped, delivered) in Cloud Firestore.
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn("Could not update order status in Firestore:", err);
  }
}

/**
 * Seed sample orders to Firestore.
 */
export async function seedSampleOrdersToFirestore(): Promise<void> {
  if (!db) return;
  try {
    for (const order of fallbackSampleOrders) {
      const docRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(docRef, order, { merge: true });
    }
  } catch (err) {
    console.warn("Could not seed orders to Firestore:", err);
  }
}
