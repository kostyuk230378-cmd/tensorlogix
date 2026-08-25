"use client";

import { motion } from "framer-motion";

/**
 * @tensorlogix/ui-core — MIT.
 * Неоновая CTA-кнопка с плавным скроллом к якорю (framer-motion, без внешних зависимостей).
 */
export function NeonCTA({
  label,
  target,
  className,
}: {
  label: string;
  target: string;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() =>
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className={`tlx-cta rounded-xl border border-[#22ce71]/40 bg-gradient-to-r from-[#0a5a38]/70 to-[#0a2540]/70 px-6 py-3 font-display text-sm font-semibold tracking-wider text-emerald-100 uppercase transition-shadow ${className ?? ""}`}
    >
      [ {label} ]
    </motion.button>
  );
}
