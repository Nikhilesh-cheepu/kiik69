"use client";

import { useMemo, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string | null;
  menu_type: "food" | "liquor";
};

type Props = {
  items: MenuItem[];
};

type CartItem = {
  item: MenuItem;
  quantity: number;
};

const TYPE_FILTERS: { value: "all" | "food" | "liquor"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "food", label: "Food" },
  { value: "liquor", label: "Drinks" },
];

export default function MenuClient({ items }: Props) {
  const [typeFilter, setTypeFilter] =
    useState<(typeof TYPE_FILTERS)[number]["value"]>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [cart, setCart] = useState<Record<number, CartItem>>({});

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.category));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filteredItems = items.filter((i) => {
    if (typeFilter !== "all" && i.menu_type !== typeFilter) return false;
    if (categoryFilter !== "All" && i.category !== categoryFilter) return false;
    return true;
  });

  const total = Object.values(cart).reduce((sum, { item, quantity }) => {
    const p = Number(item.price);
    if (Number.isNaN(p)) return sum;
    return sum + p * quantity;
  }, 0);

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

  function clearCart() {
    setCart({});
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
      <div className="flex-1">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full bg-zinc-900/80 p-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={`px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] ${
                  typeFilter === f.value
                    ? "rounded-full bg-white text-black"
                    : "text-zinc-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredItems.map((item) => {
            const inCart = cart[item.id]?.quantity ?? 0;
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                        {item.category}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#ff003c]">
                      ₹{item.price}
                    </p>
                  </div>
                  {item.description && (
                    <p className="mt-2 text-xs text-zinc-400">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  {inCart > 0 ? (
                    <div className="inline-flex items-center rounded-full bg-zinc-950/80 px-2 py-1 text-xs text-zinc-100">
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, -1)}
                        className="px-2 text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="px-2">{inCart}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, 1)}
                        className="px-2 text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <p className="text-sm text-zinc-500">
              No items for this filter. Try a different category or type.
            </p>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950/90 p-4 lg:sticky lg:top-16">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Your order
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Add items from the menu to calculate the total.
        </p>
        <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
          {Object.values(cart).map(({ item, quantity }) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <p className="truncate text-zinc-100">{item.name}</p>
                <p className="text-[11px] text-zinc-500">
                  ₹{item.price} × {quantity}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeQty(item.id, -1)}
                  className="h-6 w-6 rounded-full bg-zinc-800 text-[13px]"
                >
                  −
                </button>
                <span className="w-5 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => changeQty(item.id, 1)}
                  className="h-6 w-6 rounded-full bg-zinc-100 text-[13px] text-black"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          {Object.keys(cart).length === 0 && (
            <p className="text-xs text-zinc-500">
              No items yet. Tap “Add” on any dish or drink.
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Total
          </span>
          <span className="text-lg font-semibold text-white">
            ₹{total.toFixed(0)}
          </span>
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-full bg-[#ff003c] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          disabled={Object.keys(cart).length === 0}
          onClick={clearCart}
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}

