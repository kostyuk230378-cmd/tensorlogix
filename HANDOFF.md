# HANDOFF — TensorLogix / NEXTJS_TMA_MALL_V10_1

> Обновлено: 24.08.2026 — завершён этап ИНИЦИАЛИЗАЦИЯ, статус конвейера: ОЖИДАНИЕ_ПРОЖАРКИ

## Что строим
- Единый Fullstack-монорепозиторий Next.js (App Router): сайт + Telegram Mini App (MALL V10).
- ТЗ ещё НЕ зафиксировано — будет записано в `SPECIFICATION.md` после ПРОЖАРКИ (/grill-me).

## Прогресс
- [x] Next.js-каркас (TypeScript, Tailwind CSS, ESLint, src/), git-репозиторий инициализирован
- [x] `tasks/tg-app.md` — стек, состояние каркаса и критерии проверок (DoD)
- [x] Скиллы `grill-me` и `handoff` скачаны с GitHub → `.claude/skills/`
- [x] Impeccable установлен в проект (`.claude`, `.agents`, `.kiro`, `.pi`), хуки детектора подключены, `impeccable detect` проверен (0 находок на шаблоне)
- [x] `control.md` → АВТОПИЛОТ (24.08.2026): прожарка завершена, ТЗ v1.0 утверждено заказчиком
- [x] Prisma 7.9.1 + модель `Lead` (конфигурация калькулятора, маркетинг, смета, контакты), клиент через `PrismaPg`-адаптер, `.env` (+TELEGRAM_*)
- [x] Бэкенд лидов: `POST /api/leads` (Zod + бизнес-правила ТЗ §2), `src/lib/telegram.ts` — уведомления через Bot API
- [x] Архитектура калькулятора: `src/lib/calculator/types.ts` + `pricing.ts` (цены — плейсхолдеры, ждут утверждения), тикеты в `tasks/avtopilot-tickets.md`
- [ ] **БЛОКЕР:** БД Supabase недоступна (P1001) — таблица `leads` не развёрнута; ждём Restore проекта
- [x] `SPECIFICATION.md` (ТЗ v1.0) + `DESIGN.md` (LIGHT MATRIX) зафиксированы
- [ ] Перед первым UI-компонентом: `/impeccable init`, `shadcn/ui init`, @telegram-apps/sdk-react (framer-motion и zod уже установлены)

## Ключевые решения
- `impeccable` = npm-пакет (impeccable.style, Apache-2.0). Пункт протокола «impeccable init» выполняется как `/impeccable init` установленного скилла (интервью → PRODUCT.md/DESIGN.md); запускать на первом UI-шаге после ПРОЖАРКИ, т.к. сейчас продуктного контекста ещё нет.
- Скиллы живут на уровне проекта (`.claude/skills/`) и коммитятся в репозиторий.
- `.claude/settings.local.json` (хуки детектора) коммитим — это локальные правила контроля проекта.
- 24.08.2026: фундамент концепции утверждён заказчиком → `SPECIFICATION.md`: TensorLogix = IT-агентство полного цикла + B2B-платформа «Сайт + TMA» с Единым кабинетом; интеграции ЮKassa/Т-Банк/СДЭК; демо-TMA под кейс «Агентство Интеллектуальных Игр»; ядро ЦА — селлеры.

## Следующие шаги
1. [P0] От заказчика: Restore проекта Supabase → `npx prisma db push` (тикет BACK-2)
2. [P0] От заказчика: ценовая сетка, контакты-заглушки, TELEGRAM_BOT_TOKEN/CHAT_ID
3. [P1] UI-01: первый компонент (каркас + LIGHT MATRIX фон + логотип) → СТОП-ТОЧКА со скриншотом
4. [P2] Далее по `tasks/avtopilot-tickets.md`: UI-02…UI-10, BACK-5
