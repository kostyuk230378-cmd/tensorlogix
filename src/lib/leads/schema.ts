import { z } from "zod";
import {
  MARKETING_OPTIONS,
  PAYMENT_GATEWAYS,
  SITE_TYPES,
  TMA_PAYMENTS,
  isCommerceSite,
} from "@/lib/calculator/types";

export const quoteItemSchema = z.object({
  item: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  days: z.number().int().nonnegative(),
});

// Вход заявки: конфигурация калькулятора + маркетинг + смета + контакты.
// Бизнес-правила динамических блоков ТЗ §2 проверяются в superRefine.
export const leadInputSchema = z
  .object({
    // Блок 1
    siteType: z.enum(SITE_TYPES),
    // Блок 2 (только Магазин / Маркетплейс)
    sitePayment: z.enum(PAYMENT_GATEWAYS).nullish(),
    siteLogistics: z.boolean().default(false),
    // Блок 3
    tmaEnabled: z.boolean().default(false),
    // Блок 4 (только если TMA включён И Магазин/Маркетплейс)
    tmaPayment: z.enum(TMA_PAYMENTS).nullish(),
    tmaLogistics: z.boolean().default(false),
    // Блок 5
    adminPanel: z.boolean().default(false),
    // Маркетинг
    mktYandex: z.boolean().default(false),
    mktGoogle: z.boolean().default(false),
    mktTelegramAds: z.boolean().default(false),
    mktSocial: z.boolean().default(false),
    // Итоги и смета
    totalPrice: z.number().nonnegative(),
    totalDays: z.number().int().nonnegative(),
    quoteSnapshot: z.array(quoteItemSchema),
    // Контакты
    contactName: z.string().trim().min(1).max(100),
    contactPhone: z.string().trim().min(5).max(100),
    contactEmail: z.string().trim().email().max(200).nullish(),
  })
  .superRefine((v, ctx) => {
    const commerce = isCommerceSite(v.siteType);
    if (!commerce && (v.sitePayment ?? v.siteLogistics)) {
      ctx.addIssue({
        code: "custom",
        path: ["sitePayment"],
        message: "Интеграции сайта доступны только для Магазина или Большого маркетплейса",
      });
    }
    if (!v.tmaEnabled && (v.tmaPayment ?? v.tmaLogistics)) {
      ctx.addIssue({
        code: "custom",
        path: ["tmaPayment"],
        message: "Интеграции Mini App доступны только при включённом модуле TMA",
      });
    }
    if (v.tmaEnabled && !commerce && (v.tmaPayment ?? v.tmaLogistics)) {
      ctx.addIssue({
        code: "custom",
        path: ["tmaPayment"],
        message: "Интеграции Mini App доступны только для Магазина или Большого маркетплейса",
      });
    }
  });

export type LeadInput = z.infer<typeof leadInputSchema>;

// Маркетинг-флаги ↔ чекбоксы (для обратного отображения в CRM)
export const MARKETING_FLAG_KEYS = {
  YANDEX: "mktYandex",
  GOOGLE: "mktGoogle",
  TELEGRAM_ADS: "mktTelegramAds",
  SOCIAL: "mktSocial",
} as const satisfies Record<(typeof MARKETING_OPTIONS)[number], string>;