"use client";
import { useState, useMemo, useEffect } from "react";
import { products as staticProducts, Product } from "@/lib/products";
import { getProductsFromFirestore } from "@/lib/products-service";
import ProductCard from "@/app/components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>(staticProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  useEffect(() => {
    getProductsFromFirestore()
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setItems(res.products);
        }
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(items.map((p) => p.category)))];
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (selectedCategory !== "All") list = list.filter((p) => p.category === selectedCategory);
    if (showInStockOnly) list = list.filter((p) => p.inStock);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [items, selectedCategory, sortBy, showInStockOnly]);

  return (
    <div className="bg-black min-h-screen text-white pb-24">
      {/* ── Main Banner: Bold Yellow SHOP (Exact as Screenshot) ── */}
      <section className="pt-12 pb-10 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wider text-[#FFE500] uppercase font-sans select-none drop-shadow-[0_4px_24px_rgba(255,229,0,0.25)]">
          SHOP
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm mt-3 tracking-wide">
          Premium High-Performance Car Detailing & Paint Protection Formulations
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Filter & Categories Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-neutral-900">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#FFE500] text-black shadow-md shadow-yellow-500/10"
                    : "bg-[#181818] text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Sort Controls */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181818] text-neutral-200 border border-neutral-800 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#FFE500]"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>

            <label className="flex items-center gap-2 bg-[#181818] border border-neutral-800 px-3 py-2 rounded-lg text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="accent-[#FFE500] w-3.5 h-3.5"
              />
              <span className="text-neutral-300">In Stock</span>
            </label>
          </div>
        </div>

        {/* ── Products Grid (4 Columns, Black & Yellow Theme) ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-[#141414] rounded-3xl border border-neutral-900">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-white">No products found in this category.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setShowInStockOnly(false);
              }}
              className="mt-4 text-xs font-bold text-black bg-[#FFE500] px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
