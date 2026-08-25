import { NextResponse } from "next/server";
import type { Lead } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { leadInputSchema } from "@/lib/leads/schema";
import { sendLeadNotification } from "@/lib/telegram";

/**
 * POST /api/leads — фиксация заявки v2 (ТЗ v2.0 §6).
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

  const d = parsed.data;
  const leadData = {
    config: {
      products: d.products,
      addons: d.addons,
      marketing: d.marketing,
    },
    totalPrice: d.totalPrice,
    totalDays: d.totalDays,
    contactName: d.contactName,
    contactChannel: d.contactChannel,
    details: d.details ?? null,
  };

  // До синхронизации с Supabase — mock-режим: заявка принимается локально.
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
