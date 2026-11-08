import "server-only";
import {auth} from "@/lib/auth";
export type UserRole="user"|"admin";
export async function requireUser(){
 const session=await auth();if(!session?.user)throw new Error("UNAUTHENTICATED");return session.user;
}
export async function requireRole(role:UserRole){
 const user=await requireUser();if(role==="admin"&&user.role!=="admin")throw new Error("FORBIDDEN");return user;
}
