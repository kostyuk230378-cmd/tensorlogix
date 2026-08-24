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
- [x] Архитектура калькулятора: `src/lib/calculator/types.ts` + `pricing.ts`
- [x] 24.08.2026: заказчик утвердил ценовую сетку (визитка 15к/3д … маркетплейс 150к/30д; интеграции единым пунктом: сайт +20к/+2д, TMA +15к/+2д; модуль TMA +40к/+5д; терминал +25к/+4д; продвижение +10к/+3д за площадку) → `pricing.ts`
- [x] 24.08.2026: блокеры сняты — mock-режим: `POST /api/leads` отдаёт 201 без БД (`mocked: true`), Telegram-уведомления логируются в `console.log` до заполнения .env
- [x] Контакты-заглушки в `src/lib/site-config.ts`: +7 (999) 000-00-00, t.me/tensorlogix_ceo, info@tensorlogix.ru
- [x] UI-01 готов (коммит ebe4907): группа `(site)`, Header с логотипом (`public/logo.svg` — заглушка «две градиентные пирамиды», оригинал даст заказчик), Hero Space Grotesk во всю ширину (text-[10.5vw], tracking-widest), DigitalRain-canvas на белом (светло-стальные дорожки, prefers-reduced-motion), шрифты Inter + Space Grotesk, LIGHT MATRIX в globals.css
- [x] /test-driven: `impeccable detect` = 0 (антипаттерн gradient-text устранён), Playwright-скриншоты 390×844 и 1440×900 → `screenshots/` + эталон в `screenshots/baseline/`
- [x] `SPECIFICATION.md` (ТЗ v1.0) + `DESIGN.md` (LIGHT MATRIX) зафиксированы
- [ ] **СТОП-ТОЧКА UI-01:** ждём одобрения визуального стиля заказчиком
- [ ] Перед UI-02: `shadcn/ui init`, @telegram-apps/sdk-react (framer-motion и zod уже установлены)
- [ ] Supabase: `npx prisma db push` после Restore проекта (BACK-2)

## Ключевые решения
- `impeccable` = npm-пакет (impeccable.style, Apache-2.0). Пункт протокола «impeccable init» выполняется как `/impeccable init` установленного скилла (интервью → PRODUCT.md/DESIGN.md); запускать на первом UI-шаге после ПРОЖАРКИ, т.к. сейчас продуктного контекста ещё нет.
- Скиллы живут на уровне проекта (`.claude/skills/`) и коммитятся в репозиторий.
- `.claude/settings.local.json` (хуки детектора) коммитим — это локальные правила контроля проекта.
- 24.08.2026: фундамент концепции утверждён заказчиком → `SPECIFICATION.md`: TensorLogix = IT-агентство полного цикла + B2B-платформа «Сайт + TMA» с Единым кабинетом; интеграции ЮKassa/Т-Банк/СДЭК; демо-TMA под кейс «Агентство Интеллектуальных Игр»; ядро ЦА — селлеры.

## Следующие шаги
1. [P0] **СТОП-ТОЧКА UI-01** — одобрение заказчиком визуального стиля/анимации; правки вносятся патчами до одобрения
2. [P1] UI-02: умный калькулятор (шаги 1–6, Framer Motion, BottomSheet)
3. [P1] От заказчика: Restore Supabase → `npx prisma db push` (BACK-2); реальные TELEGRAM_BOT_TOKEN/CHAT_ID; оригинальный файл логотипа взамен `public/logo.svg`
4. [P2] Далее по `tasks/avtopilot-tickets.md`: UI-03…UI-10, BACK-5
