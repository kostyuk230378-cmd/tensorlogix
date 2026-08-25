"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Блок 2 — Интерактивный Хаб Экосистемы (ТЗ v2.0 §4): 5 вкладок, боли/решение/этапы. */

interface HubTab {
  id: string;
  title: string;
  pain: string;
  solution: string;
  stages: string;
}

const TABS: HubTab[] = [
  {
    id: "tma",
    title: "Telegram Mini Apps",
    pain: "Клиенты уходят со статических сайтов, мобильные приложения из App Store стоят космос, а Apple и Google постоянно их блокируют. Селлеры теряют прямой контакт с аудиторией.",
    solution: "Полноценный нативный магазин прямо внутри мессенджера Telegram. Мгновенный запуск в 1 клик, авторизация по Telegram ID, встроенная корзина, идеальный UI/UX и нативная оплата.",
    stages: "Проектирование путей пользователя (UX) → Разработка интерфейса на Framer Motion → Интеграция с Telegram WebApp API → Финальное тестирование.",
  },
  {
    id: "web",
    title: "Web Ecosystems",
    pain: "Стандартные конструкторы сайтов (Tilda/Wix) сильно ограничены по функциям, не выдерживают нагрузок при масштабировании бизнеса и не умеют гибко работать со сложными базами данных.",
    solution: "Высокотехнологичные Fullstack-системы на Next.js 14+ и TypeScript. Идеальное SEO для Яндекса и Google, неограниченная масштабируемость, молниеносная скорость загрузки и полная автономность на вашем собственном сервере.",
    stages: "Разработка технического задания → Верстка премиального UI на Tailwind CSS → Программирование серверной логики Next.js → Подключение к облачной инфраструктуре.",
  },
  {
    id: "terminal",
    title: "Control Terminal",
    pain: "Управление сайтом в одном месте, ботом в другом, а складом в третьем. Хаос в заказах, ручной перенос данных в Excel и постоянная потеря лидов.",
    solution: "Единая, замкнутая панель управления (Админка) для всей вашей цифровой экосистемы. Управление контентом сайта, карточками товаров Mini App, остатками на складах и CRM-таблицей лидов из одной точки.",
    stages: "Проектирование архитектуры базы данных PostgreSQL → Разработка интерфейса админки → Настройка ролей доступа и безопасности → Подключение Drag-and-Drop модулей.",
  },
  {
    id: "ai",
    title: "Intelligent Automation",
    pain: "Менеджеры не успевают отвечать на заявки, рутинные операции сжигают время, а интеграция со СДЭК или банками превращается в технический кошмар.",
    solution: "Внедрение кастомных ИИ-агентов на базе Qwen/OpenAI и жесткая автоматизация бэкэнда. Интеграция по API со СДЭК (авторасчет доставки и генерация накладных), шлюзами оплаты (ЮKassa/Т-Банк) и моментальными уведомлениями.",
    stages: "Анализ бизнес-процессов компании → Программирование API-интеграций (СДЭК/Эквайринг) → Разработка и обучение ИИ-агентов → Настройка сквозных вебхуков.",
  },
  {
    id: "smm",
    title: "Digital SMM",
    pain: "Крутой сайт и бот бесполезны, если на них нет целевого трафика. Деньги сливаются на неэффективную рекламу, а сеошники месяцами кормят обещаниями.",
    solution: "Комплексное продвижение и упаковка вашего бренда. Настройка конвертящего трафика в Яндекс.Директ, профессиональное SEO-продвижение, таргетированная реклама и выстраивание воронки продаж под Mini App.",
    stages: "Аудит конкурентов и целевой аудитории → Семантическое проектирование и SEO-оптимизация → Запуск и ведение рекламных кампаний → Аналитика конверсий и оптимизация ROI.",
  },
];

export function EcosystemHub() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section id="ecosystem" className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
        <span className="tlx-neon-blue">Интерактивный хаб</span> экосистемы
      </h2>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Экосистема TensorLogix">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`relative rounded-lg px-4 py-2 font-display text-xs font-semibold tracking-wider uppercase transition-colors sm:text-sm ${
              i === active ? "text-emerald-200" : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {i === active ? (
              <motion.span
                layoutId="hub-tab"
                className="tlx-steel-border absolute inset-0 rounded-lg bg-zinc-400/10"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="relative">{t.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="tlx-panel mt-6 grid gap-6 rounded-2xl p-6 sm:p-8 lg:grid-cols-3"
        >
          <div>
            <h3 className="font-display text-xs tracking-[0.2em] text-red-300 uppercase">
              Боли
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{tab.pain}</p>
          </div>
          <div>
            <h3 className="tlx-neon-green font-display text-xs tracking-[0.2em] uppercase">
              Решение
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{tab.solution}</p>
          </div>
          <div>
            <h3 className="font-display text-xs tracking-[0.2em] text-sky-300 uppercase">
              Этапы
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{tab.stages}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
