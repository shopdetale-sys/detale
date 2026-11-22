import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/lib/products";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const fallback = products.filter((p) => p.id !== product.id).slice(0, 4);
  const suggestions = related.length >= 2 ? related : fallback;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-purple-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-purple-700 transition-colors">Car Care</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
        {/* Product Image */}
        <div className="relative sticky top-24">
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center overflow-hidden border border-purple-100">
            {product.image && (product.image.startsWith("http") || product.image.startsWith("/")) && !product.image.includes("product-") ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10rem] select-none">🚗</span>
            )}
          </div>
          {product.badge && (
            <span className="absolute top-5 left-5 bg-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Info & Interactive Client Area */}
        <ProductDetailClient product={product} />
      </div>

      {/* Related Products */}
      {suggestions.length > 0 && (
        <section className="pt-12 border-t border-gray-100">
          <div className="mb-6">
            <p className="text-purple-700 font-bold text-xs uppercase tracking-wider">Related Formulations</p>
            <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
