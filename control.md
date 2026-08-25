# СЕРВИСНЫЙ ПУЛЬТ УПРАВЛЕНИЯ КОНВЕЙЕРОМ

Текущая задача: NEXTJS_TMA_MALL_V10_1 → PIVOT v3.0 (24.08.2026, DeepSeek-v4-Pro)
Текущий статус: АВТОПИЛОТ
Концепция: **DEEP DARK CMS** + собственный open-source скилл `@tensorlogix/ui-core` (MIT).
АННУЛИРОВАНО 24.08.2026: LIGHT MATRIX, мультиарендность, сторонние платные пакеты, промо-баннер, старый калькулятор.
Защита контекста: `.clineignore` + `src/lib/context-guard/token-router.ts` (4-уровневый роутер моделей, порог 1M).
Паблиш: публичный GitHub-репозиторий `tensorlogix` — весь проект как Fullstack-шаблон.

## ЭТАП 0 — Защита контекста и токен-роутер (context-guard, MIT)
- `.clineignore` (корень): `node_modules/`, `.next/`, `dist/`, `build/`, `*.log`, `.git/`, `screenshots/`.
- Жёсткий регламент headroom (`.clinerules` §0): длинные логи → `headroom compress` до попадания в контекст.
- `src/lib/context-guard/token-router.ts` — локальный прокси/интерцептор: персистентный бюджет токенов
  сессии (`.cline/token-budget.json`), порог **1 000 000** → автоподмена модели на эконом-уровень.
- 4-уровневая иерархия моделей (квоты владельца):
  - УРОВЕНЬ 1 Core: `deepseek-v4-pro-0813` · `deepseek-v4-pro` · `qwen3.7-max` · `qwen-max` · `qwen3-max`
  - УРОВЕНЬ 2 Эконом: `deepseek-v4-flash` · `deepseek-v4-flash-0731` · `kimi-k3` · `kimi-k2.7-code` ·
    `qwen3.7-plus` · `qwen3.7-flash` · `qwen3-coder-plus` · `qwen3.6-plus` · `glm-5.2` · `glm-5.1`
  - УРОВЕНЬ 3 Мультимодал/Аналитика: `qwq-plus` · `qvq-max` · `qwen3.5-omni-plus` · `qwen3.5-omni-flash` · `qwen-omni-turbo`
  - УРОВЕНЬ 4 Медиа: `qwen-image-3.0-pro` · `qwen-image-2.0-pro` · `wan3.0-video` · `happyhorse-1.1-i2v` · `z-image-turbo`

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
