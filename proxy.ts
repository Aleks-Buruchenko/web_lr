import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {auth} from "@/lib/auth";
export default auth((request:NextRequest & {auth?:{user?:{role?:string}}})=>{
 const isLoggedIn=Boolean(request.auth?.user);const path=request.nextUrl.pathname;
 if(!isLoggedIn&&(path==="/products/new"||/^\/products\/\d+\/edit$/.test(path)))return NextResponse.redirect(new URL("/login",request.url));
 return NextResponse.next();
});
export const config={matcher:["/products/new","/products/:id/edit"]};
