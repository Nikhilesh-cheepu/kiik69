"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  section_key: string;
  sort_order: number;
  data: { text?: string };
  is_active: boolean;
};

export default function OfferBannerSectionEditor() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [newText, setNewText] = useState("");

  const sectionKey = "offer_banner";

  function load() {
    fetch(`/api/admin/section-items?sectionKey=${sectionKey}`)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setMessage({ type: "err", text: "Failed to load" }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function addItem() {
    const text = newText.trim();
    if (!text) return;
    setMessage(null);
    try {
      const res = await fetch("/api/admin/section-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_key: sectionKey,
          data: { text },
          sort_order: items.length,
        }),
      });
      if (!res.ok) throw new Error("Add failed");
      setNewText("");
      load();
      setMessage({ type: "ok", text: "Added" });
    } catch {
      setMessage({ type: "err", text: "Add failed" });
    }
  }

  async function updateItem(id: number, data: { text?: string; is_active?: boolean }) {
    setSavingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/section-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, data: { ...i.data, ...data }, is_active: data.is_active ?? i.is_active } : i
        )
      );
      setMessage({ type: "ok", text: "Updated" });
    } catch {
      setMessage({ type: "err", text: "Update failed" });
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this item?")) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/section-items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage({ type: "ok", text: "Deleted" });
    } catch {
      setMessage({ type: "err", text: "Delete failed" });
    }
  }

  if (loading) {
    return <p className="text-zinc-400">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Offer banner</h1>
      <p className="text-zinc-400 mb-6">Scrolling marquee items (create, edit, delete, reorder).</p>

      <div className="space-y-4 max-w-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="New offer text"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-[#ff003c] focus:outline-none focus:ring-1 focus:ring-[#ff003c]"
          />
          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-[#ff003c] px-4 py-2 font-medium text-white hover:bg-[#e60035]"
          >
            Add
          </button>
        </div>
        {message && (
          <p className={message.type === "ok" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </p>
        )}
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
            >
              <span className="text-zinc-500 w-6">{index + 1}</span>
              <input
                type="text"
                value={item.data?.text ?? ""}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((i) =>
                      i.id === item.id ? { ...i, data: { ...i.data, text: e.target.value } } : i
                    )
                  )
                }
                onBlur={() => {
                  const text = item.data?.text?.trim();
                  if (text !== undefined) updateItem(item.id, { text });
                }}
                disabled={savingId === item.id}
                className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-white disabled:opacity-50"
              />
              <label className="flex items-center gap-1.5 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={item.is_active}
                  onChange={(e) => updateItem(item.id, { is_active: e.target.checked })}
                  className="rounded border-zinc-600"
                />
                Active
              </label>
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="rounded px-2 py-1 text-sm text-red-400 hover:bg-zinc-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="text-zinc-500">No items yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
