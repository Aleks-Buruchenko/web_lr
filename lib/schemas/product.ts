import { z } from "zod";
const productFields = {
 title: z.string().trim().min(3,"Название должно содержать не менее 3 символов.").max(120,"Название не должно превышать 120 символов."),
 description: z.string().trim().max(1000,"Описание не должно превышать 1000 символов.").default(""),
 category: z.string().trim().min(1,"Выберите категорию."),
 price: z.coerce.number().finite("Введите корректную цену.").positive("Цена должна быть больше нуля."),
 discountPercentage: z.coerce.number().finite().min(0,"Скидка не может быть отрицательной.").max(100,"Скидка не может превышать 100%."),
 stock: z.coerce.number().int("Остаток должен быть целым числом.").min(0,"Остаток не может быть отрицательным."),
 brand: z.string().trim().max(80,"Название бренда слишком длинное.").default(""),
 thumbnail: z.union([z.literal(""),z.url("Укажите корректный URL изображения.")]).default("")
};
// Скидка ограничена диапазоном 0–100%, цена строго положительная.
export const createProductSchema=z.object(productFields);
export const updateProductSchema=createProductSchema;
export type CreateProductInput=z.infer<typeof createProductSchema>;
export type UpdateProductInput=z.infer<typeof updateProductSchema>;
