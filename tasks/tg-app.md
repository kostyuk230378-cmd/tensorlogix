# ТИКЕТ: NEXTJS_TMA_MALL_V10_1 — Telegram Mini App (базовый каркас)

> Статус: КАРКАС РАЗВЁРНУТ. Продуктовые требования ТЗ ещё НЕ зафиксированы —
> они появятся после этапа ПРОЖАРКИ (/grill-me) и будут записаны в `SPECIFICATION.md`.

## Цель
Единый Fullstack-монорепозиторий для сайта и Telegram Mini App
с развёртыванием на собственном сервере клиента.

## Жёсткий технологический стек (зафиксирован в .clinerules)
| Слой | Технология |
|---|---|
| Фреймворк | Next.js 14+ (App Router) + TypeScript, единый проект для сайта и TMA |
| БД | Облачный Supabase (PostgreSQL) + Prisma ORM |
| Валидация | Zod |
| Стили | Tailwind CSS + shadcn/ui + Lucide React, шрифт — системный стек Inter |
| Анимации | framer-motion (микровзаимодействия, шторки BottomSheet, переходы) |
| Интеграция TMA | @telegram-apps/sdk-react + Telegram.WebApp.themeParams |
| Дизайн-контроль | impeccable detect (анти-слоп линтер) + Playwright скриншот-регрессия |

## Текущее состояние каркаса (развёрнуто при ИНИЦИАЛИЗАЦИИ)
- [x] `create-next-app` (App Router, TypeScript, Tailwind CSS, ESLint, src/)
- [x] git-репозиторий инициализирован
- [x] `.claude/skills/grill-me`, `.claude/skills/handoff` — алгоритмы скачаны с GitHub
- [x] impeccable CLI подключается через `npx impeccable` (detect / install / update)
- [x] Prisma ORM 7 + базовая схема (User/Category/Product/Order/OrderItem), клиент, `src/lib/prisma.ts`
- [ ] **БЛОКЕР:** таблицы в Supabase не развёрнуты — `P1001: Can't reach database server` (проект, вероятно, на паузе; нужен Restore в дашборде → `npx prisma migrate dev --name init`)
- [ ] @telegram-apps/sdk-react (после утверждения экрана-точки входа)
- [ ] framer-motion (добавляется вместе с первым анимированным компонентом)
- [ ] shadcn/ui init (перед первым UI-компонентом)

## Критерии проверок (Definition of Done для будущих тикетов)
1. **Типы и сборка:** `npm run build` проходит без ошибок TypeScript.
2. **Линт:** `npm run lint` + `npx impeccable detect <компонент>` — 0 нарушений
   (избыточный Tailwind, нарушения сетки и т.п. устраняются ДО стоп-точки).
3. **Валидация данных:** все входные данные серверных действий проверяются через Zod.
4. **Визуальная регрессия:** Playwright-скриншот мобильного вьюпорта (пропорции
   Telegram WebApp) сравнивается с эталоном; скриншот выводится в чат на стоп-точке.
5. **Тема TMA:** компонент поддерживает обе темы через Telegram.WebApp.themeParams.
6. **СТОП-ТОЧКА:** после каждого экрана/компонента агент останавливается и ждёт
   текстового одобрения пользователя. Автогенерация всего фронта ЗАПРЕЩЕНА.
7. **Коммиты:** только через роль /git-flow, точечные патчи, без «прости-господи»
   переписываний.

## Следующий шаг конвейера
Статус `ОЖИДАНИЕ_ПРОЖАРКИ` → по команде «Поехали» стартует опрос /grill-me
(по 1 вопросу за раз) для превращения ТЗ в `SPECIFICATION.md`.
