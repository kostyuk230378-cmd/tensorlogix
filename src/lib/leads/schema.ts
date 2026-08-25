import { z } from "zod";
import { ADDONS, MARKETING, PRODUCTS } from "@/lib/calculator/types";

const productIds = PRODUCTS.map((p) => p.id) as [string, ...string[]];
const addonIds = ADDONS.map((a) => a.id) as [string, ...string[]];
const marketingIds = MARKETING.map((m) => m.id) as [string, ...string[]];

// Вход заявки v2 (ТЗ v2.0 §5–6): конфигурация калькулятора + смета + контакты.
export const leadInputSchema = z.object({
  products: z.array(z.enum(productIds)).default([]),
  addons: z.array(z.enum(addonIds)).default([]),
  marketing: z.array(z.enum(marketingIds)).default([]),
  totalPrice: z.number().nonnegative(),
  totalDays: z.number().int().nonnegative(),
  contactName: z.string().trim().min(1).max(100),
  contactChannel: z.string().trim().min(5).max(100), // Telegram / телефон
  details: z.string().trim().max(2000).nullish(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
