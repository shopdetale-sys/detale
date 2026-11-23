import { NextRequest, NextResponse } from "next/server";
import { products as fallbackProducts, Product } from "@/lib/products";
import { isFirebaseAdminConfigured, adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    if (isFirebaseAdminConfigured && adminDb) {
      const snapshot = await adminDb.collection("products").get();
      if (!snapshot.empty) {
        const firestoreProducts: Product[] = snapshot.docs.map((doc) => doc.data() as Product);
        return NextResponse.json({
          source: "firebase",
          products: firestoreProducts,
        });
      }
    }

    return NextResponse.json({
      source: "local",
      products: fallbackProducts,
    });
  } catch (error: any) {
    return NextResponse.json({
      source: "local",
      products: fallbackProducts,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const product: Product = await req.json();

    if (!product.name || !product.price) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 });
    }

    const docId = product.slug || product.id || `prod_${Date.now()}`;

    if (isFirebaseAdminConfigured && adminDb) {
      await adminDb.collection("products").doc(docId).set({
        ...product,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return NextResponse.json({
        success: true,
        source: "firebase",
        docId,
        product,
      });
    }

    return NextResponse.json({
      success: true,
      source: "local_preview",
      message: "Firebase credentials not active; product added locally for preview.",
      product,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to add product" }, { status: 500 });
  }
}
