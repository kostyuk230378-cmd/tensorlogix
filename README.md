This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Инструменты контроля качества

### 🔐 Защита от AI Slop — Impeccable

Локальный линтер для обнаружения и устранения типовых паттернов AI-генерации (excessive Tailwind, glassmorphism, purple gradients). **59 детерминистических правил**: AI slop + design quality + accessibility + performance.

**Установка (требует Node.js 22.12+):**
```bash
npx impeccable install
```

**Использование:**
```bash
npm run impeccable          # сканировать src/
npm run impeccable:json     # JSON-вывод для CI

# Напрямую
npx impeccable detect src/              # директория
npx impeccable detect index.html        # файл
npx impeccable detect https://example.com  # URL (Puppeteer)
```

**Инициализация в AI-агенте:** `/impeccable init` (создаст `.impeccable/config.json` и `DESIGN.md`)

Документация: https://impeccable.style • Репозиторий: https://github.com/pbakaus/impeccable

### 📦 Сжатие длинного вывода — Headroom (локальный скрипт)

PowerShell-скрипт для защиты контекста от выгорания при длительной разработке:

```bash
npm run build | powershell -File scripts/headroom.ps1
npm run lint  | powershell -File scripts/headroom.ps1 -MaxLines 100
npx jest      | powershell -File scripts/headroom.ps1 -Head 50 -Tail 30
```

Параметры: `-MaxLines` (по умолчанию 200), `-MaxChars` (10 000), `-Head` (100), `-Tail` (50).

> Это собственная утилита проекта (не npm-пакет), создана в рамках Stage 1 PIVOT v3.0.
