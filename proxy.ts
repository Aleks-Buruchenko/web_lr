import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

// Proxy используется для удобного редиректа. Доступ к данным и мутациям
// независимо от Proxy проверяются на сервере.
export default auth((request)=>{
 const path=request.nextUrl.pathname;
 const isAuthenticated=Boolean(request.auth?.user);
 if(!isAuthenticated&&(path==="/products/new"||/^\/products\/\d+\/edit$/.test(path))){
  return NextResponse.redirect(new URL("/login",request.url));
 }
 return NextResponse.next();
});
export const config={matcher:["/products/new","/products/:id/edit"]};
