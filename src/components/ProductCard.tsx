import { MoreHorizontal, Pencil, Star, Trash2 } from 'lucide-react';
import type { Product } from '../types/product';
import { formatPrice, getProductEmoji, getProductStatus } from '../utils/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const status = getProductStatus(product.stock);

  return (
    <article className="product-card">
      <div className={`product-visual visual-${product.imageKey}`}>
        <span className="visual-category">{product.category}</span>
        {product.discountPercentage > 0 && (
          <span className="discount-tag">−{Math.round(product.discountPercentage)}%</span>
        )}
        <span className="product-emoji" role="img" aria-label={product.title}>{getProductEmoji(product)}</span>
        <div className="product-menu-wrap">
          <button className="icon-button product-menu" type="button" aria-label={`Действия: ${product.title}`} onClick={() => onEdit(product)}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-meta-row">
          <span className="rating"><Star size={13} fill="currentColor" />{product.rating > 0 ? product.rating.toFixed(1) : 'Новый'}</span>
          <span className="stock-text">{product.stock} шт. на складе</span>
        </div>
        <div className="product-card-footer">
          <div>
            <div className="product-price">{formatPrice(product.price)}</div>
            <span className={`status status-${product.stock === 0 ? 'empty' : product.stock <= 5 ? 'low' : 'ok'}`}>
              <span className="status-dot" />{status}
            </span>
          </div>
          <div className="card-actions">
            <button className="card-action" type="button" onClick={() => onEdit(product)} aria-label="Редактировать товар"><Pencil size={15} /></button>
            <button className="card-action danger-action" type="button" onClick={() => onDelete(product)} aria-label="Удалить товар"><Trash2 size={15} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
