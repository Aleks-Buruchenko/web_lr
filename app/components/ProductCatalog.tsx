"use client";
import { useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronDown, LoaderCircle } from "lucide-react";
import { createProductAction, deleteProductAction, updateProductAction } from "@/app/actions";
import type { Product, ProductInput, ProductsResponse } from "@/lib/types";
import { PAGE_SIZE } from "@/lib/types";
import { ProductCard } from "@/app/components/ProductCard";
import { ProductForm } from "@/app/components/ProductForm";
import { useProductsStore } from "@/app/components/StoreProvider";

interface Props { categories: string[]; }
interface Filters { q?: string; category?: string; sortBy?: string; order?: string; }

export function ProductCatalog({ categories }: Props) {
  const products = useProductsStore((state) => state.products);
  const total = useProductsStore((state) => state.total);
  const replace = useProductsStore((state) => state.replace);
  const append = useProductsStore((state) => state.append);
  const insert = useProductsStore((state) => state.insert);
  const upsert = useProductsStore((state) => state.upsert);
  const remove = useProductsStore((state) => state.remove);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [mutationPending, setMutationPending] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProducts(mode: "replace" | "append", filters: Filters = {}) {
    const activeQuery = filters.q ?? query;
    const activeCategory = filters.category ?? category;
    const activeSortValue = filters.sortBy !== undefined
      ? (filters.sortBy ? `${filters.sortBy}:${filters.order ?? "asc"}` : "")
      : sortValue;
    const [sortBy, order] = activeSortValue ? activeSortValue.split(":") : ["", "asc"];
    const isAppend = mode === "append";
    if (isAppend) setLoadingMore(true);
    else setRefreshing(products.length > 0);
    setPageError("");

    const params = new URLSearchParams({ limit: String(PAGE_SIZE), skip: String(isAppend ? products.length : 0) });
    if (activeQuery.trim()) params.set("q", activeQuery.trim());
    else if (activeCategory) params.set("category", activeCategory);
    if (sortBy) { params.set("sortBy", sortBy); params.set("order", order); }

    try {
      const response = await fetch(`/api/products?${params.toString()}`);
      const payload = await response.json() as ProductsResponse | { message?: string };
      if (!response.ok || !("products" in payload)) {
        throw new Error("message" in payload ? payload.message : "Не удалось загрузить товары.");
      }
      if (isAppend) append(payload.products, payload.total);
      else replace(payload.products, payload.total);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Не удалось загрузить товары.");
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCategory("");
    void loadProducts("replace", { q: query, category: "" });
  }
  function changeCategory(value: string) {
    setCategory(value); setQuery("");
    void loadProducts("replace", { category: value, q: "" });
  }
  function changeSort(value: string) {
    setSortValue(value);
    const [field, direction] = value ? value.split(":") : ["", "asc"];
    void loadProducts("replace", { sortBy: field, order: direction });
  }
  function openCreate() { setEditing(null); setMutationError(""); setFormOpen(true); }
  function openEdit(product: Product) { setEditing(product); setMutationError(""); setFormOpen(true); }

  async function saveProduct(input: ProductInput) {
    setMutationPending(true); setMutationError(""); setNotice("");
    try {
      if (editing) {
        const updated = await updateProductAction(editing.id, input);
        upsert({ ...editing, ...updated });
        setNotice("Изменения сохранены");
      } else {
        const created = await createProductAction(input);
        insert({ ...input, ...created });
        setNotice("Товар добавлен");
      }
      setFormOpen(false); setEditing(null);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Не удалось сохранить товар.");
    } finally { setMutationPending(false); }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setMutationPending(true); setMutationError("");
    try {
      await deleteProductAction(deleting.id);
      remove(deleting.id); setNotice("Товар удалён"); setDeleting(null);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Не удалось удалить товар.");
    } finally { setMutationPending(false); }
  }

  const hasMore = products.length < total;
  return <section className="catalog">
    <header className="page-heading">
      <div><span className="eyebrow">ВАРИАНТ 2 · PRODUCTS</span>
        <h1>Каталог товаров</h1><p>Просмотр и управление товарами из DummyJSON API</p></div>
      <button className="button button-primary" type="button" onClick={openCreate}><Plus size={17} />Добавить товар</button>
    </header>

    <section className="catalog-panel">
      <div className="panel-heading"><div>
        <div className="panel-title-row"><h2>Все товары</h2><span className="count-pill">{total}</span></div>
        <p>Найдено записей: {total}</p></div>
        {refreshing && <span className="refreshing-label"><LoaderCircle size={14} className="spin" />Обновление списка…</span>}
      </div>

      <div className="toolbar">
        <form className="search-form" onSubmit={submitSearch}>
          <Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск товаров..." aria-label="Поиск товаров" />
          {query && <button type="button" className="clear-search" onClick={() => { setQuery(""); void loadProducts("replace", { q: "" }); }} aria-label="Очистить поиск"><X size={15} /></button>}
          <button type="submit" className="search-submit">Найти</button>
        </form>
        <label className="filter-control"><span>Категория</span>
          <select value={category} onChange={(event) => changeCategory(event.target.value)}>
            <option value="">Все категории</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}
          </select><ChevronDown size={14} /></label>
        <label className="filter-control sort-control"><span>Сортировка</span>
          <select value={sortValue} onChange={(event) => changeSort(event.target.value)}>
            <option value="">По умолчанию</option><option value="title:asc">Название: А–Я</option>
            <option value="title:desc">Название: Я–А</option><option value="price:asc">Сначала дешевле</option>
            <option value="price:desc">Сначала дороже</option><option value="rating:desc">По рейтингу</option>
          </select><ChevronDown size={14} /></label>
      </div>

      {pageError && <div className="error-banner" role="alert"><span>{pageError}</span>
        <button className="button button-secondary small-button" type="button" onClick={() => void loadProducts("replace")}>Повторить</button></div>}

      {products.length === 0 && !refreshing && !pageError ? <div className="empty-state">
        <div className="empty-emoji">📦</div><h3>Ничего не найдено</h3>
        <p>Попробуйте изменить запрос или выбрать другую категорию.</p>
        <button className="button button-secondary" type="button" onClick={() => {
          setQuery(""); setCategory(""); setSortValue(""); void loadProducts("replace", { q: "", category: "", sortBy: "" });
        }}>Сбросить фильтры</button>
      </div> : <div className={refreshing ? "products-grid is-stale" : "products-grid"}>
        {products.map((product) => <ProductCard key={product.id} product={product} onEdit={openEdit} onDelete={setDeleting} />)}
      </div>}

      {refreshing && products.length === 0 && <div className="inline-loading"><LoaderCircle className="spin" />Загружаем товары…</div>}
      <footer className="catalog-footer"><span>Показано <strong>{products.length}</strong> из <strong>{total}</strong> товаров</span><span>Источник данных: DummyJSON</span></footer>
      {hasMore && <div className="load-more-wrap">
        <button className="button button-secondary load-more" type="button" disabled={loadingMore || refreshing} onClick={() => void loadProducts("append")}>
          {loadingMore ? <><LoaderCircle size={16} className="spin" />Загрузка…</> : "Загрузить ещё"}
        </button>
      </div>}
    </section>

    {notice && <div className="toast" role="status">{notice}</div>}
    {formOpen && <ProductForm product={editing} categories={categories} pending={mutationPending} error={mutationError}
      onClose={() => { if (!mutationPending) { setFormOpen(false); setEditing(null); } }} onSave={saveProduct} />}
    {deleting && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !mutationPending) setDeleting(null);
    }}><section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
      <h2 id="delete-title">Удалить товар?</h2><p>«{deleting.title}» будет удалён из текущего списка.</p>
      {mutationError && <p className="form-error" role="alert">{mutationError}</p>}
      <div className="modal-footer"><button className="button button-secondary" type="button" disabled={mutationPending} onClick={() => setDeleting(null)}>Отмена</button>
        <button className="button button-danger" type="button" disabled={mutationPending} onClick={() => void confirmDelete()}>{mutationPending ? "Удаление…" : "Удалить"}</button></div>
    </section></div>}
  </section>;
}
