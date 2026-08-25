// Клиентская шина: калькулятор v2 публикует текущую конфигурацию и смету,
// форма подвала (блок 4) забирает их в заявку при отправке.

import type { Quote } from "@/lib/calculator/pricing";
import type { AddonId, MarketingId, ProductId } from "@/lib/calculator/types";

export interface LeadDraft {
  products: ProductId[];
  addons: AddonId[];
  marketing: MarketingId[];
  quote: Quote;
}

let current: LeadDraft | null = null;

export const quoteBus = {
  set(draft: LeadDraft) {
    current = draft;
  },
  get(): LeadDraft | null {
    return current;
  },
};
