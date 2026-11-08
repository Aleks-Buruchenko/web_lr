import { useCallback, useEffect, useState } from 'react';
import { initialProducts } from '../data/initialProducts';
import type { Product, ProductInput } from '../types/product';

const STORAGE_KEY = 'stockroom-products-v1';

function readProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialProducts;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as Product[]) : initialProducts;
  } catch {
    return initialProducts;
  }
}

/** Encapsulates product state and CRUD operations. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(readProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((input: ProductInput) => {
    setProducts((current) => {
      const nextId = current.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      return [...current, { ...input, id: nextId, rating: 0 }];
    });
  }, []);

  const updateProduct = useCallback((id: number, input: ProductInput) => {
    setProducts((current) => current.map((item) =>
      item.id === id ? { ...item, ...input } : item,
    ));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((current) => current.filter((item) => item.id !== id));
  }, []);

  return { products, addProduct, updateProduct, deleteProduct };
}
