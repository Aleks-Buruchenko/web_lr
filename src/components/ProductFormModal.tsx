import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import type { Product, ProductInput } from '../types/product';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (input: ProductInput) => void;
}

const defaultForm: ProductInput = {
  title: '',
  description: '',
  category: 'Электроника',
  price: 0,
  discountPercentage: 0,
  stock: 0,
  brand: '',
  imageKey: 'box',
};

const categories = ['Электроника', 'Аксессуары', 'Для дома', 'Одежда', 'Красота', 'Другое'];
const imageChoices = [
  { value: 'phone', label: 'Телефон', emoji: '📱' },
  { value: 'headphones', label: 'Наушники', emoji: '🎧' },
  { value: 'watch', label: 'Часы', emoji: '⌚' },
  { value: 'backpack', label: 'Рюкзак', emoji: '🎒' },
  { value: 'lamp', label: 'Лампа', emoji: '💡' },
  { value: 'chair', label: 'Кресло', emoji: '🪑' },
  { value: 'sneakers', label: 'Обувь', emoji: '👟' },
  { value: 'perfume', label: 'Парфюм', emoji: '🧴' },
  { value: 'box', label: 'Коробка', emoji: '📦' },
];

export function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductInput>(defaultForm);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title, description: product.description, category: product.category,
        price: product.price, discountPercentage: product.discountPercentage, stock: product.stock,
        brand: product.brand, thumbnail: product.thumbnail, imageKey: product.imageKey,
      });
    } else {
      setForm(defaultForm);
    }
    setError('');
    titleInputRef.current?.focus();
  }, [product]);

  const setField = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.brand.trim()) {
      setError('Укажите название товара и бренд.');
      return;
    }
    if (form.price <= 0 || form.stock < 0) {
      setError('Цена должна быть больше нуля, остаток не может быть отрицательным.');
      return;
    }
    if (form.discountPercentage < 0 || form.discountPercentage > 100) {
      setError('Скидка должна находиться в диапазоне от 0 до 100%.');
      return;
    }
    onSave({ ...form, title: form.title.trim(), brand: form.brand.trim(), description: form.description.trim() });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div>
            <div className="eyebrow">КАТАЛОГ ТОВАРОВ</div>
            <h2 id="modal-title">{product ? 'Редактировать товар' : 'Новый товар'}</h2>
            <p>Заполните информацию о позиции в каталоге.</p>
          </div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Закрыть"><X size={19} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section-title"><span>01</span>Основная информация</div>
          <div className="form-grid">
            <label className="field field-full">
              <span>Название товара <b>*</b></span>
              <input ref={titleInputRef} value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="Например, Беспроводные наушники" maxLength={80} />
            </label>
            <label className="field">
              <span>Бренд <b>*</b></span>
              <input value={form.brand} onChange={(event) => setField('brand', event.target.value)} placeholder="Название бренда" maxLength={50} />
            </label>
            <label className="field">
              <span>Категория</span>
              <select value={form.category} onChange={(event) => setField('category', event.target.value)}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="field field-full">
              <span>Описание</span>
              <textarea value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Кратко опишите товар и его особенности" rows={3} maxLength={240} />
            </label>
          </div>

          <div className="form-section-title second-section"><span>02</span>Цена и остатки</div>
          <div className="form-grid three-col">
            <label className="field">
              <span>Цена, ₽ <b>*</b></span>
              <input type="number" min="1" step="1" value={form.price || ''} onChange={(event) => setField('price', Number(event.target.value))} placeholder="0" />
            </label>
            <label className="field">
              <span>Скидка, %</span>
              <input type="number" min="0" max="100" step="1" value={form.discountPercentage} onChange={(event) => setField('discountPercentage', Number(event.target.value))} />
            </label>
            <label className="field">
              <span>На складе, шт.</span>
              <input type="number" min="0" step="1" value={form.stock} onChange={(event) => setField('stock', Number(event.target.value))} />
            </label>
          </div>

          <div className="form-section-title second-section"><span>03</span>Изображение</div>
          <div className="image-choices">
            {imageChoices.map((choice) => (
              <button key={choice.value} type="button" className={`image-choice ${form.imageKey === choice.value ? 'selected' : ''}`} onClick={() => setField('imageKey', choice.value)}>
                <span>{choice.emoji}</span><small>{choice.label}</small>
              </button>
            ))}
          </div>

          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="modal-footer">
            <span className="required-note"><b>*</b> Обязательные поля</span>
            <div className="modal-buttons">
              <button className="button button-ghost" type="button" onClick={onClose}>Отмена</button>
              <button className="button button-primary" type="submit"><ImagePlus size={16} />{product ? 'Сохранить' : 'Добавить товар'}</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
