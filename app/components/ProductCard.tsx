"use client";
import Link from "next/link";
import {Pencil,Star,Trash2} from "lucide-react";
import type {Product} from "@/lib/types";
interface Props{product:Product;role:"user"|"admin";onEdit:(product:Product)=>void;onDelete:(product:Product)=>void;}
export function ProductCard({product,role,onEdit,onDelete}:Props){
 const status=product.stock===0?"Нет в наличии":product.stock<=5?"Заканчивается":"В наличии";
 const statusClass=product.stock===0?"empty":product.stock<=5?"low":"ok";
 return <article className="product-card">
 <Link className="product-visual" href={`/products/${product.id}`} aria-label={`Открыть товар ${product.title}`}>
 {product.thumbnail?<img src={product.thumbnail} alt={product.title} loading="lazy"/>:<span className="image-placeholder">📦</span>}
 <span className="category-chip">{product.category}</span>{product.discountPercentage>0&&<span className="discount-chip">−{Math.round(product.discountPercentage)}%</span>}</Link>
 <div className="product-body"><span className="brand-label">{product.brand||"Без бренда"}</span><Link className="product-title" href={`/products/${product.id}`}>{product.title}</Link>
 <div className="product-meta"><span className="rating"><Star size={13} fill="currentColor"/>{Number(product.rating||0).toFixed(1)}</span><span>{product.stock} шт. на складе</span></div>
 <div className="product-bottom"><div><strong className="product-price">{product.price.toLocaleString("ru-RU",{style:"currency",currency:"USD"})}</strong><span className={`stock-status ${statusClass}`}><i/>{status}</span></div>
 <div className="card-actions"><button className="icon-action" type="button" onClick={()=>onEdit(product)} aria-label="Редактировать"><Pencil size={15}/></button>
 {role==="admin"&&<button className="icon-action delete-action" type="button" onClick={()=>onDelete(product)} aria-label="Удалить"><Trash2 size={15}/></button>}</div></div></div></article>;
}
