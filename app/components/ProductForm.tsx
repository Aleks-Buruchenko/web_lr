"use client";
import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { Product, ProductInput } from "@/lib/types";
interface Props {
  product: Product | null; categories: string[]; pending: boolean; error: string;
  onClose: () => void; onSave: (input: ProductInput) => void;
}
const emptyForm: ProductInput = {
  title: "", description: "", category: "beauty", price: 1,
  discountPercentage: 0, stock: 0, brand: "", thumbnail: "",
};
export function ProductForm({ product, categories, pending, error, onClose, onSave }: Props) {
  const [form, setForm] = useState<ProductInput>(emptyForm);
  useEffect(() => {
    setForm(product ? {
      title: product.title, description: product.description, category: product.category,
      price: product.price, discountPercentage: product.discountPercentage, stock: product.stock,
      brand: product.brand ?? "", thumbnail: product.thumbnail ?? "",
    } : emptyForm);
  }, [product]);
  function setField<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSave(form); }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget && !pending) onClose();
  }}>
    <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
      <header className="modal-heading">
        <div><span className="eyebrow">DUMMYJSON PRODUCTS</span>
          <h2 id="product-form-title">{product ? "Редактирование товара" : "Добавление товара"}</h2>
          <p>Заполните основные сведения о товаре.</p></div>
        <button className="icon-action" type="button" onClick={onClose} disabled={pending} aria-label="Закрыть"><X /></button>
      </header>
      <form className="product-form" onSubmit={submit}>
        <label className="form-field full-field"><span>Название <b>*</b></span>
          <input required maxLength={120} value={form.title} onChange={(event) => setField("title", event.target.value)} /></label>
        <label className="form-field"><span>Бренд</span>
          <input value={form.brand} onChange={(event) => setField("brand", event.target.value)} /></label>
        <label className="form-field"><span>Категория</span>
          <select value={form.category} onChange={(event) => setField("category", event.target.value)}>
            {Array.from(new Set([form.category, ...categories])).map((item) => <option value={item} key={item}>{item}</option>)}
          </select></label>
        <label className="form-field full-field"><span>Описание</span>
          <textarea rows={3} value={form.description} onChange={(event) => setField("description", event.target.value)} /></label>
        <label className="form-field"><span>Цена, $ <b>*</b></span>
          <input required type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setField("price", Number(event.target.value))} /></label>
        <label className="form-field"><span>Скидка, %</span>
          <input type="number" min="0" max="100" step="0.01" value={form.discountPercentage} onChange={(event) => setField("discountPercentage", Number(event.target.value))} /></label>
        <label className="form-field"><span>Остаток, шт.</span>
          <input type="number" min="0" step="1" value={form.stock} onChange={(event) => setField("stock", Number(event.target.value))} /></label>
        <label className="form-field full-field"><span>URL изображения</span>
          <input type="url" placeholder="https://..." value={form.thumbnail} onChange={(event) => setField("thumbnail", event.target.value)} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <footer className="modal-footer">
          <button className="button button-secondary" type="button" onClick={onClose} disabled={pending}>Отмена</button>
          <button className="button button-primary" type="submit" disabled={pending}>
            {pending ? "Отправка..." : product ? "Сохранить изменения" : "Добавить товар"}
          </button>
        </footer>
      </form>
    </section>
  </div>;
}
