"use client";

import { motion } from "framer-motion";

/**
 * Монументальная надпись TensorLogix на всю ширину первого экрана (ТЗ раздел II.2).
 * Шрифт: Space Grotesk (строгий геометрический гротеск), увеличенный трекинг.
 * Хромированный градиент текста — в тон стальным дорожкам цифрового дождя.
 */
export function Hero() {
  return (
    <section className="relative z-10 flex min-h-dvh items-center justify-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-display select-none whitespace-nowrap text-center text-[10.5vw] leading-none font-bold tracking-widest text-zinc-800 uppercase"
      >
        TensorLogix
      </motion.h1>
    </section>
  );
}