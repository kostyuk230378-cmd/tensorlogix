# СЕРВИСНЫЙ ПУЛЬТ УПРАВЛЕНИЯ КОНВЕЙЕРОМ

Текущая задача: NEXTJS_TMA_MALL_V10_1 → PIVOT v2.0 (24.08.2026)
Текущий статус: АВТОПИЛОТ
Концепция: **DEEP DARK CMS** + open-source скилл `@tensorlogix/ui-core` (MIT).
АННУЛИРОВАНО 24.08.2026: LIGHT MATRIX, мультиарендность, старый калькулятор (UI-02), промо-баннер.
Паблиш: публичный GitHub-репозиторий `tensorlogix` — весь проект как Fullstack-шаблон.

## ЭТАП 1 — White-Label UI Core (`src/lib/tensorlogix-ui/`, MIT)
- Canvas-компонент `BipyramidCore`: вращающаяся прозрачная удлинённая бипирамида
  (3D-знак логотипа) со светящимися нейронными связями; реакция на курсор
  (скорость/интенсивность); prefers-reduced-motion.
- Утилиты `styles.css`: neon-glow (зелёный/синий), хром/сталь, лучи `tlx-beam`.
- `NeonCTA` — Framer Motion без лишних зависимостей. README (EN+RU) + LICENSE MIT.

## ЭТАП 2 — DEEP DARK лендинг (блоки 0–4)
- Блок 0 Хедер: оригинальный логотип (высота = 5 строк базового текста ≈ 80px desktop)
  + встык словознак «TensorLogix» (Space Grotesk) той же высоты.
- Блок 1 Hero: слева неоновые заголовок/подзаголовок/слоган
  «[ Ваш бизнес. Ваша база данных. Ваши правила. ]»; справа пирамида + лучи к
  «Терминалу управления»; CTA «[ Рассчитать стоимость проекта ]» → скролл к калькулятору.
- Блок 2 Хаб экосистемы: 5 вкладок Framer Motion (Pain/Solution/Stages, копия в SPECIFICATION.md):
  TELEGRAM MINI APPS · WEB ECOSYSTEMS · CONTROL TERMINAL · INTELLIGENT AUTOMATION · DIGITAL SMM.
- Блок 3 Калькулятор v2: шаг 1 продукты (TMA 40к / сайт 30к / магазин 80к, чекбоксы);
  шаг 2 управление и ИИ (терминал +25к / ИИ-агент +30к / CRM-синхронизация +15к);
  шаг 3 маркетинг (SMM +15к / трафик +10к); табло «от X ₽ / от Y дн» на лету;
  CTA «[ Получить точную смету и ТЗ проекта ]» → подвал; BottomSheet в TMA-режиме.
- Блок 4 Подвал: форма [Имя, Telegram/Телефон, Детали задачи] → POST /api/leads
  (mock до Supabase) + console.log-уведомления; оферта и контакты владельца в силе.

## ЭТАП 3 — GitHub
- `gh` CLI в системе НЕТ: репозиторий создаётся пользователем (VS Code «Publish to
  GitHub» или `winget install GitHub.cli` + `gh auth login`), затем пуш из терминала.
- Команды зафиксированы в HANDOFF.md.

## Сохраняемые правила (админка будущего, продукт CONTROL TERMINAL)
- CRM: статусы лидов «Новый/В работе/Завершен» в один клик; экспорт CSV/Excel в один клик.
- CMS: цены/акции → таблицы `Settings`/`Promotions` (Supabase, Prisma).
