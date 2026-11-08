export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images?: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  isDeleted?: boolean;
  deletedOn?: string;
}
export interface ProductsResponse { products: Product[]; total: number; skip: number; limit: number; }
export interface ProductInput {
  title: string; description: string; category: string; price: number;
  discountPercentage: number; stock: number; brand: string; thumbnail: string;
}
export interface ProductsQuery {
  limit?: number; skip?: number; q?: string; category?: string;
  sortBy?: "title" | "price" | "rating"; order?: "asc" | "desc";
}
export const PAGE_SIZE = 12;
