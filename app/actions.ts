"use server";
import {revalidatePath,updateTag} from "next/cache";
import {addProduct,editProduct,removeProduct} from "@/lib/dummyjson";
import {createProductSchema,updateProductSchema} from "@/lib/schemas/product";
import {requireRole,requireUser} from "@/lib/access";
import type {Product} from "@/lib/types";
export type ActionResult<T>={success:true;data:T}|{success:false;error:string;fieldErrors?:Record<string,string[]>};
function validationError(error:{issues:Array<{path:PropertyKey[];message:string}>}):ActionResult<never>{
 const fieldErrors:Record<string,string[]>={};for(const issue of error.issues){const key=String(issue.path[0]??"form");(fieldErrors[key]??=[]).push(issue.message);}
 return {success:false,error:"Проверьте правильность заполнения формы.",fieldErrors};
}
export async function createProductAction(raw:unknown):Promise<ActionResult<Product>>{
 const user=await requireUser().catch(()=>null);if(!user)return {success:false,error:"Для добавления товара войдите в систему."};
 const parsed=createProductSchema.safeParse(raw);if(!parsed.success)return validationError(parsed.error);
 try{const data=await addProduct(parsed.data);updateTag("products");revalidatePath("/");return {success:true,data};}
 catch(error){return {success:false,error:error instanceof Error?error.message:"Не удалось добавить товар."};}
}
export async function updateProductAction(id:number,raw:unknown):Promise<ActionResult<Product>>{
 const user=await requireUser().catch(()=>null);if(!user)return {success:false,error:"Для изменения товара войдите в систему."};
 if(!Number.isInteger(id)||id<1)return {success:false,error:"Некорректный идентификатор товара."};
 const parsed=updateProductSchema.safeParse(raw);if(!parsed.success)return validationError(parsed.error);
 try{const data=await editProduct(id,parsed.data);updateTag("products");revalidatePath("/");revalidatePath(`/products/${id}`);return {success:true,data};}
 catch(error){return {success:false,error:error instanceof Error?error.message:"Не удалось изменить товар."};}
}
export async function deleteProductAction(id:number):Promise<ActionResult<Product>>{
 const access=await requireRole("admin").then(user=>({user})).catch(error=>({error}));
 if("error"in access){const message=access.error instanceof Error&&access.error.message==="UNAUTHENTICATED"?"Для удаления войдите в систему.":"Удалять товары может только администратор.";return {success:false,error:message};}
 if(!Number.isInteger(id)||id<1)return {success:false,error:"Некорректный идентификатор товара."};
 try{const data=await removeProduct(id);updateTag("products");revalidatePath("/");revalidatePath(`/products/${id}`);return {success:true,data};}
 catch(error){return {success:false,error:error instanceof Error?error.message:"Не удалось удалить товар."};}
}
