import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";
import { isFirebaseAdminConfigured, adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    if (!isFirebaseAdminConfigured || !adminDb) {
      return NextResponse.json({
        success: false,
        message: "Firebase Admin is not configured yet. Please add your Firebase credentials in .env.local",
        isConfigured: false,
      }, { status: 400 });
    }

    const batch = adminDb.batch();
    const productsRef = adminDb.collection("products");

    for (const product of products) {
      const docRef = productsRef.doc(product.slug);
      batch.set(docRef, {
        ...product,
        updatedAt: Date.now(),
      }, { merge: true });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${products.length} car care products into Cloud Firestore collection 'products'`,
      count: products.length,
    });
  } catch (error: any) {
    console.error("Firestore seed error:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Failed to seed products into Firebase",
    }, { status: 500 });
  }
}
