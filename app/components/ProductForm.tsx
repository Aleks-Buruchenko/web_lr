"use client";
import {useEffect,useState,type FormEvent} from "react";
import {X} from "lucide-react";
import {createProductSchema,updateProductSchema,type CreateProductInput} from "@/lib/schemas/product";
import type {Product} from "@/lib/types";
interface Props{product:Product|null;categories:string[];pending:boolean;error:string;role:"user"|"admin";onClose:()=>void;onSave:(input:CreateProductInput)=>void;}
const empty:CreateProductInput={title:"",description:"",category:"beauty",price:1,discountPercentage:0,stock:0,brand:"",thumbnail:""};
export function ProductForm({product,categories,pending,error,onClose,onSave}:Props){
 const [form,setForm]=useState<CreateProductInput>(empty);const [errors,setErrors]=useState<Record<string,string>>({});
 useEffect(()=>{setForm(product?{title:product.title,description:product.description,category:product.category,price:product.price,discountPercentage:product.discountPercentage,stock:product.stock,brand:product.brand??"",thumbnail:product.thumbnail??""}:empty);setErrors({});},[product]);
 function field<K extends keyof CreateProductInput>(key:K,value:CreateProductInput[K]){setForm(s=>({...s,[key]:value}));setErrors(s=>({...s,[key]:""}));}
 function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const parsed=(product?updateProductSchema:createProductSchema).safeParse(form);if(!parsed.success){const next:Record<string,string>={};for(const issue of parsed.error.issues)next[String(issue.path[0]??"form")]=issue.message;setErrors(next);return;}setErrors({});onSave(parsed.data);}
 const errorFor=(key:string)=>errors[key]?<small className="field-error" role="alert">{errors[key]}</small>:null;
 return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget&&!pending)onClose();}}>
 <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title"><header className="modal-heading"><div><span className="eyebrow">DUMMYJSON PRODUCTS</span><h2 id="product-form-title">{product?"Редактирование товара":"Добавление товара"}</h2><p>Заполните основные сведения о товаре.</p></div><button className="icon-action" type="button" onClick={onClose} disabled={pending} aria-label="Закрыть"><X/></button></header>
 <form className="product-form" onSubmit={submit} noValidate>
 <label className="form-field full-field"><span>Название <b>*</b></span><input aria-label="Название" value={form.title} onChange={e=>field("title",e.target.value)}/>{errorFor("title")}</label>
 <label className="form-field"><span>Бренд</span><input aria-label="Бренд" value={form.brand} onChange={e=>field("brand",e.target.value)}/>{errorFor("brand")}</label>
 <label className="form-field"><span>Категория</span><select aria-label="Категория" value={form.category} onChange={e=>field("category",e.target.value)}>{Array.from(new Set([form.category,...categories])).map(x=><option value={x} key={x}>{x}</option>)}</select>{errorFor("category")}</label>
 <label className="form-field full-field"><span>Описание</span><textarea rows={3} aria-label="Описание" value={form.description} onChange={e=>field("description",e.target.value)}/>{errorFor("description")}</label>
 <label className="form-field"><span>Цена, $ <b>*</b></span><input aria-label="Цена" type="number" step="0.01" value={form.price} onChange={e=>field("price",Number(e.target.value))}/>{errorFor("price")}</label>
 <label className="form-field"><span>Скидка, %</span><input aria-label="Скидка" type="number" step="0.01" value={form.discountPercentage} onChange={e=>field("discountPercentage",Number(e.target.value))}/>{errorFor("discountPercentage")}</label>
 <label className="form-field"><span>Остаток, шт.</span><input aria-label="Остаток" type="number" step="1" value={form.stock} onChange={e=>field("stock",Number(e.target.value))}/>{errorFor("stock")}</label>
 <label className="form-field full-field"><span>URL изображения</span><input aria-label="URL изображения" value={form.thumbnail} onChange={e=>field("thumbnail",e.target.value)}/>{errorFor("thumbnail")}</label>
 {error&&<p className="form-error" role="alert">{error}</p>}<footer className="modal-footer"><button className="button button-secondary" type="button" onClick={onClose} disabled={pending}>Отмена</button><button className="button button-primary" type="submit" disabled={pending}>{pending?"Отправка…":product?"Сохранить изменения":"Добавить товар"}</button></footer>
 </form></section></div>;
}
