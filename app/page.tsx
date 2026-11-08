import {redirect} from "next/navigation";
import {ProductCatalog} from "@/app/components/ProductCatalog";
import {UserMenu} from "@/app/components/UserMenu";
import {auth} from "@/lib/auth";
import {getProductCategories} from "@/lib/dummyjson";
export default async function ProductsPage(){
 const session=await auth();if(!session?.user)redirect("/login");
 const categories=await getProductCategories().catch(()=>[] as string[]);
 return <main className="page-shell"><UserMenu name={session.user.name??session.user.email??"Пользователь"} role={session.user.role}/><ProductCatalog categories={categories} role={session.user.role}/></main>;
}
