# HANDOFF — TensorLogix / NEXTJS_TMA_MALL_V10_1 (PIVOT v2.0)

> Обновлено: 24.08.2026 — PIVOT v2.0: DEEP DARK + open-source скилл @tensorlogix/ui-core (MIT);
> лендинг пересобран (блоки 0–4); коммит `b03b587` зафиксирован и ОПУБЛИКОВАН на GitHub.

## Что строим
- Единый Fullstack-монорепозиторий Next.js (App Router): сайт + TMA + админка.
- v2.0: собственный open-source скилл `@tensorlogix/ui-core` (MIT) + DEEP DARK лендинг +
  паблиш всего проекта на GitHub (`tensorlogix`) как Fullstack-шаблон.
- АННУЛИРОВАНО (решение #12): LIGHT MATRIX, мультиарендность, калькулятор v1, промо-баннер.

## Прогресс
- [x] ЭТАП 1: `src/lib/tensorlogix-ui/` — `BipyramidCore` (Canvas-3D удлинённая бипирамида,
  нейросвязи, hover-реакция скорости/свечения, prefers-reduced-motion), `NeonCTA`,
  `styles.css` (neon-glow, хром/сталь, лучи `tlx-beam`), README EN+RU, LICENSE MIT
- [x] ЭТАП 2: DEEP DARK тема (globals/layout); блок 0 хедер (лого + хромированный словознак,
  высота 5 строк); блок 1 Hero (неон-текст, пирамида, лучи к «Терминалу управления», CTA-скролл);
  блок 2 хаб (5 вкладок Framer Motion, копия боли/решение/этапы из ТЗ v2.0);
  блок 3 калькулятор v2 (3 шага чекбоксов, табло «от … ₽ / от … дн», BottomSheet в TMA-режиме);
  блок 4 подвал (форма [Имя, TG/Телефон, Детали] → POST /api/leads mock + console.log,
  оферта, контакты-заглушки)
- [x] Бэкенд v2: Prisma `Lead` (config Json, итоги, контакты) + удаление каркаса маркетплейса;
  Zod v2; telegram-уведомления v2; `Promotion`/`Setting` сохранены для CMS; `prisma generate` OK
- [x] Качество: `tsc --noEmit` чисто; `eslint src` чисто; контраст-патч (zinc-300/400);
  мобильный словознак исправлен (не обрезается на 390px); скриншоты + новый baseline
- [x] Память: control.md / SPECIFICATION.md / DESIGN.md / tasks переписаны под v2.0
- [x] Коммит `b03b587 feat(open-source): init tensorlogix-ui core and rebuild landing to deep-dark`
- [x] GH-1: паблиш на GitHub — https://github.com/kostyuk230378-cmd/tensorlogix (public, ветка `main`)
- [ ] От заказчика: Restore Supabase → `npx prisma db push`; TELEGRAM_BOT_TOKEN/CHAT_ID;
  растровый logo.png; реальные контакты владельца

## GitHub (ЭТАП 3) — ВЫПОЛНЕНО ✅
- Репозиторий: **https://github.com/kostyuk230378-cmd/tensorlogix** (public, default branch `main`).
- `gh` CLI 2.98.0 установлен (`C:\Program Files\GitHub CLI\gh.exe`), авторизован
  (аккаунт `kostyuk230378-cmd`, scopes: repo/gist/read:org, протокол https).
- Remote `origin` настроен, `main` трекает `origin/main`, коммит `b03b587` запушен.

## Ключевые решения
- #12 PIVOT v2.0 (24.08.2026): DEEP DARK CMS; open-source скилл MIT; калькулятор v2; паблиш.
- Impeccable-принятия: overused-font (Inter/Space Grotesk — стек .clinerules); часть
  low-contrast — захват во время enter-анимаций (статичный текст zinc-300 на #04060b ≥ 10:1).

## Следующие шаги
1. Аппрув заказчика: DEEP DARK лендинг v2 + публичный репозиторий.
2. ADM-1/ADM-2: CONTROL TERMINAL (CRM: статусы в клик, экспорт CSV/Excel; CMS: Settings/Promotions).
3. `(tma)` демонстратор; TMA-тема через @telegram-apps/sdk-react (установить перед тикетом).
4. От заказчика: Restore Supabase → `npx prisma db push`; TELEGRAM_BOT_TOKEN/CHAT_ID;
   растровый logo.png; реальные контакты владельца.
