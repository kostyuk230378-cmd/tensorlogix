"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  ADDONS,
  INITIAL_CALCULATOR_STATE,
  MARKETING,
  PRODUCTS,
  type AddonId,
  type MarketingId,
  type ProductId,
} from "@/lib/calculator/types";
import { calculateQuote, formatRub } from "@/lib/calculator/pricing";
import { quoteBus } from "@/lib/leads/quote-bus";
import { NeonCTA } from "@/lib/tensorlogix-ui";

/** Блок 3 — сквозной калькулятор v2 (ТЗ v2.0 §5): 3 шага, табло «от…», BottomSheet. */

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);
  return <>{display.toLocaleString("ru-RU")}</>;
}

function CheckCard({
  checked,
  onToggle,
  label,
  price,
  days,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  price: number;
  days: number;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
        checked
          ? "tlx-cta border-[#22ce71]/60 bg-[#22ce71]/10 text-zinc-100"
          : "tlx-steel-border bg-zinc-400/5 text-zinc-300 hover:border-zinc-500"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-zinc-400 tabular-nums">
          +{formatRub(price)} · +{days} дн
        </span>
        <span
          className={`flex size-5 items-center justify-center rounded-md border ${
            checked
              ? "border-[#22ce71] bg-[#22ce71]/20 text-[#22ce71]"
              : "border-zinc-600 text-transparent"
          }`}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </span>
    </button>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="font-display text-sm font-semibold text-zinc-500 tabular-nums">
        0{n}
      </span>
      <h3 className="font-display text-lg font-semibold text-zinc-100 sm:text-xl">{title}</h3>
    </div>
  );
}

export function Calculator() {
  const [state, setState] = useState(INITIAL_CALCULATOR_STATE);
  const [sheetOpen, setSheetOpen] = useState(false);

  const quote = useMemo(() => calculateQuote(state), [state]);

  const draft = useMemo(
    () => ({
      products: PRODUCTS.filter((p) => state.products[p.id]).map((p) => p.id),
      addons: ADDONS.filter((a) => state.addons[a.id]).map((a) => a.id),
      marketing: MARKETING.filter((m) => state.marketing[m.id]).map((m) => m.id),
      quote,
    }),
    [state, quote]
  );

  // Форма подвала забирает конфигурацию и смету при отправке заявки.
  useEffect(() => {
    quoteBus.set(draft);
  }, [draft]);

  const toggleProduct = (id: ProductId) =>
    setState((s) => ({ ...s, products: { ...s.products, [id]: !s.products[id] } }));
  const toggleAddon = (id: AddonId) =>
    setState((s) => ({ ...s, addons: { ...s.addons, [id]: !s.addons[id] } }));
  const toggleMarketing = (id: MarketingId) =>
    setState((s) => ({ ...s, marketing: { ...s.marketing, [id]: !s.marketing[id] } }));

  const board = (
    <div>
      <h4 className="font-display text-sm font-semibold tracking-wider text-zinc-400 uppercase">
        Смета
      </h4>
      <dl className="mt-4 space-y-2 text-sm">
        {quote.items.map((i) => (
          <div key={i.item} className="flex items-baseline justify-between gap-4">
            <dt className="text-zinc-300">{i.item}</dt>
            <dd className="whitespace-nowrap text-zinc-200 tabular-nums">{formatRub(i.price)}</dd>
          </div>
        ))}
      </dl>
      {quote.items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">
          Отметьте продукты — смета и сроки пересчитаются мгновенно.
        </p>
      ) : null}
      <div className="mt-6 border-t border-zinc-700/60 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-zinc-300">Стоимость</span>
          <span className="tlx-neon-green font-display text-2xl font-bold tabular-nums">
            от <AnimatedNumber value={quote.totalPrice} /> ₽
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-4 text-sm">
          <span className="text-zinc-300">Сроки</span>
          <span className="text-zinc-300 tabular-nums">
            от <AnimatedNumber value={quote.totalDays} /> дн
          </span>
        </div>
      </div>
      <div className="mt-6">
        <NeonCTA
          label="Получить точную смету и ТЗ проекта"
          target="contact"
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <section
      id="calculator"
      className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <h2 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
        <span className="tlx-neon-green">Интерактивный калькулятор</span> экосистемы
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-10">
          <div>
            <StepTitle n={1} title="Продукт" />
            <div className="grid gap-3 sm:grid-cols-2">
              {PRODUCTS.map((p) => (
                <CheckCard
                  key={p.id}
                  checked={state.products[p.id]}
                  onToggle={() => toggleProduct(p.id)}
                  label={p.label}
                  price={p.price}
                  days={p.days}
                />
              ))}
            </div>
          </div>

          <div>
            <StepTitle n={2} title="Управление и ИИ" />
            <div className="space-y-3">
              {ADDONS.map((a) => (
                <CheckCard
                  key={a.id}
                  checked={state.addons[a.id]}
                  onToggle={() => toggleAddon(a.id)}
                  label={a.label}
                  price={a.price}
                  days={a.days}
                />
              ))}
            </div>
          </div>

          <div>
            <StepTitle n={3} title="Маркетинг" />
            <div className="space-y-3">
              {MARKETING.map((m) => (
                <CheckCard
                  key={m.id}
                  checked={state.marketing[m.id]}
                  onToggle={() => toggleMarketing(m.id)}
                  label={m.label}
                  price={m.price}
                  days={m.days}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="tlx-panel sticky top-24 rounded-2xl p-6">{board}</div>
        </aside>
      </div>

      {/* Мобильный TMA-режим: sticky-планка + BottomSheet */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-[#04060b]/95 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-[11px] tracking-wider text-zinc-400 uppercase">Стоимость</p>
            <p className="tlx-neon-green font-display text-lg leading-tight font-bold tabular-nums">
              от <AnimatedNumber value={quote.totalPrice} /> ₽
              <span className="ml-2 text-xs font-medium text-zinc-400">
                от {quote.totalDays} дн
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(!sheetOpen)}
            className="rounded-xl border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200"
          >
            {sheetOpen ? "Скрыть" : "Смета"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sheetOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Закрыть смету"
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-label="Смета проекта"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[75dvh] overflow-y-auto rounded-t-2xl border-t border-zinc-700 bg-[#0a0f1a] p-5 pb-8 lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-700" />
              {board}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
