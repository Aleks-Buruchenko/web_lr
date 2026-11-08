# Каталог товаров — лабораторная работа № 2

Продолжение лабораторной работы № 1. Предметная область — **Products** (вариант 2). SPA на React + Vite перенесено на **Next.js App Router + TypeScript**. Реальные данные поступают из DummyJSON.

## Возможности

- список товаров и отдельная динамическая страница `/products/[id]`;
- поиск через DummyJSON Search API;
- фильтрация по категориям;
- сортировка по названию, цене и рейтингу;
- пагинация через `limit` и `skip`, кнопка «Загрузить ещё»;
- добавление, редактирование и удаление через DummyJSON;
- общее клиентское состояние на Zustand;
- Server Components для страниц и загрузки первоначальных данных;
- Client Components для интерактивного каталога, форм и store;
- Route Handler `GET /api/products` как HTTP-прокси к DummyJSON;
- Server Actions для трёх операций изменения данных;
- кэширование серверных запросов на 60 секунд по тегу `products`;
- состояния загрузки, повторной загрузки со старыми данными, пустого результата, ошибки и отправки формы;
- `loading.tsx`, `error.tsx` и `not-found.tsx`.

## Особенность DummyJSON

DummyJSON имитирует POST, PATCH и DELETE и возвращает результат операции, но не сохраняет изменения на сервере. В этой работе результат мутации сразу обновляет Zustand store, поэтому его видно в текущем интерфейсе. После полной перезагрузки страницы серверные исходные данные вернутся — это ожидаемое поведение API.

## Зависимости

- `next` — Next.js App Router;
- `react`, `react-dom` — React;
- `typescript` — типизация;
- `zustand` — общее клиентское состояние;
- `lucide-react` — иконки.

## Запуск на macOS

Нужен Node.js 20.9 или новее.

```bash
npm install
npm run dev
```

Откройте http://localhost:3000.

Проверка production-сборки:

```bash
npm run build
npm start
```

## Архитектура компонентов

```text
app/
  actions.ts                 Server Actions: create / update / delete
  api/products/route.ts      Route Handler: GET /api/products
  components/
    ProductCard.tsx          Client Component
    ProductCatalog.tsx       Client Component: поиск, фильтры, пагинация, CRUD
    ProductForm.tsx          Client Component
    StoreProvider.tsx        Client Component: Zustand Provider
  products/[id]/page.tsx     Server Component: детальная страница
  page.tsx                   Server Component: начальная загрузка каталога
  layout.tsx
  loading.tsx
  error.tsx
  not-found.tsx
  globals.css
lib/
  dummyjson.ts               server-only API layer и кэширование
  products-store.ts          (store реализован в StoreProvider)
  types.ts                   типы данных
```

### Поток данных

1. `app/page.tsx` — Server Component. Загружает первую страницу каталога и категории с DummyJSON.
2. `ProductCatalog` — Client Component. Получает начальные данные через props и использует Zustand store.
3. Поиск, фильтр, сортировка и следующая страница запрашиваются у `GET /api/products`.
4. Route Handler валидирует параметры и обращается к общему серверному слою `lib/dummyjson.ts`.
5. Добавление, изменение и удаление вызывают Server Actions из `app/actions.ts`. Они используют тот же API-слой, проверяют входные значения и обновляют кэш.
6. `app/products/[id]/page.tsx` — Server Component, который получает отдельный товар по динамическому id.

### Кэширование

Чтение данных выполняется серверным `fetch` с `next: { revalidate: 60, tags: ["products"] }`. После мутации Server Action вызывает `updateTag("products")` для немедленного истечения кэша и `revalidatePath` для обновления нужных страниц.

### Сценарии проверки

1. Открыть каталог и дождаться списка товаров.
2. Ввести часть названия и выполнить поиск.
3. Выбрать категорию, изменить сортировку.
4. Нажать «Загрузить ещё» — повторяющиеся id не должны появляться.
5. Открыть карточку и перейти на динамический маршрут товара.
6. Добавить товар, изменить его и удалить.
7. Перезагрузить страницу: исходные записи восстановятся, потому что DummyJSON не хранит мутации.

Лабораторная работа № 1 находится в ветке `main`. Вторая лабораторная размещена в ветке `lab2-nextjs`.
