"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  menuType: "food" | "liquor";
  tags?: string[];
};

type Props = {
  items: MenuItem[];
};

type CartItem = {
  item: MenuItem;
  quantity: number;
};

type MainMode = "all" | "carte" | "128";

const MAIN_MODES: { id: MainMode; label: string }[] = [
  { id: "all", label: "All" },
  { id: "carte", label: "À La Carte" },
  { id: "128", label: "128 Menu" },
];

const CARTE_SUB = [
  { id: "food", label: "Food" },
  { id: "liquor", label: "Liquor" },
] as const;

const MENU128_SUB = [
  { id: "128 · Drinks", label: "Drinks" },
  { id: "128 · Cocktails", label: "Cocktails" },
  { id: "128 · Mocktails", label: "Mocktails" },
  { id: "128 · Food Veg & Egg", label: "Veg" },
  { id: "128 · Food Non-Veg", label: "Non-Veg" },
] as const;

/** Palette: emerald, amber, rose, blue, violet, cyan, teal, orange */
const CATEGORY_COLORS = [
  { bg: "bg-emerald-500/20", fill: "bg-emerald-500", border: "border-emerald-400/60", text: "text-emerald-300" },
  { bg: "bg-amber-500/20", fill: "bg-amber-500", border: "border-amber-400/60", text: "text-amber-300" },
  { bg: "bg-rose-500/20", fill: "bg-rose-500", border: "border-rose-400/60", text: "text-rose-300" },
  { bg: "bg-blue-500/20", fill: "bg-blue-500", border: "border-blue-400/60", text: "text-blue-300" },
  { bg: "bg-violet-500/20", fill: "bg-violet-500", border: "border-violet-400/60", text: "text-violet-300" },
  { bg: "bg-cyan-500/20", fill: "bg-cyan-500", border: "border-cyan-400/60", text: "text-cyan-300" },
  { bg: "bg-teal-500/20", fill: "bg-teal-500", border: "border-teal-400/60", text: "text-teal-300" },
  { bg: "bg-orange-500/20", fill: "bg-orange-500", border: "border-orange-400/60", text: "text-orange-300" },
] as const;

function getCategoryColor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = ((hash << 5) - hash) + category.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[idx];
}

const MAIN_MODE_COLORS: Record<MainMode, { bg: string; border: string; text: string }> = {
  all: { bg: "bg-zinc-500/15", border: "border-zinc-400/50", text: "text-zinc-200" },
  carte: { bg: "bg-emerald-500/20", border: "border-emerald-400/60", text: "text-emerald-300" },
  "128": { bg: "bg-amber-500/20", border: "border-amber-400/60", text: "text-amber-300" },
};

const CARTE_SUB_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  food: { bg: "bg-emerald-500/20", border: "border-emerald-400/60", text: "text-emerald-300" },
  liquor: { bg: "bg-blue-500/20", border: "border-blue-400/60", text: "text-blue-300" },
};

const MENU128_SUB_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "128 · Drinks": { bg: "bg-blue-500/20", border: "border-blue-400/60", text: "text-blue-300" },
  "128 · Cocktails": { bg: "bg-rose-500/20", border: "border-rose-400/60", text: "text-rose-300" },
  "128 · Mocktails": { bg: "bg-violet-500/20", border: "border-violet-400/60", text: "text-violet-300" },
  "128 · Food Veg & Egg": { bg: "bg-emerald-500/20", border: "border-emerald-400/60", text: "text-emerald-300" },
  "128 · Food Non-Veg": { bg: "bg-amber-500/20", border: "border-amber-400/60", text: "text-amber-300" },
};

function isVeg(item: MenuItem) {
  const n = item.name.toLowerCase();
  const nonVegMarkers = [
    "chicken",
    "fish",
    "prawn",
    "egg",
    "mutton",
    "keema",
    "lamb",
    "beef",
    "pork",
    "bacon",
  ];
  return !nonVegMarkers.some((m) => n.includes(m));
}

export default function FullMenuClient({ items }: Props) {
  const searchParams = useSearchParams();
  const [mainMode, setMainMode] = useState<MainMode>("all");
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [sectionCategory, setSectionCategory] = useState<string | null>(null);

  useEffect(() => {
    const mode = searchParams?.get("mode");
    if (mode === "food" || mode === "liquor") {
      setMainMode("carte");
      setSubFilter(mode);
    } else if (mode === "128") {
      setMainMode("128");
      setSubFilter(null);
    }
  }, [searchParams]);

  useEffect(() => {
    // Reset inner category filter when top-level mode changes
    setSectionCategory(null);
  }, [mainMode, subFilter]);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const filteredByMain = useMemo(() => {
    if (mainMode === "all") return items;
    if (mainMode === "carte") {
      return items.filter((i) => !i.tags?.includes("128"));
    }
    return items.filter((i) => i.tags?.includes("128"));
  }, [items, mainMode]);

  const fullyFilteredItems = useMemo(() => {
    let list = filteredByMain;

    if (subFilter) {
      if (subFilter === "food") {
        list = list.filter((i) => i.menuType === "food");
      } else if (subFilter === "liquor") {
        list = list.filter((i) => i.menuType === "liquor");
      } else {
        list = list.filter((i) => i.category === subFilter);
      }
    }

    if (sectionCategory) {
      list = list.filter((i) => i.category === sectionCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [filteredByMain, subFilter, sectionCategory, search]);

  const sectionCategories = useMemo(() => {
    if (mainMode !== "carte" || !subFilter) return [] as string[];
    const targetType = subFilter === "liquor" ? "liquor" : "food";
    const set = new Set<string>();
    filteredByMain.forEach((i) => {
      if (i.menuType === targetType && i.category && !i.category.startsWith("128 ·")) {
        set.add(i.category);
      }
    });
    return Array.from(set).sort();
  }, [filteredByMain, mainMode, subFilter]);

  const total = Object.values(cart).reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );
  const itemCount = Object.values(cart).reduce(
    (sum, { quantity }) => sum + quantity,
    0
  );

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev[item.id];
      const quantity = (existing?.quantity ?? 0) + 1;
      return { ...prev, [item.id]: { item, quantity } };
    });
  }

  function changeQty(id: number, delta: number) {
    setCart((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...existing, quantity: nextQty } };
    });
  }

  const subFilters =
    mainMode === "carte" ? CARTE_SUB : mainMode === "128" ? MENU128_SUB : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 pb-20">
      {/* Header – center aligned, nice spacing */}
      <header className="space-y-1 text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
          SkyHy Live Sports Brewery
        </p>
        <h1 className="text-lg font-semibold tracking-[0.06em] text-white sm:text-xl">
          Menu
        </h1>
      </header>

      {/* Compact search – center constrained, above filters */}
      <div className="mx-auto w-full max-w-sm">
        <input
          type="text"
          placeholder="Search dish or drink…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-[13px] text-white placeholder:text-zinc-500 text-center sm:text-left"
        />
      </div>

      {/* Main mode row – center aligned */}
      <div className="flex justify-center gap-2 overflow-x-auto px-1">
        {MAIN_MODES.map((m) => {
          const c = MAIN_MODE_COLORS[m.id];
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMainMode(m.id);
                setSubFilter(null);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                mainMode === m.id
                  ? `${c.bg} ${c.text} border ${c.border}`
                  : "border border-zinc-700 bg-zinc-900/80 text-zinc-400"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Sub filters – center aligned, scrollable */}
      {subFilters && (
        <div className="flex justify-center gap-2 overflow-x-auto px-1">
          {subFilters.map((s) => {
            const c =
              mainMode === "carte"
                ? CARTE_SUB_COLORS[s.id]
                : MENU128_SUB_COLORS[s.id];
            const isActive = subFilter === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  setSubFilter((prev) => (prev === s.id ? null : s.id))
                }
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  isActive && c
                    ? `${c.bg} ${c.text} border ${c.border}`
                    : "border border-zinc-800 bg-zinc-900/60 text-zinc-500"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Inner section filters – center aligned, different color per category */}
      {sectionCategories.length > 0 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-1">
          {sectionCategories.map((cat) => {
            const c = getCategoryColor(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setSectionCategory((prev) => (prev === cat ? null : cat))
                }
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                  sectionCategory === cat
                    ? `${c.bg} ${c.text} border ${c.border}`
                    : "border border-zinc-800 bg-zinc-900/60 text-zinc-400"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* 2-column grid – neutral cards, even rows */}
      <div
        className="grid grid-cols-2 gap-2 sm:gap-2.5"
        style={{ gridAutoRows: "1fr" }}
      >
        {fullyFilteredItems.map((item) => {
          const qty = cart[item.id]?.quantity ?? 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            >
              <div className="min-h-0 flex-1">
                <div className="flex items-start gap-1">
                  {item.menuType === "food" && (
                    <span
                      className="mt-0.5 shrink-0 inline-flex h-3 w-3 items-center justify-center rounded-[2px] border border-emerald-500/80 text-[7px] text-emerald-300"
                      aria-label="Veg"
                    >
                      V
                    </span>
                  )}
                  <p className="line-clamp-2 text-[12px] font-semibold leading-tight text-white">
                    {item.name}
                  </p>
                </div>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-500">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="mt-1.5 flex h-8 items-center justify-between gap-1">
                <span className="text-[13px] font-semibold text-emerald-400">
                  ₹{item.price}
                </span>
                {qty > 0 ? (
                  <div className="flex items-center gap-0.5 rounded-full bg-zinc-900 px-0.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => changeQty(item.id, -1)}
                      className="h-5 w-5 rounded-full bg-zinc-800 text-[11px] leading-none text-zinc-200"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-[11px]">{qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(item.id, 1)}
                      className="h-5 w-5 rounded-full bg-emerald-500 text-[11px] leading-none text-black"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="rounded-full border border-emerald-500/60 bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300"
                  >
                    + Add
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {fullyFilteredItems.length === 0 && (
        <p className="py-4 text-center text-[13px] text-zinc-500">
          No items match. Try another filter or search.
        </p>
      )}

      {/* Sticky cart bar – compact */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
          >
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="mx-auto flex w-full max-w-md items-center justify-between rounded-full border border-emerald-500/50 bg-zinc-950/95 px-4 py-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.8)]"
            >
              <span className="text-[13px] font-medium text-white">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <span className="text-[13px] font-semibold text-emerald-400">
                ₹{total.toFixed(0)}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                View Cart
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md rounded-t-2xl border border-zinc-800 bg-zinc-950/98 pb-6 pt-3 shadow-[0_-16px 48px rgba(0,0,0,0.9)]"
            >
              <div className="mx-auto h-1 w-8 rounded-full bg-zinc-700/80" />
              <div className="mt-2 px-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Your cart
                    </p>
                    <p className="text-[13px] font-medium text-zinc-200">
                      {itemCount} item{itemCount !== 1 ? "s" : ""} · ₹
                      {total.toFixed(0)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] text-zinc-300"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto pr-1">
                  {Object.values(cart).map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-[12px]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-zinc-100">{item.name}</p>
                        <p className="text-[10px] text-zinc-500">
                          ₹{item.price} × {quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, -1)}
                          className="h-6 w-6 rounded-full bg-zinc-800 text-[12px] text-zinc-200"
                        >
                          −
                        </button>
                        <span className="w-5 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, 1)}
                          className="h-6 w-6 rounded-full bg-emerald-500 text-[12px] text-black"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-full bg-emerald-500 py-2 text-[11px] font-semibold uppercase tracking-wider text-black"
                >
                  Proceed to checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
