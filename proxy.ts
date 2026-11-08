import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

// Proxy нужен только для удобного перенаправления. Реальные права
// дополнительно проверяются в Server Functions и Route Handlers.
export default auth((request)=>{
 const path=request.nextUrl.pathname;
 if(!request.auth&&(path==="/products/new"||/^\/products\/\d+\/edit$/.test(path))){
  return NextResponse.redirect(new URL("/login",request.url));
 }
 return NextResponse.next();
});
export const config={matcher:["/products/new","/products/:id/edit"]};
