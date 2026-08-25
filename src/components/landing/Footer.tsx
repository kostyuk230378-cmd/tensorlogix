"use client";

import { useState } from "react";
import { CONTACTS } from "@/lib/site-config";
import { quoteBus } from "@/lib/leads/quote-bus";

/** Блок 4 — сквозной подвал: CTA-форма → /api/leads (mock), оферта, контакты. */
export function Footer() {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const draft = quoteBus.get();
    const body = {
      products: draft?.products ?? [],
      addons: draft?.addons ?? [],
      marketing: draft?.marketing ?? [],
      totalPrice: draft?.quote.totalPrice ?? 0,
      totalDays: draft?.quote.totalDays ?? 0,
      contactName: name,
      contactChannel: channel,
      details: details || null,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#22ce71]/70";

  return (
    <footer id="contact" className="relative z-10 border-t border-zinc-800/80 bg-[#05080f]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            <span className="tlx-neon-blue">Обсудим</span> ваш проект?
          </h2>
          <p className="mt-4 max-w-md text-sm text-zinc-300">
            Оставьте контакты — архитектор TensorLogix свяжется с вами, уточнит детали
            и подготовит точную смету и ТЗ.
          </p>
          <div className="mt-8 space-y-2 text-sm">
            <a className="block text-zinc-300 hover:text-[#22ce71]" href={`tel:${CONTACTS.phoneHref}`}>
              {CONTACTS.phoneDisplay}
            </a>
            <a className="block text-zinc-300 hover:text-[#22ce71]" href={CONTACTS.telegramUrl}>
              t.me/{CONTACTS.telegramUsername}
            </a>
            <a className="block text-zinc-300 hover:text-[#22ce71]" href={`mailto:${CONTACTS.email}`}>
              {CONTACTS.email}
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="tlx-panel space-y-4 rounded-2xl p-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="[ Ваше имя ]"
            aria-label="Ваше имя"
            required
            className={inputCls}
          />
          <input
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="[ Telegram / Телефон ]"
            aria-label="Telegram или телефон"
            required
            className={inputCls}
          />
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="[ Детали задачи ]"
            aria-label="Детали задачи"
            rows={4}
            className={inputCls}
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="tlx-cta w-full rounded-xl border border-[#22ce71]/40 bg-gradient-to-r from-[#0a5a38]/70 to-[#0a2540]/70 px-6 py-3 font-display text-sm font-semibold tracking-wider text-emerald-100 uppercase transition-shadow disabled:opacity-60"
          >
            [ Обсудить проект с архитектором TensorLogix ]
          </button>
          {state === "done" ? (
            <p className="text-sm text-[#22ce71]">
              Заявка принята! Архитектор свяжется с вами в ближайшее время.
            </p>
          ) : null}
          {state === "error" ? (
            <p className="text-sm text-red-400">Не удалось отправить заявку. Попробуйте ещё раз.</p>
          ) : null}
        </form>
      </div>

      <div className="border-t border-zinc-800/80 px-4 py-6">
        <p className="mx-auto max-w-3xl text-xs text-zinc-500">
          Внимание: Расчет в калькуляторе является предварительным и не является публичной
          офертой. © 2026 TensorLogix. Open-source skill @tensorlogix/ui-core (MIT).
        </p>
      </div>
    </footer>
  );
}
