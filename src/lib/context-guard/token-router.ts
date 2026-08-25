/**
 * @tensorlogix/context-guard — MIT (c) 2026 TensorLogix.
 *
 * Локальный токен-роутер (интерцептор-прокси) Cline:
 *  - ведёт персистентный бюджет токенов текущей сессии разработки;
 *  - по порогу 1 000 000 токенов автоматически подменяет ID модели в теле
 *    запроса на оптимальную эконом-модель (УРОВЕНЬ 2);
 *  - содержит расширенную 4-уровневую иерархию всех доступных квот моделей.
 *
 * Это dev/CI-tooling: НЕ импортируется в код Next.js (нужен только как
 * локальный прокси между Cline и провайдером моделей). Запуск напрямую:
 *   node src/lib/context-guard/token-router.ts --status
 *   node src/lib/context-guard/token-router.ts --record 42000
 *   node src/lib/context-guard/token-router.ts --intercept '{"model":"deepseek-v4-pro-0813"}'
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/* ------------------------------------------------------------------ */
/* 4-уровневая иерархия моделей (квоты владельца)                      */
/* ------------------------------------------------------------------ */

export const DEFAULT_THRESHOLD = 1_000_000;
/** Грубая оценка: ~4 символа на токен (смесь латиницы/CJK). */
export const TOKENS_PER_CHAR = 4;

export const MODEL_TIERS = {
  1: {
    label: "УРОВЕНЬ 1 — Core (до 1M токенов)",
    role: "Тяжёлый бэкенд, WebGL и архитектура",
    models: ["deepseek-v4-pro-0813", "deepseek-v4-pro", "qwen3.7-max", "qwen-max", "qwen3-max"],
  },
  2: {
    label: "УРОВЕНЬ 2 — Эконом-роутинг (после 1M токенов)",
    role: "Базовая вёрстка и простые правки",
    models: [
      "deepseek-v4-flash",
      "deepseek-v4-flash-0731",
      "kimi-k3",
      "kimi-k2.7-code",
      "qwen3.7-plus",
      "qwen3.7-flash",
      "qwen3-coder-plus",
      "qwen3.6-plus",
      "glm-5.2",
      "glm-5.1",
    ],
  },
  3: {
    label: "УРОВЕНЬ 3 — Мультимодальный / Аналитический пул",
    role: "Анализ сложных логов и сквозное тестирование UI",
    models: ["qwq-plus", "qvq-max", "qwen3.5-omni-plus", "qwen3.5-omni-flash", "qwen-omni-turbo"],
  },
  4: {
    label: "УРОВЕНЬ 4 — Графический / Медиа-модуль",
    role: "Внешние эндпоинты ИИ-генерации баннеров селлерам",
    models: ["qwen-image-3.0-pro", "qwen-image-2.0-pro", "wan3.0-video", "happyhorse-1.1-i2v", "z-image-turbo"],
  },
} as const;

export type Tier = keyof typeof MODEL_TIERS; // 1 | 2 | 3 | 4
export const TIER_1_DEFAULT: string = MODEL_TIERS[1].models[0];
export const TIER_2_DEFAULT: string = MODEL_TIERS[2].models[0];

const TIER_BY_MODEL: Record<string, Tier> = {};
for (const tier of [1, 2, 3, 4] as const) {
  for (const model of MODEL_TIERS[tier].models) {
    TIER_BY_MODEL[model] = tier;
  }
}

/* ------------------------------------------------------------------ */
/* Бюджет токенов (персистентность на диск)                            */
/* ------------------------------------------------------------------ */

export interface Budget {
  used: number;
  threshold: number;
  updatedAt: string;
}

export const BUDGET_FILE = resolve(
  process.env.CONTEXT_GUARD_BUDGET_FILE ?? join(process.cwd(), ".cline", "token-budget.json"),
);

function readThreshold(unsafe?: unknown): number {
  const fromArg = Number(unsafe);
  if (Number.isFinite(fromArg) && fromArg > 0) return Math.floor(fromArg);
  const fromEnv = Number(process.env.CONTEXT_GUARD_THRESHOLD);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return Math.floor(fromEnv);
  return DEFAULT_THRESHOLD;
}

function defaultBudget(): Budget {
  return { used: 0, threshold: DEFAULT_THRESHOLD, updatedAt: new Date().toISOString() };
}

export function readBudget(): Budget {
  try {
    if (!existsSync(BUDGET_FILE)) return defaultBudget();
    const raw = JSON.parse(readFileSync(BUDGET_FILE, "utf8")) as Partial<Budget>;
    const used =
      Number.isFinite(Number(raw.used)) && Number(raw.used) > 0 ? Math.floor(Number(raw.used)) : 0;
    return {
      used,
      threshold: readThreshold(raw.threshold),
      updatedAt: raw.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return defaultBudget();
  }
}

export function writeBudget(budget: Budget): Budget {
  const next: Budget = { ...budget, updatedAt: new Date().toISOString() };
  mkdirSync(dirname(BUDGET_FILE), { recursive: true });
  writeFileSync(BUDGET_FILE, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return next;
}

export function recordTokens(n: number): Budget {
  const budget = readBudget();
  budget.used += Math.max(0, Math.floor(n));
  return writeBudget(budget);
}

export function resetBudget(): Budget {
  return writeBudget(defaultBudget());
}

export function estimateTokens(input: unknown): number {
  if (typeof input === "number" && Number.isFinite(input)) return Math.max(1, Math.ceil(input));
  if (input == null) return 0;
  if (typeof input === "string") return Math.max(0, Math.ceil(input.length / TOKENS_PER_CHAR));
  try {
    return Math.max(0, Math.ceil(JSON.stringify(input).length / TOKENS_PER_CHAR));
  } catch {
    return 0;
  }
}

/* ------------------------------------------------------------------ */
/* Роутер: выбор уровня и подмена модели                               */
/* ------------------------------------------------------------------ */

export function activeTier(budget: Budget = readBudget()): Tier {
  return budget.used >= budget.threshold ? 2 : 1;
}

export function modelTier(id: string): Tier | null {
  return TIER_BY_MODEL[id] ?? null;
}

export interface Resolution {
  model: string | null;
  downgraded: boolean;
  previous: string | null;
}

/**
 * По порогу эконом-уровень подменяет только Core-модели (УРОВЕНЬ 1).
 * Мультимодальные (УРОВЕНЬ 3) и медиа (УРОВЕНЬ 4) эндпоинты не трогаем.
 */
export function resolveModel(requested: string | null | undefined, budget?: Budget): Resolution {
  const current = budget ?? readBudget();
  const previous = typeof requested === "string" && requested.length > 0 ? requested : null;
  if (previous === null) return { model: null, downgraded: false, previous: null };
  if (activeTier(current) === 2 && modelTier(previous) === 1) {
    return { model: TIER_2_DEFAULT, downgraded: true, previous };
  }
  return { model: previous, downgraded: false, previous };
}

export function recommendModel(budget?: Budget): string {
  return activeTier(budget) === 1 ? TIER_1_DEFAULT : TIER_2_DEFAULT;
}

/* ------------------------------------------------------------------ */
/* Интерцептор-прокси: считает токены и правит тело запроса            */
/* ------------------------------------------------------------------ */

export interface ProxyResult extends Resolution {
  body: unknown;
  budget: Budget;
  consumedTokens: number;
}

function parseBody(body: unknown | string): unknown {
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return { raw: body };
  }
}

function readModel(body: unknown): string | null {
  if (body !== null && typeof body === "object" && "model" in body) {
    const model = (body as Record<string, unknown>).model;
    return typeof model === "string" ? model : null;
  }
  return null;
}

function writeModel(body: Record<string, unknown>, model: string): void {
  body.model = model;
  body._contextGuard = { downgraded: true, to: model };
}

export function proxy(body: unknown | string): ProxyResult {
  const parsed = parseBody(body);
  const consumedTokens = estimateTokens(parsed);
  const budget = recordTokens(consumedTokens);
  const previous = readModel(parsed);
  const resolution = resolveModel(previous, budget);
  if (resolution.downgraded && resolution.model !== null) {
    writeModel(parsed as Record<string, unknown>, resolution.model);
  }
  return { ...resolution, body: parsed, budget, consumedTokens };
}

/* ------------------------------------------------------------------ */
/* Статус и CLI                                                        */
/* ------------------------------------------------------------------ */

export function status(budget: Budget = readBudget()): string {
  const tier = activeTier(budget);
  const pct = budget.threshold > 0 ? ((budget.used / budget.threshold) * 100).toFixed(2) : "0.00";
  const lines: string[] = [
    "── TensorLogix context-guard / token-router ──",
    `Бюджет: ${budget.used.toLocaleString("ru-RU")} / ${budget.threshold.toLocaleString("ru-RU")} токенов (${pct}%)`,
    `Активный уровень: ${MODEL_TIERS[tier].label} — ${MODEL_TIERS[tier].role}`,
    `Рекомендуемая модель: ${recommendModel(budget)}`,
    `Файл бюджета: ${BUDGET_FILE}`,
  ];
  for (const t of [1, 2, 3, 4] as const) {
    lines.push(`${MODEL_TIERS[t].label} :: ${MODEL_TIERS[t].models.join(", ")}`);
  }
  return lines.join("\n");
}

const HELP = [
  "TensorLogix context-guard / token-router",
  "Использование: node src/lib/context-guard/token-router.ts <команда>",
  "  --status, -s         показать бюджет и активный уровень",
  "  --record <n>         начислить n токенов в бюджет сессии",
  "  --intercept <json>   прогнать тело запроса через прокси (счёт + подмена модели)",
  "  --reset              обнулить бюджет",
  "  --help, -h           эта справка",
].join("\n");

function runCli(argv: string[]): void {
  const [flag, value] = argv;
  switch (flag) {
    case undefined:
    case "--status":
    case "-s":
      console.log(status());
      return;
    case "--reset":
      console.log(status(resetBudget()));
      return;
    case "--record": {
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0) {
        console.error("Ошибка: --record требует неотрицательное число. Пример: --record 42000");
        process.exitCode = 1;
        return;
      }
      console.log(status(recordTokens(n)));
      return;
    }
    case "--intercept":
    case "--proxy": {
      const result = proxy(value ?? "");
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    default:
      console.error(`Неизвестная команда: ${flag}\n\n${HELP}`);
      process.exitCode = 1;
  }
}

const isMain =
  typeof process.argv[1] === "string" &&
  process.argv[1].length > 0 &&
  resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (isMain) runCli(process.argv.slice(2));