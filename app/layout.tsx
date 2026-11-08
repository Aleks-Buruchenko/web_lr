import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Каталог товаров — Products",
  description: "Учебное приложение для просмотра и управления товарами на Next.js.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
