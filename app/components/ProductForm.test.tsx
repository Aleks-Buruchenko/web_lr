import {describe,expect,it,vi} from "vitest";
import {render,screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ProductForm} from "@/app/components/ProductForm";
import type {Product} from "@/lib/types";
const makeProps=()=>({product:null,categories:["beauty","fragrances"],pending:false,error:"",role:"user" as const,onClose:vi.fn(),onSave:vi.fn()});
const product:Product={id:1,title:"Смартфон",description:"Описание",category:"smartphones",price:500,discountPercentage:5,rating:4.5,stock:12,brand:"PhoneCo",thumbnail:""};
describe("ProductForm",()=>{
 it("показывает ошибку Zod для слишком короткого названия",async()=>{const props=makeProps();const user=userEvent.setup();render(<ProductForm {...props}/>);await user.clear(screen.getByLabelText("Название"));await user.type(screen.getByLabelText("Название"),"TV");await user.click(screen.getByRole("button",{name:"Добавить товар"}));expect(screen.getByRole("alert")).toHaveTextContent("не менее 3 символов");expect(props.onSave).not.toHaveBeenCalled();});
 it("передаёт данные при корректном вводе",async()=>{const props=makeProps();const user=userEvent.setup();render(<ProductForm {...props}/>);await user.type(screen.getByLabelText("Название"),"Новый товар");await user.click(screen.getByRole("button",{name:"Добавить товар"}));expect(props.onSave).toHaveBeenCalledWith(expect.objectContaining({title:"Новый товар",price:1,stock:0}));});
 it("заполняет поля при редактировании",()=>{const props=makeProps();render(<ProductForm {...props} product={product}/>);expect(screen.getByLabelText("Название")).toHaveValue("Смартфон");expect(screen.getByLabelText("Цена")).toHaveValue(500);});
});
