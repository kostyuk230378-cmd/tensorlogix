import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadInputSchema } from "@/lib/leads/schema";
import { sendLeadNotification } from "@/lib/telegram";

/**
 * POST /api/leads — фиксация заявки со смарт-калькулятора (ТЗ раздел 6).
 * Валидация Zod → намертво в таблицу leads → мгновенное уведомление в Telegram.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Ошибка валидации заявки", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const data = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        siteType: data.siteType,
        sitePayment: data.sitePayment ?? null,
        siteLogistics: data.siteLogistics,
        tmaEnabled: data.tmaEnabled,
        tmaPayment: data.tmaPayment ?? null,
        tmaLogistics: data.tmaLogistics,
        adminPanel: data.adminPanel,
        mktYandex: data.mktYandex,
        mktGoogle: data.mktGoogle,
        mktTelegramAds: data.mktTelegramAds,
        mktSocial: data.mktSocial,
        totalPrice: data.totalPrice,
        totalDays: data.totalDays,
        quoteSnapshot: data.quoteSnapshot,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail ?? null,
      },
    });

    // Уведомление не должно ронять сохранение лида
    try {
      await sendLeadNotification(lead);
    } catch (notifyError) {
      console.error("[leads] Ошибка Telegram-уведомления:", notifyError);
    }

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (dbError) {
    console.error("[leads] Ошибка записи в БД:", dbError);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить заявку. Попробуйте позже." },
      { status: 500 }
    );
  }
}