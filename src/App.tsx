import { useMemo, useState } from 'react';
import { ChevronDown, Filter, Package, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductFormModal } from './components/ProductFormModal';
import { useProducts } from './hooks/useProducts';
import type { Product, ProductInput, ProductSort } from './types/product';

const categoryOptions = ['Все категории', 'Электроника', 'Аксессуары', 'Для дома', 'Одежда', 'Красота', 'Другое'];

function App() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все категории');
  const [sort, setSort] = useState<ProductSort>('featured');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [toast, setToast] = useState('');

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !query || [product.title, product.brand, product.category, product.description]
        .some((value) => value.toLowerCase().includes(query));
      const matchesCategory = category === 'Все категории' || product.category === category;
      return matchesSearch && matchesCategory;
    });

    switch (sort) {
      case 'price-asc': return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc': return filtered.sort((a, b) => b.price - a.price);
      case 'stock-desc': return filtered.sort((a, b) => b.stock - a.stock);
      case 'title': return filtered.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
      default: return filtered.sort((a, b) => a.id - b.id);
    }
  }, [products, search, category, sort]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSave = (input: ProductInput) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, input);
      showToast('Изменения сохранены');
    } else {
      addProduct(input);
      showToast('Товар добавлен в каталог');
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete.id);
    showToast(`«${pendingDelete.title}» удалён`);
    setPendingDelete(null);
  };

  return (
    <div className="app-shell">
      <main className="main-area" id="products">
        <header className="topbar">
          <div className="breadcrumbs"><strong>Каталог товаров</strong></div>
        </header>

        <div className="content-wrap">
          <section className="page-heading">
            <div>
              <h1>Каталог товаров</h1>
              <p className="page-subtitle">Список товаров</p>
            </div>
            <button type="button" className="button button-primary add-product-button" onClick={openCreate}><Plus size={18} strokeWidth={2.5} />Добавить товар</button>
          </section>

          <section className="catalog-section">
            <div className="catalog-heading-row">
              <div>
                <div className="catalog-title-row"><h2>Все товары</h2><span className="result-count">{filteredProducts.length}</span></div>
                <p>Ваш ассортимент и информация о каждой позиции</p>
              </div>
              
            </div>

            <div className="toolbar">
              <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по названию, бренду..." aria-label="Поиск товаров" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Очистить поиск"><X size={15} /></button>}</div>
              <div className="toolbar-right">
                <label className="select-wrap"><Filter size={15} /><select aria-label="Фильтр по категории" value={category} onChange={(event) => setCategory(event.target.value)}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
                <label className="select-wrap sort-select"><SlidersHorizontal size={15} /><select aria-label="Сортировка товаров" value={sort} onChange={(event) => setSort(event.target.value as ProductSort)}><option value="featured">По умолчанию</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option><option value="stock-desc">По остатку</option><option value="title">По названию</option></select><ChevronDown size={14} /></label>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onEdit={openEdit} onDelete={setPendingDelete} />)}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state"><div className="empty-icon"><Package size={25} /></div><h3>Ничего не найдено</h3><p>Попробуйте изменить поисковый запрос или выбрать другую категорию.</p><button type="button" className="button button-ghost" onClick={() => { setSearch(''); setCategory('Все категории'); }}>Сбросить фильтры</button></div>
            )}

            <div className="catalog-footer"><span>Показано <strong>{filteredProducts.length}</strong> из <strong>{products.length}</strong> товаров</span><span className="footer-tip">Изменения автоматически сохраняются на этом устройстве</span></div>
          </section>
          
        </div>
      </main>

      {modalOpen && <ProductFormModal product={editingProduct} onClose={() => { setModalOpen(false); setEditingProduct(null); }} onSave={handleSave} />}

      {pendingDelete && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingDelete(null); }}>
          <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="confirm-icon"><X size={21} /></div>
            <h2 id="delete-title">Удалить товар?</h2>
            <p>«{pendingDelete.title}» будет удалён из каталога. Это действие нельзя отменить.</p>
            <div className="confirm-actions"><button className="button button-ghost" type="button" onClick={() => setPendingDelete(null)}>Отмена</button><button className="button button-danger" type="button" onClick={handleDelete}>Удалить</button></div>
          </section>
        </div>
      )}

      {toast && <div className="toast-message" role="status"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  );
}

export default App;
