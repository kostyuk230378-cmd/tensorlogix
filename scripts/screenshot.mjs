// Playwright-скриншоты для регрессионных стоп-точек конвейера (.clinerules п.4).
// Запуск: сначала поднять дев-сервер (npm run dev), затем `node scripts/screenshot.mjs`.
// Эталонные снимки складываются в screenshots/baseline/.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.env.SHOT_URL ?? "http://localhost:3000";
const outDir = process.env.SHOT_DIR ?? "screenshots";

mkdirSync(outDir, { recursive: true });

const shots = [
  // Пропорции Telegram WebApp (iPhone 14)
  { name: "tma-mobile-390x844", width: 390, height: 844 },
  // Десктопная витрина
  { name: "desktop-1440x900", width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: 2,
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000); // прогрев шрифтов и цифрового дождя
  await page.screenshot({ path: `${outDir}/${s.name}.png` });
  console.log(`✓ ${outDir}/${s.name}.png (${s.width}x${s.height})`);
  await page.close();
}
await browser.close();