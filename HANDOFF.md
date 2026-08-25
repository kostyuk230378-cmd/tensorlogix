# HANDOFF — TensorLogix / NEXTJS_TMA_MALL_V10_1 (PIVOT v2.0)

> Обновлено: 24.08.2026 — PIVOT v2.0: DEEP DARK + open-source скилл @tensorlogix/ui-core (MIT);
> лендинг пересобран (блоки 0–4); коммит `feat(open-source): …` в работе.

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
- [ ] Коммит `feat(open-source): init tensorlogix-ui core and rebuild landing to deep-dark`
- [ ] GH-1: паблиш на GitHub (см. ниже)
- [ ] От заказчика: Restore Supabase → `npx prisma db push`; TELEGRAM_BOT_TOKEN/CHAT_ID;
  растровый logo.png; реальные контакты владельца

## GitHub (ЭТАП 3) — инструкция
`gh` CLI в системе НЕ установлен, remote не настроен. Варианты:
1. `winget install GitHub.cli` → `gh auth login` →
   `gh repo create tensorlogix --public --source=. --push`
2. Или в VS Code: Command Palette → «Git: Publish to GitHub» (использует встроенную авторизацию),
   затем в терминале: `git push -u origin master`.

## Ключевые решения
- #12 PIVOT v2.0 (24.08.2026): DEEP DARK CMS; open-source скилл MIT; калькулятор v2; паблиш.
- Impeccable-принятия: overused-font (Inter/Space Grotesk — стек .clinerules); часть
  low-contrast — захват во время enter-анимаций (статичный текст zinc-300 на #04060b ≥ 10:1).

## Следующие шаги
1. Коммит feat(open-source) + GH-1 паблиш.
2. ADM-1/ADM-2: CONTROL TERMINAL (CRM: статусы в клик, экспорт CSV/Excel; CMS: Settings/Promotions).
3. `(tma)` демонстратор; TMA-тема через @telegram-apps/sdk-react (установить перед тикетом).
