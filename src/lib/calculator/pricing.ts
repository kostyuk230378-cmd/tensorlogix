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

// ПЛЕЙСХОЛДЕРЫ — ждут утверждения заказчиком
export const PRICE_BOOK: {
  siteType: Record<SiteTypeId, PriceEntry>;
  sitePayment: Record<PaymentGatewayId, PriceEntry>;
  siteLogistics: PriceEntry;
  tma: PriceEntry;
  tmaPayment: Record<TmaPaymentId, PriceEntry>;
  tmaLogistics: PriceEntry;
  adminPanel: PriceEntry;
  marketing: Record<MarketingId, PriceEntry>;
} = {
  siteType: {
    VISIT_CARD: { price: 30_000, days: 5 },
    LANDING: { price: 60_000, days: 7 },
    PRESENTATION: { price: 90_000, days: 10 },
    SHOP: { price: 180_000, days: 21 },
    MARKETPLACE: { price: 450_000, days: 45 },
  },
  sitePayment: {
    YOOKASSA: { price: 25_000, days: 3 },
    TBANK: { price: 25_000, days: 3 },
  },
  siteLogistics: { price: 35_000, days: 5 }, // СДЭК
  tma: { price: 80_000, days: 14 },
  tmaPayment: {
    CARDS: { price: 20_000, days: 3 },
    TELEGRAM_STARS: { price: 15_000, days: 2 },
  },
  tmaLogistics: { price: 30_000, days: 4 }, // СДЭК
  adminPanel: { price: 60_000, days: 10 },
  marketing: {
    YANDEX: { price: 40_000, days: 7 },
    GOOGLE: { price: 40_000, days: 7 },
    TELEGRAM_ADS: { price: 35_000, days: 5 },
    SOCIAL: { price: 35_000, days: 7 },
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
    if (s.sitePayment) {
      const e = PRICE_BOOK.sitePayment[s.sitePayment];
      items.push({ item: `Оплата сайта: ${PAYMENT_GATEWAY_LABELS[s.sitePayment]}`, ...e });
    }
    if (s.siteLogistics) {
      items.push({ item: "Логистика сайта: СДЭК", ...PRICE_BOOK.siteLogistics });
    }
  }

  if (s.tmaEnabled) {
    items.push({ item: "Модуль Telegram Mini App", ...PRICE_BOOK.tma });
    if (showTmaIntegrations(s)) {
      if (s.tmaPayment) {
        const e = PRICE_BOOK.tmaPayment[s.tmaPayment];
        items.push({ item: `Оплата Mini App: ${TMA_PAYMENT_LABELS[s.tmaPayment]}`, ...e });
      }
      if (s.tmaLogistics) {
        items.push({ item: "Логистика Mini App: СДЭК", ...PRICE_BOOK.tmaLogistics });
      }
    }
  }

  if (s.adminPanel) {
    items.push({ item: "Модуль управления (Единая админка)", ...PRICE_BOOK.adminPanel });
  }

  for (const id of MARKETING_OPTIONS) {
    if (s.marketing[id]) {
      items.push({ item: `Маркетинг: ${MARKETING_LABELS[id]}`, ...PRICE_BOOK.marketing[id] });
    }
  }

  return {
    totalPrice: items.reduce((sum, i) => sum + i.price, 0),
    totalDays: items.reduce((sum, i) => sum + i.days, 0),
    items,
  };
}