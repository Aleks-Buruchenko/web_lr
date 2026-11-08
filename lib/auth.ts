import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/schemas/auth";

// Демо-учётные записи для лабораторной. Для production нужны БД и хеширование паролей.
const demoUsers=[
 {id:"user-1",name:"Обычный пользователь",email:"user@example.com",password:"user123",role:"user" as const},
 {id:"admin-1",name:"Администратор",email:"admin@example.com",password:"admin123",role:"admin" as const}
];
export const {handlers,auth,signIn,signOut}=NextAuth({
 trustHost:true,session:{strategy:"jwt",maxAge:60*60*8},pages:{signIn:"/login"},
 providers:[Credentials({credentials:{email:{},password:{}},async authorize(raw){
  const parsed=loginSchema.safeParse(raw);if(!parsed.success)return null;
  const found=demoUsers.find(u=>u.email===parsed.data.email&&u.password===parsed.data.password);
  return found?{id:found.id,name:found.name,email:found.email,role:found.role}:null;
 }})],
 callbacks:{
  async jwt({token,user}){if(user)token.role=(user as typeof user & {role:"user"|"admin"}).role;return token;},
  async session({session,token}){if(session.user){session.user.id=token.sub??"";session.user.role=token.role==="admin"?"admin":"user";}return session;}
 }
});
