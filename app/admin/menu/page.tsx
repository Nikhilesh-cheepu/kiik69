"use client";

import { useEffect, useState } from "react";

type MenuItemRow = {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string | null;
  image: string | null;
  menu_type: string;
  is_available: boolean;
};

const MENU_TYPES = [
  { value: "all", label: "All" },
  { value: "food", label: "Food" },
  { value: "liquor", label: "Liquor" },
] as const;

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<(typeof MENU_TYPES)[number]["value"]>(
    "all"
  );
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItemRow>>({
    menu_type: "food",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/menu");
      if (res.ok) {
        const json = await res.json();
        setItems(json);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleItems =
    filterType === "all"
      ? items
      : items.filter((i) => i.menu_type === filterType);

  async function saveItem(item: MenuItemRow) {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        image: item.image,
        menu_type: item.menu_type,
        is_available: item.is_available,
      }),
    });
    await load();
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    await load();
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category || !newItem.menu_type) {
      return;
    }
    await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setNewItem({ menu_type: newItem.menu_type || "food" });
    setCreating(false);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Menu items</h1>
          <p className="text-sm text-zinc-400">
            Food and liquor items as served at the venue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as (typeof MENU_TYPES)[number]["value"])
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100"
          >
            {MENU_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-100 hover:border-cyan-400/70 hover:text-cyan-100"
          >
            Add item
          </button>
        </div>
      </div>

      {creating && (
        <form
          onSubmit={createItem}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-4">
            <input
              placeholder="Name"
              value={newItem.name ?? ""}
              onChange={(e) =>
                setNewItem((ni) => ({ ...ni, name: e.target.value }))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
            />
            <input
              placeholder="Price"
              value={newItem.price ?? ""}
              onChange={(e) =>
                setNewItem((ni) => ({ ...ni, price: e.target.value }))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
            />
            <input
              placeholder="Category"
              value={newItem.category ?? ""}
              onChange={(e) =>
                setNewItem((ni) => ({ ...ni, category: e.target.value }))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
            />
            <select
              value={newItem.menu_type ?? "food"}
              onChange={(e) =>
                setNewItem((ni) => ({ ...ni, menu_type: e.target.value }))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
            >
              <option value="food">Food</option>
              <option value="liquor">Liquor</option>
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={newItem.description ?? ""}
            onChange={(e) =>
              setNewItem((ni) => ({ ...ni, description: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
          />
          <input
            placeholder="Image URL (optional)"
            value={newItem.image ?? ""}
            onChange={(e) =>
              setNewItem((ni) => ({ ...ni, image: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
          />
          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setNewItem({ menu_type: "food" });
              }}
              className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-cyan-500 px-4 py-1 text-white hover:bg-cyan-400"
            >
              Save item
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <table className="min-w-full text-left text-xs text-zinc-200">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Available</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-zinc-800/70 last:border-0"
              >
                <td className="px-3 py-2 align-top">
                  <input
                    value={item.name}
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === item.id ? { ...r, name: e.target.value } : r
                        )
                      )
                    }
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <select
                    value={item.menu_type}
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === item.id
                            ? { ...r, menu_type: e.target.value }
                            : r
                        )
                      )
                    }
                    className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
                  >
                    <option value="food">Food</option>
                    <option value="liquor">Liquor</option>
                  </select>
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    value={item.category}
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === item.id
                            ? { ...r, category: e.target.value }
                            : r
                        )
                      )
                    }
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    value={item.price}
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === item.id ? { ...r, price: e.target.value } : r
                        )
                      )
                    }
                    className="w-20 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <textarea
                    value={item.description ?? ""}
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === item.id
                            ? { ...r, description: e.target.value }
                            : r
                        )
                      )
                    }
                    rows={2}
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="checkbox"
                    checked={item.is_available}
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === item.id
                            ? { ...r, is_available: e.target.checked }
                            : r
                        )
                      )
                    }
                  />
                </td>
                <td className="px-3 py-2 align-top space-x-2 text-right">
                  <button
                    type="button"
                    onClick={() => saveItem(item)}
                    className="rounded-full bg-cyan-600 px-3 py-1 text-[11px] text-white hover:bg-cyan-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] text-red-400 hover:bg-zinc-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && visibleItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-4 text-center text-sm text-zinc-500"
                >
                  No items for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

