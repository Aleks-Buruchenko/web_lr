"use client";
import { useEffect } from "react";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Ошибка сегмента приложения:", error); }, [error]);
  return <main className="page-shell error-page">
    <div className="error-symbol">!</div><h1>Не удалось загрузить страницу</h1>
    <p>{error.message || "Произошла непредвиденная ошибка."}</p>
    <button className="button button-primary" type="button" onClick={() => reset()}>Повторить попытку</button>
  </main>;
}
