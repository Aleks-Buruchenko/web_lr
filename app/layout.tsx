import type { Metadata } from "next";
import { ProductsStoreProvider } from "@/app/components/StoreProvider";
import { getProducts } from "@/lib/dummyjson";
import { PAGE_SIZE } from "@/lib/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "Каталог товаров — Products",
  description: "Учебное приложение для просмотра и управления товарами на Next.js.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialData = await getProducts({ limit: PAGE_SIZE, skip: 0 }).catch(() => ({
    products: [],
    total: 0,
    skip: 0,
    limit: PAGE_SIZE,
  }));

  return (
    <html lang="ru">
      <body>
        <ProductsStoreProvider
          initialProducts={initialData.products}
          initialTotal={initialData.total}
        >
          {children}
        </ProductsStoreProvider>
      </body>
    </html>
  );
}
