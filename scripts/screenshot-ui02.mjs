// Скриншоты стоп-точки UI-02: зона калькулятора (desktop + mobile + BottomSheet).
// Запуск: при поднятом дев-сервере `node scripts/screenshot-ui02.mjs`.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.env.SHOT_URL ?? "http://localhost:3000";
const outDir = process.env.SHOT_DIR ?? "screenshots";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

// Десктоп: хаб экосистемы + калькулятор с выбранной конфигурацией + sticky-смета
let page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle" });
await page.locator("#calculator").scrollIntoViewIfNeeded();
await page.getByRole("checkbox", { name: /Интернет-магазин/ }).first().click();
await page.getByRole("checkbox", { name: /ИИ-агента/ }).first().click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/ui02-desktop-calculator.png` });
console.log(`✓ ${outDir}/ui02-desktop-calculator.png`);
await page.close();

// Мобильный: шаги калькулятора + sticky-планка
page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle" });
await page.locator("#calculator").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/ui02-mobile-calculator.png` });
console.log(`✓ ${outDir}/ui02-mobile-calculator.png`);

// BottomSheet со сметой и промокодом
await page.getByRole("button", { name: "Смета", exact: true }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/ui02-mobile-sheet.png` });
console.log(`✓ ${outDir}/ui02-mobile-sheet.png`);
await page.close();

await browser.close();
