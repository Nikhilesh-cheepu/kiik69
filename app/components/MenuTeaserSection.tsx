"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import skyhyMenuData, { skyhyMenuData as dataSource } from "@/SKYHY_MENU_DATA";

type MenuModal = "food" | "liquor" | "128" | null;

const ROTATION_INTERVAL_MS = 1000;

function buildRotatingNames(): string[] {
  const food = dataSource.food.items.map((i) => i.name);
  const liquor = dataSource.liquor.items.map((i) => i.name);
  const menu128 = dataSource.eatAndDrink128.items.map((i) => i.name);
  const all: string[] = [];
  const maxLen = Math.max(food.length, liquor.length, menu128.length);
  for (let i = 0; i < maxLen; i++) {
    if (food[i]) all.push(food[i]);
    if (liquor[i]) all.push(liquor[i]);
    if (menu128[i]) all.push(menu128[i]);
  }
  return all.length > 0 ? all : ["Chicken 65", "Mojito", "Pepper Chicken"];
}

export default function MenuTeaserSection() {
  const [openModal, setOpenModal] = useState<MenuModal>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [rotateIndex, setRotateIndex] = useState(0);

  const rotatingNames = useMemo(() => buildRotatingNames(), []);

  useEffect(() => {
    if (rotatingNames.length === 0) return;
    const t = setInterval(() => {
      setRotateIndex((prev) => (prev + 1) % rotatingNames.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(t);
  }, [rotatingNames.length]);

  const foodItems = dataSource.food.items;
  const liquorItems = dataSource.liquor.items;
  const menu128Items = dataSource.eatAndDrink128.items;

  const addedCount = useMemo(
    () => Object.values(quantities).reduce((sum, q) => sum + q, 0),
    [quantities],
  );

  function adjustQty(name: string, delta: 1 | -1) {
    setQuantities((prev) => {
      const current = prev[name] ?? 0;
      const next = Math.max(0, current + delta);
      if (!next) {
        const { [name]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: next };
    });
  }

  return (
    <section className="relative w-full bg-gradient-to-b from-[#020617] via-[#020617] to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-4">
        {/* Heading */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
            Taste the menu
          </p>
          <h2 className="text-xl font-semibold tracking-[0.08em] text-white">
            Eat. Sip. Repeat.
          </h2>
        </div>

        {/* Three small menu cards */}
        <div className="flex gap-3">
          {[
            { id: "food", label: "Food Menu", sub: "Bites & mains" },
            { id: "liquor", label: "Drinks Menu", sub: "Spirits & cocktails" },
            { id: "128", label: "Eat & Drink @128", sub: "12 PM – 8 PM" },
          ].map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setOpenModal(card.id as MenuModal)}
              className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/90 px-3 py-2 text-left text-xs shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Menu
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {card.label}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400">{card.sub}</p>
            </button>
          ))}
        </div>

        {/* Animated changing menu item text */}
        <div className="relative min-h-[2.5rem] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={rotateIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 flex items-center justify-center text-center text-sm font-medium tracking-[0.04em] text-zinc-300"
            >
              {rotatingNames[rotateIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* View Menu & Pricing CTA */}
        <div className="flex justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:border-emerald-300 hover:bg-emerald-500/20 hover:text-white"
          >
            {addedCount > 0
              ? `View menu & pricing · ${addedCount}`
              : "View menu & pricing"}
          </Link>
        </div>
      </div>

      {/* Simple bottom-sheet popups */}
      <AnimatePresence>
        {openModal && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md max-h-[85vh] rounded-t-3xl border border-zinc-800 bg-zinc-950/98 pb-5 pt-3 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="mx-auto h-1 w-10 rounded-full bg-zinc-700/80" />
              <div className="mt-2 px-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {openModal === "food"
                        ? "Food menu"
                        : openModal === "liquor"
                        ? "Drinks menu"
                        : "Eat & Drink @128"}
                    </p>
                    {openModal === "128" && (
                      <p className="text-[10px] text-zinc-500">
                        12 PM – 8 PM · All items ₹128
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenModal(null)}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] text-zinc-300"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-[65vh] space-y-1.5 overflow-y-auto pr-1 text-[11px]">
                  {(openModal === "food"
                    ? foodItems
                    : openModal === "liquor"
                    ? liquorItems
                    : menu128Items
                  ).map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5"
                    >
                      <span className="truncate text-zinc-100">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-medium text-emerald-300">
                          ₹{openModal === "128" ? 128 : (item as any).price}
                        </span>
                        <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/5 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => adjustQty(item.name, -1)}
                            className="h-5 w-5 rounded-full bg-zinc-900 text-center text-[10px] text-emerald-200"
                          >
                            −
                          </button>
                          <span className="min-w-[1rem] text-center text-[11px] font-semibold text-emerald-100">
                            {quantities[item.name] ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustQty(item.name, 1)}
                            className="h-5 w-5 rounded-full bg-emerald-500 text-center text-[10px] text-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href =
                      openModal === "food"
                        ? "/menu?mode=food"
                        : openModal === "liquor"
                        ? "/menu?mode=liquor"
                        : "/menu?mode=128";
                  }}
                  className="mt-3 w-full rounded-full bg-emerald-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_14px_40px_rgba(16,185,129,0.85)]"
                >
                  {addedCount > 0
                    ? `Explore full menu · ${addedCount}`
                    : "Explore full menu & prices"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

