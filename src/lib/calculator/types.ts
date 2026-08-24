// Доменные типы смарт-калькулятора (ТЗ v1.0, разделы 2–3).
// Константы значений зеркалят enum'ы prisma/schema.prisma — менять синхронно.

export const SITE_TYPES = [
  "VISIT_CARD",
  "LANDING",
  "PRESENTATION",
  "SHOP",
  "MARKETPLACE",
] as const;
export type SiteTypeId = (typeof SITE_TYPES)[number];

export const SITE_TYPE_LABELS: Record<SiteTypeId, string> = {
  VISIT_CARD: "Визитка",
  LANDING: "Лендинг",
  PRESENTATION: "Презентационный сайт",
  SHOP: "Магазин",
  MARKETPLACE: "Большой маркетплейс",
};

// Платёжные шлюзы сайта (блок 2)
export const PAYMENT_GATEWAYS = ["YOOKASSA", "TBANK"] as const;
export type PaymentGatewayId = (typeof PAYMENT_GATEWAYS)[number];
export const PAYMENT_GATEWAY_LABELS: Record<PaymentGatewayId, string> = {
  YOOKASSA: "ЮKassa",
  TBANK: "Т-Банк",
};

// Способы оплаты в Mini App (блок 4)
export const TMA_PAYMENTS = ["CARDS", "TELEGRAM_STARS"] as const;
export type TmaPaymentId = (typeof TMA_PAYMENTS)[number];
export const TMA_PAYMENT_LABELS: Record<TmaPaymentId, string> = {
  CARDS: "Карты",
  TELEGRAM_STARS: "Telegram Stars",
};

// Модуль интернет-маркетинга (раздел 3 ТЗ)
export const MARKETING_OPTIONS = ["YANDEX", "GOOGLE", "TELEGRAM_ADS", "SOCIAL"] as const;
export type MarketingId = (typeof MARKETING_OPTIONS)[number];
export const MARKETING_LABELS: Record<MarketingId, string> = {
  YANDEX: "Яндекс (Директ, Поиск)",
  GOOGLE: "Google (SEO)",
  TELEGRAM_ADS: "Реклама в Telegram",
  SOCIAL: "Продвижение в соцсетях",
};

export interface QuoteItem {
  item: string;
  price: number;
  days: number;
}

// Полное состояние конфигуратора (общий React State калькулятора и симулятора)
export interface CalculatorState {
  siteType: SiteTypeId;
  sitePayment: PaymentGatewayId | null;
  siteLogistics: boolean;
  tmaEnabled: boolean;
  tmaPayment: TmaPaymentId | null;
  tmaLogistics: boolean;
  adminPanel: boolean;
  marketing: Record<MarketingId, boolean>;
}

// Бизнес-правила динамических блоков (ТЗ §2)
export const isCommerceSite = (t: SiteTypeId): boolean => t === "SHOP" || t === "MARKETPLACE";
export const showSiteIntegrations = (s: CalculatorState): boolean => isCommerceSite(s.siteType);
export const showTmaIntegrations = (s: CalculatorState): boolean =>
  s.tmaEnabled && isCommerceSite(s.siteType);