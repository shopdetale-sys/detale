import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products as fallbackProducts } from "@/lib/products";
import { getProductBySlugFromFirestore, getProductsFromFirestore } from "@/lib/products-service";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import ProductArtwork from "@/app/components/ProductArtwork";
import ProductDetailClient from "./ProductDetailClient";
import { siteUrl } from "@/lib/site-metadata";

type ProductPageProps = PageProps<"/products/[slug]">;

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const { products } = await getProductsFromFirestore();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return fallbackProducts.map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromFirestore(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157).trimEnd()}...`
      : product.description;
  const title = `${product.name} | Detale Car Care`;
  const canonical = `/products/${product.slug}`;
  const hasProductImage =
    product.image &&
    (product.image.startsWith("http") || product.image.startsWith("/")) &&
    !product.image.includes("product-");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: hasProductImage
        ? [{ url: product.image, alt: product.name }]
        : [{ url: "/logo.png", alt: "Detale premium car care" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: hasProductImage ? [product.image] : ["/logo.png"],
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const { slug } = await props.params;
  const product = await getProductBySlugFromFirestore(slug);
  if (!product) notFound();

  const productUrl = new URL(`/products/${product.slug}`, siteUrl).toString();
  const hasProductImage =
    product.image &&
    (product.image.startsWith("http") || product.image.startsWith("/")) &&
    !product.image.includes("product-");
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: "Detale" },
    url: productUrl,
    ...(hasProductImage
      ? { image: [new URL(product.image, siteUrl).toString()] }
      : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
            bestRating: 5,
          },
        }
      : {}),
  };

  const { products: allProducts } = await getProductsFromFirestore();
  const related = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const fallback = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const suggestions = related.length >= 2 ? related : fallback;

  return (
    <div className="bg-black min-h-screen text-white py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-neutral-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#9D6EFF] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#9D6EFF] transition-colors">Car Care</Link>
          <span>/</span>
          <span className="text-white font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
          {/* Product Image & Studio Pedestal */}
          <div className="relative sticky top-24">
            <div className="aspect-square rounded-3xl bg-gradient-to-b from-[#1C1C1C] via-[#141414] to-[#0D0D0D] flex items-center justify-center overflow-hidden border border-neutral-800/80 shadow-2xl relative">
              {/* Detale Purple Studio Pedestal Glow */}
              <div className="w-56 h-14 rounded-full bg-[#4D2C9C]/35 blur-2xl absolute bottom-8 pointer-events-none" />

              {product.image && (product.image.startsWith("http") || product.image.startsWith("/")) && !product.image.includes("product-") ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover relative z-10 transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <ProductArtwork product={product} />
              )}
            </div>
            {product.badge && (
              <span className="absolute top-5 left-5 bg-[#4D2C9C] text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-purple-950/50 tracking-wider z-20">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info & Interactive Client Area */}
          <ProductDetailClient product={product} />
        </div>

        {/* Related Products */}
        {suggestions.length > 0 && (
          <section className="pt-12 border-t border-neutral-900">
            <div className="mb-6">
              <p className="text-[#9D6EFF] font-bold text-xs uppercase tracking-wider">Related Formulations</p>
              <h2 className="text-2xl font-black text-white">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
