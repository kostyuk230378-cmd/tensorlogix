// Расчёт сметы калькулятора (ТЗ v1.0 §3: пересчёт итоговой стоимости и сроков
// в реальном времени).
//
// ⚠️ ВНИМАНИЕ: числовые значения ниже — ПЛЕЙСХОЛДЕРЫ архитектурного каркаса.
// Реальную ценовую сетку ДОЛЖЕН утвердить заказчик (тикеты CALC-PRICE в
// tasks/avtopilot-tickets.md). Не выводить в прод до подтверждения.

import {
  MARKETING_LABELS,
  MARKETING_OPTIONS,
  PAYMENT_GATEWAY_LABELS,
  SITE_TYPE_LABELS,
  TMA_PAYMENT_LABELS,
  showSiteIntegrations,
  showTmaIntegrations,
  type CalculatorState,
  type MarketingId,
  type PaymentGatewayId,
  type QuoteItem,
  type SiteTypeId,
  type TmaPaymentId,
} from "./types";

export interface PriceEntry {
  price: number; // ₽
  days: number; // дни
}

// Ценовая сетка УТВЕРЖДЕНА заказчиком 24.08.2026.
// Интеграции считаются единым пунктом за раздел: «Интеграция сайта (Платежи + Логистика)»,
// «Интеграция TMA (Платежи + СДЭК)» — независимо от числа выбранных подопций.
export const PRICE_BOOK: {
  siteType: Record<SiteTypeId, PriceEntry>;
  siteIntegrations: PriceEntry;
  tma: PriceEntry;
  tmaIntegrations: PriceEntry;
  adminPanel: PriceEntry;
  marketing: Record<MarketingId, PriceEntry>;
} = {
  siteType: {
    VISIT_CARD: { price: 15_000, days: 3 },
    LANDING: { price: 30_000, days: 5 },
    PRESENTATION: { price: 45_000, days: 7 },
    SHOP: { price: 80_000, days: 14 },
    MARKETPLACE: { price: 150_000, days: 30 },
  },
  siteIntegrations: { price: 20_000, days: 2 }, // Платежи + Логистика
  tma: { price: 40_000, days: 5 },
  tmaIntegrations: { price: 15_000, days: 2 }, // Платежи + СДЭК
  adminPanel: { price: 25_000, days: 4 }, // Терминал управления (Единая админка)
  marketing: {
    YANDEX: { price: 10_000, days: 3 },
    GOOGLE: { price: 10_000, days: 3 },
    TELEGRAM_ADS: { price: 10_000, days: 3 },
    SOCIAL: { price: 10_000, days: 3 },
  },
};

export interface Quote {
  totalPrice: number;
  totalDays: number;
  items: QuoteItem[];
}

export function calculateQuote(s: CalculatorState): Quote {
  const items: QuoteItem[] = [];

  const base = PRICE_BOOK.siteType[s.siteType];
  items.push({ item: `Сайт: ${SITE_TYPE_LABELS[s.siteType]}`, price: base.price, days: base.days });

  if (showSiteIntegrations(s)) {
    const parts: string[] = [];
    if (s.sitePayment) parts.push(`оплата ${PAYMENT_GATEWAY_LABELS[s.sitePayment]}`);
    if (s.siteLogistics) parts.push("логистика СДЭК");
    if (parts.length > 0) {
      items.push({
        item: `Интеграция сайта: ${parts.join(" + ")}`,
        ...PRICE_BOOK.siteIntegrations,
      });
    }
  }

  if (s.tmaEnabled) {
    items.push({ item: "Модуль Telegram Mini App", ...PRICE_BOOK.tma });
    if (showTmaIntegrations(s)) {
      const parts: string[] = [];
      if (s.tmaPayment) parts.push(`оплата ${TMA_PAYMENT_LABELS[s.tmaPayment]}`);
      if (s.tmaLogistics) parts.push("логистика СДЭК");
      if (parts.length > 0) {
        items.push({
          item: `Интеграция Mini App: ${parts.join(" + ")}`,
          ...PRICE_BOOK.tmaIntegrations,
        });
      }
    }
  }

  if (s.adminPanel) {
    items.push({ item: "Терминал управления (Единая админка)", ...PRICE_BOOK.adminPanel });
  }

  for (const id of MARKETING_OPTIONS) {
    if (s.marketing[id]) {
      items.push({ item: `Продвижение: ${MARKETING_LABELS[id]}`, ...PRICE_BOOK.marketing[id] });
    }
  }

  return {
    totalPrice: items.reduce((sum, i) => sum + i.price, 0),
    totalDays: items.reduce((sum, i) => sum + i.days, 0),
    items,
  };
}