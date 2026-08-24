import { NextResponse } from "next/server";
import { getActivePromotions } from "@/lib/cms/promotions";

// Акции меняются из админки в любой момент — кэширование запрещено.
export const dynamic = "force-dynamic";

/**
 * GET /api/promotions — активные скидки/акции/промокоды (CMS, решение #10).
 * Используется: промо-баннер Hero/Header, страница /promotions,
 * математическое ядро калькулятора (пересчёт сметы на лету).
 */
export async function GET() {
  const { promotions, mocked } = await getActivePromotions();
  return NextResponse.json({ ok: true, promotions, mocked });
}
