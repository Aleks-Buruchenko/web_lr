import Link from "next/link";
export default function NotFound() {
  return <main className="page-shell error-page">
    <div className="error-symbol">404</div><h1>Товар не найден</h1>
    <p>В DummyJSON нет товара с таким идентификатором.</p>
    <Link href="/" className="button button-primary">Вернуться в каталог</Link>
  </main>;
}
