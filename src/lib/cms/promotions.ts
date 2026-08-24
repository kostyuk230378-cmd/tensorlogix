// CMS-слой промоакций (решение #10 от 24.08.2026, control.md §А/Б).
// Чтение активных акций: Supabase (Prisma) → mock-фолбэк, пока БД недоступна.
// Админка пишет в таблицу promotions напрямую (тикеты ADMIN); сайт только читает.

import { prisma } from "@/lib/prisma";

export interface PromotionDTO {
  id: string;
  title: string;
  description: string;
  discountPct: number;
  promoCode: string | null;
  startsAt: string | null;
  endsAt: string | null;
}

// Демо-акция mock-режима: показывает динамику (баннер + пересчёт ядра).
// Отключается переменной окружения MOCK_PROMO_DISABLED=true («акций нет → кнопка скрыта»).
const MOCK_PROMOTIONS: PromotionDTO[] = [
  {
    id: "mock-launch",
    title: "Стартовая акция: −10% на разработку под ключ",
    description:
      "До конца месяца — скидка 10% на любую конфигурацию смарт-калькулятора: сайт, Telegram Mini App, терминал управления и продвижение. Применяется автоматически или по промокоду.",
    discountPct: 10,
    promoCode: "MATRIX10",
    startsAt: null,
    endsAt: null,
  },
];

function isActiveNow(p: Pick<PromotionDTO, "startsAt" | "endsAt">, now = Date.now()): boolean {
  if (p.startsAt && new Date(p.startsAt).getTime() > now) return false;
  if (p.endsAt && new Date(p.endsAt).getTime() < now) return false;
  return true;
}

/** Активные акции: БД Supabase, при недоступности — mock-набор. */
export async function getActivePromotions(): Promise<{
  promotions: PromotionDTO[];
  mocked: boolean;
}> {
  if (process.env.MOCK_PROMO_DISABLED === "true") {
    return { promotions: [], mocked: true };
  }
  try {
    const rows = await prisma.promotion.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return {
      promotions: rows
        .filter((r) =>
          isActiveNow({
            startsAt: r.startsAt ? r.startsAt.toISOString() : null,
            endsAt: r.endsAt ? r.endsAt.toISOString() : null,
          })
        )
        .map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          discountPct: r.discountPct,
          promoCode: r.promoCode,
          startsAt: r.startsAt ? r.startsAt.toISOString() : null,
          endsAt: r.endsAt ? r.endsAt.toISOString() : null,
        })),
      mocked: false,
    };
  } catch (dbError) {
    console.error("[promotions][MOCK] БД недоступна — локальный набор акций:", dbError);
    return { promotions: MOCK_PROMOTIONS.filter(isActiveNow), mocked: true };
  }
}
