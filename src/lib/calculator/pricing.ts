// Математическое ядро калькулятора v2 (ТЗ v2.0 §5): пересчёт на лету.

import {
  ADDONS,
  MARKETING,
  PRODUCTS,
  type CalculatorState,
} from "./types";

export interface QuoteItem {
  item: string;
  price: number;
  days: number;
}

export interface Quote {
  totalPrice: number;
  totalDays: number;
  items: QuoteItem[];
}

export function calculateQuote(s: CalculatorState): Quote {
  const items: QuoteItem[] = [];
  for (const p of PRODUCTS) {
    if (s.products[p.id]) items.push({ item: p.label, price: p.price, days: p.days });
  }
  for (const a of ADDONS) {
    if (s.addons[a.id]) items.push({ item: a.label, price: a.price, days: a.days });
  }
  for (const m of MARKETING) {
    if (s.marketing[m.id]) items.push({ item: m.label, price: m.price, days: m.days });
  }
  return {
    totalPrice: items.reduce((sum, i) => sum + i.price, 0),
    totalDays: items.reduce((sum, i) => sum + i.days, 0),
    items,
  };
}

export function formatRub(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}
