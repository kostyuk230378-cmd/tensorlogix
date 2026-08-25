# @tensorlogix/ui-core

**White-Label UI Core** — free, MIT-licensed interactive graphics skill by TensorLogix.
Бесплатный open-source скилл интерактивной графики от TensorLogix (лицензия MIT).

---

## EN — What is this?

A dependency-light React + Canvas toolkit for premium "deep dark" interfaces:

- **`<BipyramidCore />`** — a smoothly rotating, transparent, elongated 3D bipyramid
  (the TensorLogix logo mark) rendered on Canvas with glowing **neural connections**
  inside. It reacts to cursor hover: rotation speed and glow intensity increase
  as the pointer approaches. Pure math projection, zero 3D libraries,
  respects `prefers-reduced-motion`.
- **`<NeonCTA />`** — neon call-to-action button (Framer Motion micro-interactions,
  smooth anchor scrolling).
- **`styles.css`** — Tailwind-friendly utilities: `tlx-neon-green`, `tlx-neon-blue`,
  `tlx-chrome` (polished steel text), `tlx-panel` (chrome/steel terminal panel),
  `tlx-cta` (neon glow), `tlx-beam` (animated interface rays), `tlx-grid-bg`.

### Usage

```tsx
import { BipyramidCore, NeonCTA } from "@/lib/tensorlogix-ui";
import "@/lib/tensorlogix-ui/styles.css";

export function Hero() {
  return (
    <section className="relative bg-[#04060b]">
      <BipyramidCore className="h-[420px] w-full" />
      <NeonCTA label="Calculate project cost" target="calculator" />
    </section>
  );
}
```

### Requirements

- React 19+, Next.js 14+ (App Router) or any React bundler.
- `framer-motion` (only for `NeonCTA` micro-interactions).
- No WebGL/3D libraries required — the bipyramid is hand-rolled Canvas 2D projection.

### License

MIT — free for personal and commercial use. See [LICENSE](./LICENSE).

---

## RU — Что это?

Бесплатный скилл интерактивной графики для премиальных тёмных интерфейсов:

- **`<BipyramidCore />`** — плавно вращающаяся прозрачная удлинённая 3D-бипирамида
  (знак логотипа TensorLogix) со светящимися нейронными связями внутри.
  Реагирует на наведение курсора: растут скорость вращения и интенсивность
  неонового свечения. Чистая Canvas 2D-проекция без 3D-библиотек,
  уважает `prefers-reduced-motion`.
- **`<NeonCTA />`** — неоновая CTA-кнопка с микровзаимодействиями Framer Motion
  и плавным скроллом к якорю.
- **`styles.css`** — утилиты под Tailwind: неоновые свечения (зелёный/синий),
  хромированный текст, стальные панели терминала, анимированные лучи интерфейса.

### Использование

См. пример выше. Компоненты клиентские (`"use client"`), импортируются из
`@/lib/tensorlogix-ui` (или из папки скилла в вашем проекте).

### Требования

React 19+, Next.js 14+ (App Router) или любой React-бандлер; `framer-motion`
только для `NeonCTA`. WebGL/3D-библиотеки не нужны.

### Лицензия

MIT — бесплатно для личного и коммерческого использования. См. [LICENSE](./LICENSE).

---

(c) 2026 TensorLogix — https://github.com/ (репозиторий `tensorlogix`)
