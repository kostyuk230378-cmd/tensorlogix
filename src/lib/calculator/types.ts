// Доменные типы калькулятора v2 (ТЗ v2.0 §5, PIVOT от 24.08.2026).

export const PRODUCTS = [
  { id: "TMA", label: "Telegram Mini App", price: 40_000, days: 5 },
  { id: "SITE", label: "Корпоративный сайт / Лендинг", price: 30_000, days: 5 },
  { id: "SHOP", label: "Интернет-магазин", price: 80_000, days: 14 },
] as const;
export type ProductId = (typeof PRODUCTS)[number]["id"];

export const ADDONS = [
  {
    id: "TERMINAL",
    label: "Интеграция Терминала автономного управления",
    price: 25_000,
    days: 4,
  },
  { id: "AI_AGENT", label: "Внедрение ИИ-агента", price: 30_000, days: 6 },
  { id: "CRM_SYNC", label: "Синхронизация с CRM и внешними БД", price: 15_000, days: 3 },
] as const;
export type AddonId = (typeof ADDONS)[number]["id"];

export const MARKETING = [
  { id: "SMM", label: "Комплексный SMM и упаковка", price: 15_000, days: 3 },
  { id: "ADS", label: "Настройка рекламного трафика", price: 10_000, days: 2 },
] as const;
export type MarketingId = (typeof MARKETING)[number]["id"];

export interface CalculatorState {
  products: Record<ProductId, boolean>;
  addons: Record<AddonId, boolean>;
  marketing: Record<MarketingId, boolean>;
}

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  products: { TMA: false, SITE: false, SHOP: false },
  addons: { TERMINAL: false, AI_AGENT: false, CRM_SYNC: false },
  marketing: { SMM: false, ADS: false },
};
