import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { products as fallbackProducts, Product } from "./products";

const PRODUCTS_COLLECTION = "products";

/**
 * Fetch all products from Cloud Firestore.
 * If the collection is empty, returns fallback initial products.
 */
export async function getProductsFromFirestore(): Promise<{
  products: Product[];
  fromFirestore: boolean;
}> {
  if (!db) {
    return { products: fallbackProducts, fromFirestore: false };
  }

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      return { products: fallbackProducts, fromFirestore: false };
    }

    const items: Product[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || "Untitled Product",
        slug: data.slug || docSnap.id,
        price: Number(data.price || 0),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        rating: Number(data.rating || 5.0),
        reviews: Number(data.reviews || 0),
        image: data.image || "/products/product-1.jpg",
        badge: data.badge || undefined,
        description: data.description || "",
        features: Array.isArray(data.features) ? data.features : [],
        category: data.category || "Car Care",
        inStock: typeof data.inStock === "boolean" ? data.inStock : true,
      };
    });

    return { products: items, fromFirestore: true };
  } catch (err) {
    console.warn("Could not read products from Firestore, using local fallback:", err);
    return { products: fallbackProducts, fromFirestore: false };
  }
}

/**
 * Get a single product by slug from Cloud Firestore.
 */
export async function getProductBySlugFromFirestore(
  slug: string
): Promise<Product | undefined> {
  if (!db) {
    return fallbackProducts.find((p) => p.slug === slug);
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, slug);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        name: data.name,
        slug: data.slug || snap.id,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        rating: Number(data.rating || 5.0),
        reviews: Number(data.reviews || 0),
        image: data.image || "/products/product-1.jpg",
        badge: data.badge || undefined,
        description: data.description || "",
        features: Array.isArray(data.features) ? data.features : [],
        category: data.category || "Car Care",
        inStock: typeof data.inStock === "boolean" ? data.inStock : true,
      };
    }

    // Try fallback
    return fallbackProducts.find((p) => p.slug === slug);
  } catch (err) {
    console.warn("Firestore get product error:", err);
    return fallbackProducts.find((p) => p.slug === slug);
  }
}

/**
 * Save or update a product in Cloud Firestore.
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");

  const docId = product.slug || product.id;
  const docRef = doc(db, PRODUCTS_COLLECTION, docId);

  await setDoc(
    docRef,
    {
      ...product,
      id: docId,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

/**
 * Toggle stock status in Cloud Firestore.
 */
export async function updateProductStockInFirestore(
  id: string,
  inStock: boolean
): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");

  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    inStock,
    updatedAt: Date.now(),
  });
}

/**
 * Seed all initial car care products into Cloud Firestore batch.
 */
export async function seedProductsToFirestore(): Promise<number> {
  if (!db) throw new Error("Firestore is not initialized.");

  const batch = writeBatch(db);

  for (const product of fallbackProducts) {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.slug);
    batch.set(
      docRef,
      {
        ...product,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  }

  await batch.commit();
  return fallbackProducts.length;
}
