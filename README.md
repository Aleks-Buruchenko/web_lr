# Каталог товаров — лабораторная работа № 2

Продолжение лабораторной работы № 1. Предметная область — **Products** (вариант 2). SPA на React + Vite перенесено на **Next.js App Router + TypeScript**. Данные поступают из DummyJSON.

## Возможности

- список товаров и отдельная динамическая страница `/products/[id]`;
- поиск через DummyJSON Search API;
- фильтрация по категориям;
- сортировка по названию, цене и рейтингу;
- пагинация через `limit` и `skip`, кнопка «Загрузить ещё»;
- добавление, редактирование и удаление через DummyJSON;
- общее клиентское состояние на Zustand;
- Server Components для страниц и первоначальной загрузки данных;
- Client Components для интерактивного каталога, форм, store и страницы товара;
- Route Handler `GET /api/products` как HTTP-прокси к DummyJSON;
- Server Actions для трёх операций изменения данных;
- кэширование серверных запросов на 60 секунд по тегу `products`;
- состояния загрузки, повторной загрузки со старыми данными, пустого результата, ошибки и отправки формы;
- `loading.tsx`, `error.tsx` и `not-found.tsx`.

## Особенность DummyJSON и временные мутации

DummyJSON имитирует POST, PATCH и DELETE и возвращает результат операции, но не сохраняет изменения на сервере. Поэтому созданные и изменённые записи хранятся в отдельной части Zustand store на время текущей сессии браузера. Страница товара сначала использует эту запись из store, а если её нет — данные, полученные с DummyJSON. Это позволяет открыть недавно добавленный товар и увидеть его изменения при клиентской навигации. После полной перезагрузки страницы временные записи исчезают, а исходные данные API возвращаются — это ожидаемое поведение сервиса.

## Зависимости

- `next` — Next.js App Router;
- `react`, `react-dom` — React;
- `typescript` — типизация;
- `zustand` — общее клиентское состояние;
- `lucide-react` — иконки.

## Запуск

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
  layout.tsx                 Server Component: создаёт общий Zustand Provider
  page.tsx                   Server Component: получает категории
  actions.ts                 Server Actions: create / update / delete
  api/products/route.ts      Route Handler: GET /api/products
  components/
    ProductCard.tsx          Client Component
    ProductCatalog.tsx       Client Component: поиск, фильтры, пагинация, CRUD
    ProductDetails.tsx       Client Component: показывает запись из store или API
    ProductForm.tsx          Client Component
    StoreProvider.tsx        Client Component: Zustand Provider
  products/[id]/page.tsx     Server Component: загружает товар по динамическому id
  loading.tsx
  error.tsx
  not-found.tsx
  globals.css
lib/
  dummyjson.ts               server-only API layer и кэширование
  types.ts                   типы данных
```

### Поток данных

1. `app/layout.tsx` — Server Component. Загружает начальную страницу товаров и размещает Zustand Provider на уровне приложения, чтобы состояние сохранялось при переходах между маршрутами.
2. `app/page.tsx` — Server Component. Загружает категории и отображает каталог.
3. `ProductCatalog` — Client Component. Использует Zustand store для списка, поиска, фильтрации, пагинации и CRUD.
4. Поиск, фильтр, сортировка и следующая страница запрашиваются у `GET /api/products`.
5. Route Handler валидирует параметры и обращается к общему серверному слою `lib/dummyjson.ts`.
6. Добавление, изменение и удаление вызывают Server Actions из `app/actions.ts`. Они используют тот же API-слой, проверяют входные значения и обновляют кэш.
7. `app/products/[id]/page.tsx` — Server Component, который получает товар по динамическому id. `ProductDetails` проверяет временные записи Zustand store перед использованием ответа API. Поэтому добавленный товар открывается без обращения к несуществующей серверной записи.

### Кэширование

Чтение данных выполняется серверным `fetch` с `next: { revalidate: 60, tags: ["products"] }`. После мутации Server Action вызывает `updateTag("products")` для немедленного истечения кэша и `revalidatePath` для обновления нужных страниц.

### Сценарии проверки

1. Открыть каталог и дождаться списка товаров.
2. Ввести часть названия и выполнить поиск.
3. Выбрать категорию, изменить сортировку.
4. Нажать «Загрузить ещё» — повторяющиеся id не должны появляться.
5. Открыть страницу существующего товара.
6. Добавить новый товар и открыть его карточку — страница должна показать данные из Zustand store.
7. Изменить товар и перейти на его страницу — должны отображаться обновлённые значения.
8. Удалить товар.
9. Перезагрузить страницу: исходные записи восстановятся, а временные изменения пропадут, потому что DummyJSON не хранит мутации.

Лабораторная работа № 1 находится в ветке `main`. Вторая лабораторная размещена в ветке `lab2-nextjs`.
