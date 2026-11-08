"use client";
import { createContext, useContext, useRef, type PropsWithChildren } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { Product } from "@/lib/types";

interface ProductsState {
  products: Product[]; total: number;
  replace: (products: Product[], total: number) => void;
  append: (products: Product[], total: number) => void;
  insert: (product: Product) => void;
  upsert: (product: Product) => void;
  remove: (id: number) => void;
}
function createProductsStore(initialProducts: Product[], initialTotal: number) {
  return createStore<ProductsState>()((set) => ({
    products: initialProducts, total: initialTotal,
    replace: (products, total) => set({ products, total }),
    append: (incoming, total) => set((state) => {
      const byId = new Map(state.products.map((product) => [product.id, product]));
      incoming.forEach((product) => byId.set(product.id, product));
      return { products: Array.from(byId.values()), total };
    }),
    insert: (product) => set((state) => ({
      products: [product, ...state.products.filter((item) => item.id !== product.id)],
      total: state.total + 1,
    })),
    upsert: (product) => set((state) => ({
      products: state.products.some((item) => item.id === product.id)
        ? state.products.map((item) => item.id === product.id ? { ...item, ...product } : item)
        : [product, ...state.products],
    })),
    remove: (id) => set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      total: Math.max(0, state.total - 1),
    })),
  }));
}
type ProductsStore = ReturnType<typeof createProductsStore>;
const StoreContext = createContext<ProductsStore | null>(null);
export function ProductsStoreProvider({ children, initialProducts, initialTotal }: PropsWithChildren<{
  initialProducts: Product[]; initialTotal: number;
}>) {
  const storeRef = useRef<ProductsStore | null>(null);
  if (!storeRef.current) storeRef.current = createProductsStore(initialProducts, initialTotal);
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
}
export function useProductsStore<T>(selector: (state: ProductsState) => T): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useProductsStore должен использоваться внутри ProductsStoreProvider");
  return useStore(store, selector);
}
