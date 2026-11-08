import type { Product } from '../types/product';

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProductStatus(stock: number): 'В наличии' | 'Заканчивается' | 'Нет в наличии' {
  if (stock === 0) return 'Нет в наличии';
  if (stock <= 5) return 'Заканчивается';
  return 'В наличии';
}

export function getProductEmoji(product: Product): string {
  const icons: Record<string, string> = {
    headphones: '🎧', phone: '📱', watch: '⌚', backpack: '🎒',
    lamp: '💡', chair: '🪑', sneakers: '👟', perfume: '🧴', box: '📦',
  };
  return icons[product.imageKey] ?? '📦';
}
