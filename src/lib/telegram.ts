import type { Lead } from "@/generated/prisma/client";
import {
  MARKETING_LABELS,
  PAYMENT_GATEWAY_LABELS,
  SITE_TYPE_LABELS,
  TMA_PAYMENT_LABELS,
  type MarketingId,
  type PaymentGatewayId,
  type QuoteItem,
  type SiteTypeId,
  type TmaPaymentId,
} from "@/lib/calculator/types";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Мгновенное уведомление администратора о новом лиде (ТЗ раздел 6).
 * Токен и чат берутся из .env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
 */
export async function sendLeadNotification(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const text = formatLeadMessage(lead);

  // Mock-режим (решение заказчика от 24.08.2026): пока .env не заполнен,
  // уведомление логируется в консоль вместо отправки в Telegram Bot API.
  if (!token || !chatId) {
    console.log(
      `[telegram][MOCK] Уведомление о лиде ${lead.id}:\n${text.replace(/<[^>]+>/g, "")}`
    );
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  if (!res.ok) {
    throw new Error(`Telegram API ${res.status}: ${await res.text()}`);
  }
}

function formatLeadMessage(lead: Lead): string {
  const items = Array.isArray(lead.quoteSnapshot)
    ? (lead.quoteSnapshot as unknown as QuoteItem[])
    : [];

  const marketing: MarketingId[] = [];
  if (lead.mktYandex) marketing.push("YANDEX");
  if (lead.mktGoogle) marketing.push("GOOGLE");
  if (lead.mktTelegramAds) marketing.push("TELEGRAM_ADS");
  if (lead.mktSocial) marketing.push("SOCIAL");

  const lines: string[] = [
    "🔔 <b>Новая заявка TensorLogix</b>",
    "",
    `<b>Сайт:</b> ${SITE_TYPE_LABELS[lead.siteType as SiteTypeId]}`,
  ];

  if (lead.sitePayment) {
    lines.push(`<b>Оплата сайта:</b> ${PAYMENT_GATEWAY_LABELS[lead.sitePayment as PaymentGatewayId]}`);
  }
  if (lead.siteLogistics) lines.push("<b>Логистика сайта:</b> СДЭК");
  lines.push(`<b>Mini App:</b> ${lead.tmaEnabled ? "нужен" : "не нужен"}`);
  if (lead.tmaPayment) {
    lines.push(`<b>Оплата Mini App:</b> ${TMA_PAYMENT_LABELS[lead.tmaPayment as TmaPaymentId]}`);
  }
  if (lead.tmaLogistics) lines.push("<b>Логистика Mini App:</b> СДЭК");
  lines.push(`<b>Админка:</b> ${lead.adminPanel ? "нужна" : "не нужна"}`);
  if (marketing.length > 0) {
    lines.push(`<b>Маркетинг:</b> ${marketing.map((m) => MARKETING_LABELS[m]).join(", ")}`);
  }

  lines.push("", "<b>Смета:</b>");
  for (const i of items) {
    lines.push(`• ${esc(i.item)} — ${i.price.toLocaleString("ru-RU")} ₽, ${i.days} дн.`);
  }
  lines.push(
    `<b>Итого: ${Number(lead.totalPrice).toLocaleString("ru-RU")} ₽ / ${lead.totalDays} дн.`
  );

  lines.push(
    "",
    "<b>Контакты:</b>",
    `Имя: ${esc(lead.contactName)}`,
    `Телефон/ТГ: ${esc(lead.contactPhone)}`,
    lead.contactEmail ? `Email: ${esc(lead.contactEmail)}` : "Email: —",
    "",
    `ID заявки: ${lead.id}`
  );

  return lines.join("\n");
}