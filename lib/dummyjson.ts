import "server-only";
import type { Product, ProductInput, ProductsQuery, ProductsResponse } from "@/lib/types";

const API_BASE = "https://dummyjson.com";
const PAGE_SIZE = 12;
const CACHE: RequestInit & { next: { revalidate: number; tags: string[] } } = {
  next: { revalidate: 60, tags: ["products"] },
};

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`DummyJSON вернул ошибку ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
  const limit = Math.min(Math.max(query.limit ?? PAGE_SIZE, 1), 50);
  const skip = Math.max(query.skip ?? 0, 0);
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.order) params.set("order", query.order);

  let endpoint = "/products";
  if (query.q?.trim()) {
    endpoint = "/products/search";
    params.set("q", query.q.trim());
  } else if (query.category) {
    endpoint = `/products/category/${encodeURIComponent(query.category)}`;
  }
  return readJson<ProductsResponse>(await fetch(`${API_BASE}${endpoint}?${params}`, CACHE));
}

export async function getProductById(id: number): Promise<Product | null> {
  if (!Number.isInteger(id) || id < 1) return null;
  const response = await fetch(`${API_BASE}/products/${id}`, CACHE);
  if (response.status === 404) return null;
  return readJson<Product>(response);
}

export async function getProductCategories(): Promise<string[]> {
  const categories = await readJson<Array<string | { slug: string }>>(
    await fetch(`${API_BASE}/products/category-list`, CACHE)
  );
  return categories.map((item) => typeof item === "string" ? item : item.slug);
}

async function mutate<T>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method, cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return readJson<T>(response);
}
export function addProduct(input: ProductInput): Promise<Product> {
  return mutate<Product>("/products/add", "POST", input);
}
export function editProduct(id: number, input: ProductInput): Promise<Product> {
  return mutate<Product>(`/products/${id}`, "PATCH", input);
}
export function removeProduct(id: number): Promise<Product> {
  return mutate<Product>(`/products/${id}`, "DELETE");
}
