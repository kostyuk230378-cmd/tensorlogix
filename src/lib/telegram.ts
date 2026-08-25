import type { Lead } from "@/generated/prisma/client";
import {
  ADDONS,
  MARKETING,
  PRODUCTS,
} from "@/lib/calculator/types";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Мгновенное уведомление администратора о новом лиде (ТЗ v2.0 §6).
 * Токен и чат: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID в .env.
 */
export async function sendLeadNotification(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const text = formatLeadMessage(lead);

  // Mock-режим: пока .env не заполнен — уведомление логируется в консоль.
  if (!token || !chatId) {
    console.log(
      `[telegram][MOCK] Уведомление о лиде ${lead.id}:\n${text.replace(/<[^>]+>/g, "")}`
    );
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    throw new Error(`Telegram API ${res.status}: ${await res.text()}`);
  }
}

function formatLeadMessage(lead: Lead): string {
  const cfg = (lead.config ?? {}) as {
    products?: string[];
    addons?: string[];
    marketing?: string[];
  };
  const labelOf = (arr: readonly { id: string; label: string }[], id: string) =>
    arr.find((x) => x.id === id)?.label ?? id;

  const lines: string[] = ["🔔 <b>Новая заявка TensorLogix</b>", ""];

  if (cfg.products?.length) {
    lines.push("<b>Продукты:</b>");
    for (const id of cfg.products) lines.push(`• ${esc(labelOf(PRODUCTS, id))}`);
  }
  if (cfg.addons?.length) {
    lines.push("<b>Управление и ИИ:</b>");
    for (const id of cfg.addons) lines.push(`• ${esc(labelOf(ADDONS, id))}`);
  }
  if (cfg.marketing?.length) {
    lines.push("<b>Маркетинг:</b>");
    for (const id of cfg.marketing) lines.push(`• ${esc(labelOf(MARKETING, id))}`);
  }
  if (!cfg.products?.length && !cfg.addons?.length && !cfg.marketing?.length) {
    lines.push("<b>Конфигурация:</b> без калькулятора (свободная заявка)");
  }

  lines.push(
    "",
    `<b>Итого: ${Number(lead.totalPrice).toLocaleString("ru-RU")} ₽ / от ${lead.totalDays} дн.</b>`,
    "",
    "<b>Контакты:</b>",
    `Имя: ${esc(lead.contactName)}`,
    `Telegram/телефон: ${esc(lead.contactChannel)}`,
    lead.details ? `Детали: ${esc(lead.details)}` : "Детали: —",
    "",
    `ID заявки: ${lead.id}`
  );

  return lines.join("\n");
}
