# Лабораторная работа №3 — Каталог товаров
Продолжение ЛР2. Products (вариант 2), Next.js App Router, TypeScript, DummyJSON.

## Возможности
- Zod-схемы создания и редактирования; повторная серверная валидация.
- Auth.js Credentials: вход, выход, JWT-сессия в защищённой cookie.
- Роли user (просмотр, создание, изменение) и admin (все права плюс удаление).
- Проверка прав в Server Functions; DELETE Route Handler защищён сессией и ролью.
- Компонентные тесты Vitest, React Testing Library и user-event.
- Покрытие: npm run coverage.

## Демо-аккаунты
user@example.com / user123 — пользователь.
admin@example.com / admin123 — администратор.
Это демонстрационные учётные записи для лабораторной. Для production используйте БД и хеши паролей, а не пароли в исходном коде.

## .env.local
AUTH_SECRET=длинный-случайный-секрет
AUTH_URL=http://localhost:3000
Секрет можно получить командой npx auth secret.

## Запуск и проверка
npm install
npm run dev
npm test
npm run coverage
npm run build
HTML-отчёт покрытия: coverage/index.html.

## Правила валидации
Название не короче 3 символов; цена больше нуля; скидка 0–100%; остаток — целое неотрицательное число; URL изображения корректен.
DummyJSON имитирует мутации без постоянного хранения. Изменения доступны в Zustand до перезагрузки.
