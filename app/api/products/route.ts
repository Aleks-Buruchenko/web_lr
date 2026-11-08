import {NextRequest,NextResponse} from "next/server";
import {getProducts} from "@/lib/dummyjson";
import type {ProductsQuery,ProductsResponse} from "@/lib/types";
import {z} from "zod";
import {auth} from "@/lib/auth";
import {deleteProductAction} from "@/app/actions";
const querySchema=z.object({limit:z.coerce.number().int().min(1).max(50).default(12),skip:z.coerce.number().int().min(0).default(0),q:z.string().trim().max(100).optional(),category:z.string().trim().max(80).optional(),sortBy:z.enum(["title","price","rating"]).optional(),order:z.enum(["asc","desc"]).default("asc")});
export async function GET(request:NextRequest){
 const parsed=querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));if(!parsed.success)return NextResponse.json({message:"Некорректные параметры запроса."},{status:400});
 const query:ProductsQuery=parsed.data;
 try{const data:ProductsResponse=await getProducts(query);return NextResponse.json(data,{headers:{"Cache-Control":"private, no-store"}});}
 catch(error){return NextResponse.json({message:error instanceof Error?error.message:"Не удалось получить товары."},{status:502});}
}
export async function DELETE(request:NextRequest){
 const session=await auth();if(!session?.user)return NextResponse.json({message:"Требуется вход в систему."},{status:401});
 if(session.user.role!=="admin")return NextResponse.json({message:"Удаление доступно только администратору."},{status:403});
 const body=await request.json().catch(()=>null);const parsed=z.object({id:z.number().int().positive()}).safeParse(body);
 if(!parsed.success)return NextResponse.json({message:"Некорректный идентификатор товара."},{status:400});
 const result=await deleteProductAction(parsed.data.id);if(!result.success)return NextResponse.json({message:result.error},{status:403});
 return NextResponse.json(result.data);
}
