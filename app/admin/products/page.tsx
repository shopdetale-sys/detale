"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { products as initialProducts, Product } from "@/lib/products";
import {
  getProductsFromFirestore,
  saveProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  updateProductStockInFirestore,
  seedProductsToFirestore,
} from "@/lib/products-service";
import { uploadProductImage } from "@/lib/storage";
import {
  Plus,
  Search,
  X,
  CloudUpload,
  Loader2,
  Upload,
  Database,
  Pencil,
  Trash2,
} from "lucide-react";

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Exterior Wash",
    price: "",
    originalPrice: "",
    badge: "",
    description: "",
    inStock: true,
    image: "",
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = useCallback(async () => {
    try {
      const { products, fromFirestore } = await getProductsFromFirestore();
      setItems(products);
      setIsFirestoreConnected(fromFirestore);
      if (fromFirestore) {
        setSyncStatus("Connected to live Firebase Cloud Firestore");
      }
    } catch (err: unknown) {
      setSyncStatus(
        `Unable to load products: ${err instanceof Error ? err.message : "Unexpected error"}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getProductsFromFirestore()
      .then(({ products, fromFirestore }) => {
        if (!active) return;
        setItems(products);
        setIsFirestoreConnected(fromFirestore);
        if (fromFirestore) {
          setSyncStatus("Connected to live Firebase Cloud Firestore");
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        setSyncStatus(
          `Unable to load products: ${err instanceof Error ? err.message : "Unexpected error"}`
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSeedFirebase = async () => {
    setSeeding(true);
    setSyncStatus(null);
    try {
      const count = await seedProductsToFirestore();
      setSyncStatus(`✅ Successfully seeded ${count} car care products to Firebase Cloud Firestore!`);
      setIsFirestoreConnected(true);
      setLoading(true);
      await loadProducts();
    } catch (err: unknown) {
      setSyncStatus(
        `Seed error: ${err instanceof Error ? err.message : "Unexpected error"}`
      );
    } finally {
      setSeeding(false);
    }
  };

  const toggleStock = async (id: string, currentStock: boolean) => {
    const updatedStock = !currentStock;
    // Optimistic UI update
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: updatedStock } : p))
    );

    try {
      await updateProductStockInFirestore(id, updatedStock);
      setSyncStatus(`Updated stock status in Firebase for item: ${id}`);
    } catch (err: unknown) {
      setItems((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, inStock: currentStock } : product
        )
      );
      setSyncStatus(
        `Unable to update stock: ${err instanceof Error ? err.message : "Unexpected error"}`
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const slug = newProduct.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) {
      setSyncStatus("Product name must contain at least one letter or number.");
      return;
    }

    const conflictingProduct = items.find(
      (product) =>
        product.slug === slug && product.id !== editingProduct?.id
    );
    if (conflictingProduct) {
      setSyncStatus(`A product named "${conflictingProduct.name}" already uses this product URL.`);
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = newProduct.image || "/products/product-1.jpg";

    try {
      // 1. Upload image to Firebase Storage if a file was selected
      if (imageFile) {
        setUploadProgress(10);
        finalImageUrl = await uploadProductImage(imageFile, (progress) => {
          setUploadProgress(progress);
        });
      }

      // 2. Prepare product object
      const savedProduct: Product = {
        ...(editingProduct ?? {
          rating: 5.0,
          reviews: 0,
          features: ["Professional grade", "Long lasting shine", "Safe on coatings"],
        }),
        id: slug,
        name: newProduct.name,
        slug,
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
        category: newProduct.category,
        badge: newProduct.badge || undefined,
        description: newProduct.description || (editingProduct?.description ?? "Premium automotive care formulation."),
        image: finalImageUrl,
        inStock: newProduct.inStock,
      };

      if (editingProduct) {
        await updateProductInFirestore(editingProduct.id, savedProduct);
      } else {
        await saveProductToFirestore(savedProduct);
      }

      setItems((currentItems) =>
        editingProduct
          ? currentItems.map((product) =>
              product.id === editingProduct.id ? savedProduct : product
            )
          : [savedProduct, ...currentItems.filter((product) => product.slug !== slug)]
      );
      setShowAddModal(false);
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(null);
      setSyncStatus(editingProduct ? "Product updated successfully." : "Product added successfully.");
      setNewProduct({
        name: "",
        category: "Exterior Wash",
        price: "",
        originalPrice: "",
        badge: "",
        description: "",
        inStock: true,
        image: "",
      });
    } catch (err) {
      setSyncStatus(
        `Unable to ${editingProduct ? "update" : "save"} product: ${
          err instanceof Error ? err.message : "Unexpected error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      badge: product.badge ?? "",
      description: product.description,
      inStock: product.inStock,
      image: product.image,
    });
    setImageFile(null);
    setImagePreview(product.image);
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      category: "Exterior Wash",
      price: "",
      originalPrice: "",
      badge: "",
      description: "",
      inStock: true,
      image: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setShowAddModal(true);
  };

  const closeProductModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(null);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setDeletingProductId(product.id);
    try {
      await deleteProductFromFirestore(product.id);
      setItems((currentItems) => currentItems.filter((item) => item.id !== product.id));
      setSyncStatus(`Deleted "${product.name}".`);
    } catch (err) {
      setSyncStatus(
        `Unable to delete product: ${
          err instanceof Error ? err.message : "Unexpected error"
        }`
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Products & Firebase Storage</h1>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isFirestoreConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              <Database size={12} />
              {isFirestoreConnected ? "Firebase Firestore: Live" : "Local / Firestore Hybrid"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Category: <strong>Car Care Products</strong> • Bucket: <strong>detale-bf5ea.firebasestorage.app</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeedFirebase}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-900 hover:bg-black text-white px-3.5 py-2.5 rounded-xl transition shadow-xs"
          >
            {seeding ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Uploading to Firestore...
              </>
            ) : (
              <>
                <CloudUpload size={14} /> Seed Products to Firebase
              </>
            )}
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <Plus size={16} /> Add Product with Storage Image
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 text-xs text-purple-900 font-medium flex items-center justify-between">
          <span>{syncStatus}</span>
          <button onClick={() => setSyncStatus(null)} className="text-purple-400 hover:text-purple-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search car care products by name, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 border-b border-gray-100 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Product & Image Source</th>
                <th className="py-3.5">Category</th>
                <th className="py-3.5">Price</th>
                <th className="py-3.5">Rating</th>
                <th className="py-3.5">Stock Status</th>
                <th className="py-3.5 text-right pr-6">Product Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const isFirebaseStorage =
                    product.image?.includes("firebasestorage.app") ||
                    product.image?.includes("googleapis.com");
                  return (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {isFirebaseStorage ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl select-none">🚗</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{product.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {product.badge && (
                              <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded-full inline-block">
                                {product.badge}
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400 font-mono">
                              {isFirebaseStorage ? "Firebase Storage" : "Asset"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 font-medium">{product.category}</td>
                    <td className="py-4 font-bold text-gray-900">
                      ₹{product.price}
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through ml-1.5 font-normal">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-gray-600">
                      ★ {product.rating} <span className="text-gray-400 text-[10px]">({product.reviews})</span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          product.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toggleStock(product.id, product.inStock)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                            product.inStock
                              ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                              : "border-green-300 text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {product.inStock ? "Set Out of Stock" : "Restock Item"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          aria-label={`Edit ${product.name}`}
                          title="Edit product"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingProductId === product.id}
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {deletingProductId === product.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal with Storage File Upload */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add Product to Firestore"}
                </h2>
                <p className="text-[11px] text-gray-500">Image uploads directly to Firebase Storage</p>
              </div>
              <button
                onClick={closeProductModal}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Image Upload Box */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Product Image (Firebase Storage)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-200 hover:border-purple-600 rounded-2xl p-4 text-center cursor-pointer bg-purple-50/40 transition"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-xl border border-purple-200 mb-2 shadow-xs"
                      />
                      <span className="text-[11px] text-purple-700 font-semibold underline">
                        Click to change image
                      </span>
                    </div>
                  ) : (
                    <div className="py-2 flex flex-col items-center text-gray-500">
                      <Upload size={24} className="text-purple-600 mb-1" />
                      <p className="font-semibold text-gray-800 text-xs">
                        Click to upload product photo
                      </p>
                      <p className="text-[10px] text-gray-400">
                        PNG, JPG, WebP up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                {uploadProgress !== null && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-purple-700 font-bold mb-1">
                      <span>Uploading to Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-700 h-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ceramic Quick Detailer 500ml"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Subcategory</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white outline-none"
                  >
                    {![
                      "Exterior Wash",
                      "Paint Protection",
                      "Interior Care",
                      "Glass Care",
                      "Tire & Wheel Care",
                      "Accessories",
                    ].includes(newProduct.category) && (
                      <option value={newProduct.category}>{newProduct.category}</option>
                    )}
                    <option value="Exterior Wash">Exterior Wash</option>
                    <option value="Paint Protection">Paint Protection</option>
                    <option value="Interior Care">Interior Care</option>
                    <option value="Glass Care">Glass Care</option>
                    <option value="Tire & Wheel Care">Tire & Wheel Care</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g. 799"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 999"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Stock Status</label>
                <select
                  value={newProduct.inStock ? "in-stock" : "out-of-stock"}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      inStock: e.target.value === "in-stock",
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white outline-none"
                >
                  <option value="in-stock">In stock</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Formulation details and application instructions..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-semibold transition flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    editingProduct ? "Update Product" : "Save to Firestore"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
