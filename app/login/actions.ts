"use server";
import {AuthError} from "next-auth";
import {signIn} from "@/lib/auth";
import {loginSchema} from "@/lib/schemas/auth";
export async function loginAction(formData:FormData){
 const parsed=loginSchema.safeParse({email:formData.get("email"),password:formData.get("password")});
 if(!parsed.success)return {error:parsed.error.issues[0]?.message??"Проверьте введённые данные."};
 try{await signIn("credentials",{...parsed.data,redirectTo:"/"});return {error:null};}
 catch(error){if(error instanceof AuthError)return {error:"Неверная почта или пароль."};throw error;}
}
