import { ProductCatalog } from "@/app/components/ProductCatalog";
import { ProductsStoreProvider } from "@/app/components/StoreProvider";
import { getProductCategories, getProducts } from "@/lib/dummyjson";
import { PAGE_SIZE } from "@/lib/types";
export default async function ProductsPage() {
  const [initialData, categories] = await Promise.all([
    getProducts({ limit: PAGE_SIZE, skip: 0 }),
    getProductCategories().catch(() => [] as string[]),
  ]);
  return <main className="page-shell">
    <ProductsStoreProvider initialProducts={initialData.products} initialTotal={initialData.total}>
      <ProductCatalog categories={categories} />
    </ProductsStoreProvider>
  </main>;
}
