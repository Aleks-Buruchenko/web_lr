/** Product model follows the field naming used by DummyJSON's /products endpoint. */
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail?: string;
  /** Local presentation key; when a real API is connected, thumbnail can be used as the image URL. */
  imageKey: string;
}

export type ProductInput = Omit<Product, 'id' | 'rating'>;
export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'stock-desc' | 'title';
