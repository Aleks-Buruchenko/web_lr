import {describe,expect,it,vi} from "vitest";
import {render,screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ProductCard} from "@/app/components/ProductCard";
import type {Product} from "@/lib/types";
vi.mock("next/link",()=>({default:({children,href,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>&{href:string})=><a href={href} {...props}>{children}</a>}));
const item:Product={id:5,title:"Тестовый товар",description:"Описание",category:"beauty",price:20,discountPercentage:10,rating:4.7,stock:8,brand:"Brand",thumbnail:"https://example.com/item.jpg"};
const callbacks={onEdit:vi.fn(),onDelete:vi.fn()};
describe("ProductCard",()=>{
 it("показывает переданные сведения о товаре",()=>{render(<ProductCard product={item} role="admin" {...callbacks}/>);expect(screen.getByText("Тестовый товар")).toBeInTheDocument();expect(screen.getByText("Brand")).toBeInTheDocument();expect(screen.getByText("beauty")).toBeInTheDocument();expect(screen.getByText("4.7")).toBeInTheDocument();});
 it("не показывает удаление обычному пользователю",()=>{render(<ProductCard product={item} role="user" {...callbacks}/>);expect(screen.queryByRole("button",{name:"Удалить"})).not.toBeInTheDocument();});
 it("администратор может вызвать удаление",async()=>{const user=userEvent.setup();render(<ProductCard product={item} role="admin" {...callbacks}/>);await user.click(screen.getByRole("button",{name:"Удалить"}));expect(callbacks.onDelete).toHaveBeenCalledWith(item);});
});
