"use client";

import { motion } from "framer-motion";
import { BipyramidCore, NeonCTA } from "@/lib/tensorlogix-ui";

/**
 * Блок 1 — сквозной Hero (ТЗ v2.0 §3): неоновый текст слева,
 * интерактивная 3D-пирамида с лучами к «Терминалу управления» справа.
 */
export function Hero() {
  return (
    <section className="tlx-grid-bg relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 pt-36 pb-16 sm:px-6 sm:pt-44 lg:grid-cols-2 lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="font-display text-3xl leading-tight font-bold sm:text-5xl">
          <span className="tlx-neon-green">TensorLogix:</span>{" "}
          <span className="text-zinc-100">
            Создаем умные сайты и Telegram Mini Apps с ИИ-логикой внутри
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-zinc-300 sm:text-lg">
          Хватит платить бешеные комиссии и штрафы маркетплейсам. Пора забирать своих
          клиентов и строить независимый, автоматизированный бизнес там, где им удобно.
        </p>
        <p className="tlx-neon-blue mt-6 font-display text-sm tracking-[0.22em] uppercase sm:text-base">
          [ Ваш бизнес. Ваша база данных. Ваши правила. ]
        </p>
        <div className="mt-10">
          <NeonCTA label="Рассчитать стоимость проекта" target="calculator" />
        </div>
      </motion.div>

      <div className="relative">
        <BipyramidCore className="h-[380px] w-full sm:h-[460px]" />
        {/* Интерфейсные лучи от граней пирамиды */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line x1="50" y1="46" x2="84" y2="76" className="tlx-beam" stroke="rgba(34,206,113,0.55)" strokeWidth="0.4" />
          <line x1="46" y1="52" x2="16" y2="78" className="tlx-beam" stroke="rgba(14,165,233,0.55)" strokeWidth="0.4" />
          <line x1="54" y1="40" x2="86" y2="20" className="tlx-beam" stroke="rgba(148,163,184,0.4)" strokeWidth="0.35" />
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="tlx-panel absolute right-2 bottom-2 w-44 rounded-xl p-3 sm:right-6 sm:bottom-6"
        >
          <p className="font-display text-[10px] tracking-[0.2em] text-zinc-300 uppercase">
            Терминал управления
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="h-1.5 rounded bg-[#22ce71]/50" />
            <div className="h-1.5 w-3/4 rounded bg-[#0ea5e9]/50" />
            <div className="h-1.5 w-1/2 rounded bg-zinc-500/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
