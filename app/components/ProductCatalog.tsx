"use client";
import {useState,type FormEvent} from "react";
import {Plus,Search,X,ChevronDown,LoaderCircle} from "lucide-react";
import {createProductAction,deleteProductAction,updateProductAction} from "@/app/actions";
import type {Product,ProductsResponse} from "@/lib/types";
import type {CreateProductInput} from "@/lib/schemas/product";
import {PAGE_SIZE} from "@/lib/types";
import {ProductCard} from "@/app/components/ProductCard";
import {ProductForm} from "@/app/components/ProductForm";
import {useProductsStore} from "@/app/components/StoreProvider";
interface Props{categories:string[];role:"user"|"admin";}
interface Filters{q?:string;category?:string;sortBy?:string;order?:string;}
export function ProductCatalog({categories,role}:Props){
 const products=useProductsStore(s=>s.products),total=useProductsStore(s=>s.total);
 const replace=useProductsStore(s=>s.replace),append=useProductsStore(s=>s.append),insert=useProductsStore(s=>s.insert),upsert=useProductsStore(s=>s.upsert),remove=useProductsStore(s=>s.remove);
 const [query,setQuery]=useState(""),[category,setCategory]=useState(""),[sortValue,setSortValue]=useState("");
 const [refreshing,setRefreshing]=useState(false),[loadingMore,setLoadingMore]=useState(false),[loadingList,setLoadingList]=useState(false),[nextSkip,setNextSkip]=useState(PAGE_SIZE),[pageError,setPageError]=useState("");
 const [formOpen,setFormOpen]=useState(false),[editing,setEditing]=useState<Product|null>(null),[deleting,setDeleting]=useState<Product|null>(null);
 const [mutationPending,setMutationPending]=useState(false),[mutationError,setMutationError]=useState(""),[notice,setNotice]=useState("");
 async function load(mode:"replace"|"append",filters:Filters={}){
  const q=filters.q??query,cat=filters.category??category,sort=filters.sortBy!==undefined?(filters.sortBy?`${filters.sortBy}:${filters.order??"asc"}`:""):sortValue;
  const [sortBy,order]=sort?sort.split(":"):["","asc"];const isAppend=mode==="append";
  if(isAppend)setLoadingMore(true);else setRefreshing(products.length>0);setPageError("");setLoadingList(true);
  const params=new URLSearchParams({limit:String(PAGE_SIZE),skip:String(isAppend?nextSkip:0)});if(q.trim())params.set("q",q.trim());else if(cat)params.set("category",cat);if(sortBy){params.set("sortBy",sortBy);params.set("order",order);}
  try{const response=await fetch(`/api/products?${params}`);const data=await response.json() as ProductsResponse|{message?:string};if(!response.ok||!("products"in data))throw new Error("message"in data?data.message:"Ошибка загрузки.");
   if(isAppend)append(data.products,data.total);else replace(data.products,data.total);setNextSkip(data.skip+data.products.length);
  }catch(e){setPageError(e instanceof Error?e.message:"Не удалось загрузить товары.");}finally{setRefreshing(false);setLoadingMore(false);setLoadingList(false);}
 }
 function search(e:FormEvent<HTMLFormElement>){e.preventDefault();setCategory("");void load("replace",{q:query,category:""});}
 function create(){setEditing(null);setMutationError("");setFormOpen(true);}
 function edit(p:Product){setEditing(p);setMutationError("");setFormOpen(true);}
 async function save(input:CreateProductInput){
  setMutationPending(true);setMutationError("");setNotice("");
  const result=editing?await updateProductAction(editing.id,input):await createProductAction(input);
  if(!result.success){setMutationError(result.error);setMutationPending(false);return;}
  if(editing){upsert({...editing,...result.data});setNotice("Изменения сохранены");}else{insert({...input,...result.data});setNotice("Товар добавлен");}
  setFormOpen(false);setEditing(null);setMutationPending(false);
 }
 async function confirmDelete(){if(!deleting||role!=="admin")return;setMutationPending(true);const result=await deleteProductAction(deleting.id);if(!result.success)setMutationError(result.error);else{remove(deleting.id);setNotice("Товар удалён");setDeleting(null);}setMutationPending(false);}
 const hasMore=nextSkip<total;
 return <section className="catalog"><header className="page-heading"><div><span className="eyebrow">ВАРИАНТ 2 · PRODUCTS</span><h1>Каталог товаров</h1><p>Просмотр и управление товарами из DummyJSON API</p></div><button className="button button-primary" type="button" onClick={create}><Plus size={17}/>Добавить товар</button></header>
 <section className="catalog-panel"><div className="panel-heading"><div><div className="panel-title-row"><h2>Все товары</h2><span className="count-pill">{total}</span></div><p>Найдено записей: {total}</p></div>{refreshing&&<span className="refreshing-label"><LoaderCircle size={14} className="spin"/>Обновление списка…</span>}</div>
 <div className="toolbar"><form className="search-form" onSubmit={search}><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск товаров..." aria-label="Поиск товаров"/>{query&&<button type="button" className="clear-search" onClick={()=>{setQuery("");void load("replace",{q:""});}} aria-label="Очистить поиск"><X size={15}/></button>}<button type="submit" className="search-submit">Найти</button></form>
 <label className="filter-control"><span>Категория</span><select value={category} onChange={e=>{setCategory(e.target.value);setQuery("");void load("replace",{category:e.target.value,q:""});}}><option value="">Все категории</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select><ChevronDown size={14}/></label>
 <label className="filter-control sort-control"><span>Сортировка</span><select value={sortValue} onChange={e=>{setSortValue(e.target.value);const [sortBy,order]=e.target.value?e.target.value.split(":"):["","asc"];void load("replace",{sortBy,order});}}><option value="">По умолчанию</option><option value="title:asc">Название: А–Я</option><option value="title:desc">Название: Я–А</option><option value="price:asc">Сначала дешевле</option><option value="price:desc">Сначала дороже</option><option value="rating:desc">По рейтингу</option></select><ChevronDown size={14}/></label></div>
 {pageError&&<div className="error-banner" role="alert"><span>{pageError}</span><button className="button button-secondary small-button" type="button" onClick={()=>void load("replace")}>Повторить</button></div>}
 {products.length===0&&!loadingList&&!pageError?<div className="empty-state"><div className="empty-emoji">📦</div><h3>Ничего не найдено</h3><p>Попробуйте изменить запрос или выбрать другую категорию.</p><button className="button button-secondary" type="button" onClick={()=>{setQuery("");setCategory("");setSortValue("");void load("replace",{q:"",category:"",sortBy:""});}}>Сбросить фильтры</button></div>:<div className={refreshing?"products-grid is-stale":"products-grid"}>{products.map(p=><ProductCard key={p.id} product={p} role={role} onEdit={edit} onDelete={setDeleting}/>)}</div>}
 {loadingList&&products.length===0&&<div className="inline-loading"><LoaderCircle className="spin"/>Загружаем товары…</div>}
 <footer className="catalog-footer"><span>Показано <strong>{products.length}</strong> из <strong>{total}</strong> товаров</span><span>Источник данных: DummyJSON</span></footer>
 {hasMore&&<div className="load-more-wrap"><button className="button button-secondary load-more" type="button" disabled={loadingMore||refreshing||loadingList} onClick={()=>void load("append")}>{loadingMore?<><LoaderCircle size={16} className="spin"/>Загрузка…</>:"Загрузить ещё"}</button></div>}</section>
 {notice&&<div className="toast" role="status">{notice}</div>}
 {formOpen&&<ProductForm product={editing} categories={categories} pending={mutationPending} error={mutationError} role={role} onClose={()=>{if(!mutationPending){setFormOpen(false);setEditing(null);}}} onSave={save}/>}
 {deleting&&role==="admin"&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget&&!mutationPending)setDeleting(null);}}><section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><h2 id="delete-title">Удалить товар?</h2><p>«{deleting.title}» будет удалён из текущего списка.</p>{mutationError&&<p className="form-error" role="alert">{mutationError}</p>}<div className="modal-footer"><button className="button button-secondary" type="button" disabled={mutationPending} onClick={()=>setDeleting(null)}>Отмена</button><button className="button button-danger" type="button" disabled={mutationPending} onClick={()=>void confirmDelete()}>{mutationPending?"Удаление…":"Удалить"}</button></div></section></div>}
 </section>;
}
