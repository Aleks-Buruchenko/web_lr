"use client";
import {useState,type FormEvent} from "react";
import {loginAction} from "@/app/login/actions";
export function LoginForm(){
 const [error,setError]=useState("");const [pending,setPending]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setPending(true);setError("");const result=await loginAction(new FormData(event.currentTarget));if(result?.error)setError(result.error);setPending(false);}
 return <section className="auth-card"><span className="eyebrow">PRODUCTS CATALOG</span><h1>Вход в систему</h1><p>Войдите, чтобы управлять каталогом товаров.</p>
 <form onSubmit={submit} className="auth-form">
 <label className="form-field"><span>Электронная почта</span><input name="email" type="email" autoComplete="username" required/></label>
 <label className="form-field"><span>Пароль</span><input name="password" type="password" autoComplete="current-password" required/></label>
 {error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={pending}>{pending?"Входим…":"Войти"}</button>
 </form><div className="demo-credentials"><strong>Демо-доступ</strong><span>user@example.com / user123</span><span>admin@example.com / admin123</span></div></section>;
}
