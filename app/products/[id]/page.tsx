import Link from "next/link";
import { ArrowLeft, Star, Package, Truck, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/dummyjson";
interface Props { params: Promise<{ id: string }>; }
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();
  return <main className="page-shell detail-shell">
    <Link href="/" className="back-link"><ArrowLeft size={16} />К каталогу</Link>
    <article className="detail-card">
      <div className="detail-image">{product.thumbnail ? <img src={product.thumbnail} alt={product.title} /> : <span>📦</span>}</div>
      <div className="detail-content">
        <span className="eyebrow">{product.category}</span><p className="brand-label">{product.brand || "Без бренда"}</p>
        <h1>{product.title}</h1>
        <div className="detail-rating"><Star size={16} fill="currentColor" />{Number(product.rating || 0).toFixed(1)} <span>·</span> Остаток: {product.stock} шт.</div>
        <p className="detail-description">{product.description}</p>
        <div className="detail-price">{product.price.toLocaleString("ru-RU", { style: "currency", currency: "USD" })}</div>
        {product.discountPercentage > 0 && <p className="detail-discount">Скидка {product.discountPercentage}%</p>}
        <div className="detail-facts">
          <span><Package size={16} />Минимальный заказ: {product.minimumOrderQuantity ?? 1} шт.</span>
          <span><Truck size={16} />{product.shippingInformation ?? "Информация о доставке не указана"}</span>
          <span><ShieldCheck size={16} />{product.warrantyInformation ?? "Гарантия не указана"}</span>
        </div>
        <Link href="/" className="button button-primary detail-button">Вернуться к каталогу</Link>
      </div>
    </article>
    {product.images && product.images.length > 1 && <section className="detail-gallery">
      <h2>Другие изображения</h2><div>{product.images.map((image) => <img src={image} alt={product.title} key={image} />)}</div>
    </section>}
  </main>;
}
