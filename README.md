# Лабораторная работа №3 — Каталог товаров
Products (вариант 2), Next.js App Router, TypeScript, DummyJSON.

## Реализовано
- Zod-схемы создания и редактирования; повторная серверная валидация.
- Auth.js Credentials: вход, выход, JWT-сессия в cookie.
- Роли user (просмотр, создание, изменение) и admin (включая удаление).
- Проверка доступа в Server Functions; DELETE Route Handler проверяет сессию и роль.
- Компонентные тесты Vitest, React Testing Library и user-event.
- Coverage: npm run coverage.

## Демо-аккаунты
user@example.com / user123 — user.
admin@example.com / admin123 — admin.
Для production необходима БД и безопасное хеширование паролей вместо паролей в исходном коде.

## .env.local
AUTH_SECRET=длинный-случайный-секрет
AUTH_URL=http://localhost:3000
Секрет сгенерировать: npx auth secret.

## Запуск
npm install
npm run dev
npm test
npm run coverage
npm run build
HTML-отчёт: coverage/index.html.

## Предметные правила
Название не короче 3 символов; цена больше нуля; скидка 0–100%; остаток — целое неотрицательное число; URL изображения корректен.
DummyJSON имитирует мутации без постоянного сохранения. Изменения отображаются в Zustand до перезагрузки.
