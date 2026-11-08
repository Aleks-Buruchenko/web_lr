"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Package, Truck, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { useProductsStore } from "@/app/components/StoreProvider";

interface Props {
  productId: number;
  initialProduct: Product | null;
}

export function ProductDetails({ productId, initialProduct }: Props) {
  const sessionProduct = useProductsStore((state) =>
    state.localProducts.find((item) => item.id === productId)
  );
  const catalogProduct = useProductsStore((state) =>
    state.products.find((item) => item.id === productId)
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Session changes from DummyJSON mutations take priority over the API response.
  const product = sessionProduct ?? catalogProduct ?? initialProduct;

  if (!product && !mounted) {
    return (
      <main className="page-shell detail-shell">
        <p className="inline-loading">Загружаем товар…</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page-shell detail-shell">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          К каталогу
        </Link>
        <section className="empty-state">
          <div className="empty-emoji">📦</div>
          <h1>Товар не найден</h1>
          <p>Возможно, запись была удалена или больше недоступна в DummyJSON.</p>
          <Link href="/" className="button button-primary">
            Вернуться к каталогу
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell detail-shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        К каталогу
      </Link>
      <article className="detail-card">
        <div className="detail-image">
          {product.thumbnail ? (
            <img src={product.thumbnail} alt={product.title} />
          ) : (
            <span>📦</span>
          )}
        </div>
        <div className="detail-content">
          <span className="eyebrow">{product.category}</span>
          <p className="brand-label">{product.brand || "Без бренда"}</p>
          <h1>{product.title}</h1>
          <div className="detail-rating">
            <Star size={16} fill="currentColor" />
            {Number(product.rating || 0).toFixed(1)}
            <span>·</span>
            Остаток: {product.stock} шт.
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">
            {product.price.toLocaleString("ru-RU", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          {product.discountPercentage > 0 && (
            <p className="detail-discount">
              Скидка {product.discountPercentage}%
            </p>
          )}
          <div className="detail-facts">
            <span>
              <Package size={16} />
              Минимальный заказ: {product.minimumOrderQuantity ?? 1} шт.
            </span>
            <span>
              <Truck size={16} />
              {product.shippingInformation ??
                "Информация о доставке не указана"}
            </span>
            <span>
              <ShieldCheck size={16} />
              {product.warrantyInformation ?? "Гарантия не указана"}
            </span>
          </div>
          <Link href="/" className="button button-primary detail-button">
            Вернуться к каталогу
          </Link>
        </div>
      </article>
      {product.images && product.images.length > 1 && (
        <section className="detail-gallery">
          <h2>Другие изображения</h2>
          <div>
            {product.images.map((image) => (
              <img src={image} alt={product.title} key={image} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
