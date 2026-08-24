import { NextResponse } from "next/server";
import type { Lead } from "@/generated/prisma/client";
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

  const leadData = {
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
  };

  // До синхронизации с Supabase (БД пока недоступна) — локальный mock-режим:
  // при ошибке записи заявка считается принятой и логируется (решение 24.08.2026).
  let lead: Lead;
  let mocked = false;
  try {
    lead = await prisma.lead.create({ data: leadData });
  } catch (dbError) {
    console.error("[leads][MOCK] БД недоступна — заявка принята локально:", dbError);
    mocked = true;
    lead = {
      ...leadData,
      id: crypto.randomUUID(),
      status: "NEW",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Lead;
  }

  // Уведомление не должно ронять сохранение лида
  try {
    await sendLeadNotification(lead);
  } catch (notifyError) {
    console.error("[leads] Ошибка Telegram-уведомления:", notifyError);
  }

  return NextResponse.json({ ok: true, id: lead.id, mocked }, { status: 201 });
}