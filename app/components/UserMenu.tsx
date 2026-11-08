import {signOut} from "@/lib/auth";
export function UserMenu({name,role}:{name:string;role:"user"|"admin"}){
 return <div className="user-menu"><div className="user-info"><strong>{name}</strong><span className={role==="admin"?"role-badge admin":"role-badge"}>{role==="admin"?"Администратор":"Пользователь"}</span></div><form action={async() => {"use server";await signOut({redirectTo:"/login"});}}><button className="button button-secondary small-button" type="submit">Выйти</button></form></div>;
}
