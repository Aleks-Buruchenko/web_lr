"use server";
import { revalidatePath, updateTag } from "next/cache";
import { addProduct, editProduct, removeProduct } from "@/lib/dummyjson";
import type { Product, ProductInput } from "@/lib/types";

function validateProduct(input: ProductInput): ProductInput {
  if (!input || typeof input.title !== "string" || !input.title.trim()) throw new Error("Укажите название товара.");
  if (!Number.isFinite(input.price) || input.price <= 0) throw new Error("Цена должна быть больше нуля.");
  if (!Number.isFinite(input.stock) || input.stock < 0) throw new Error("Остаток не может быть отрицательным.");
  if (!Number.isFinite(input.discountPercentage) || input.discountPercentage < 0 || input.discountPercentage > 100) {
    throw new Error("Скидка должна быть от 0 до 100 процентов.");
  }
  return {
    title: input.title.trim(), description: String(input.description ?? "").trim(),
    category: String(input.category ?? "beauty"), price: input.price,
    discountPercentage: input.discountPercentage, stock: input.stock,
    brand: String(input.brand ?? "").trim(), thumbnail: String(input.thumbnail ?? "").trim(),
  };
}

export async function createProductAction(input: ProductInput): Promise<Product> {
  const product = await addProduct(validateProduct(input));
  updateTag("products");
  revalidatePath("/");
  return product;
}
export async function updateProductAction(id: number, input: ProductInput): Promise<Product> {
  if (!Number.isInteger(id) || id < 1) throw new Error("Некорректный id товара.");
  const product = await editProduct(id, validateProduct(input));
  updateTag("products");
  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  return product;
}
export async function deleteProductAction(id: number): Promise<Product> {
  if (!Number.isInteger(id) || id < 1) throw new Error("Некорректный id товара.");
  const product = await removeProduct(id);
  updateTag("products");
  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  return product;
}
