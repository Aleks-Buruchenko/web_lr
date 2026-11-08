import { ProductCatalog } from "@/app/components/ProductCatalog";
import { getProductCategories } from "@/lib/dummyjson";

export default async function ProductsPage() {
  const categories = await getProductCategories().catch(() => [] as string[]);

  return (
    <main className="page-shell">
      <ProductCatalog categories={categories} />
    </main>
  );
}
