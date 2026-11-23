import ProductCatalog from "@/app/products/ProductCatalog";
import { getProductsFromFirestore } from "@/lib/products-service";

export default async function ProductsPage() {
  const { products } = await getProductsFromFirestore();
  return <ProductCatalog products={products} />;
}
