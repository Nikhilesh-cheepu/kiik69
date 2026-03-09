"use client";

import { useEffect, useState } from "react";

type PartyPackageRow = {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  includes: string | null;
  image_url: string | null;
  is_available: boolean;
};

export default function AdminPartyPackagesPage() {
  const [rows, setRows] = useState<PartyPackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Partial<PartyPackageRow>>({});

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/party-packages");
      if (res.ok) {
        const json = await res.json();
        setRows(json);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(row: PartyPackageRow) {
    await fetch(`/api/admin/party-packages/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: row.name,
        description: row.description,
        price: row.price,
        includes: row.includes,
        image_url: row.image_url,
        is_available: row.is_available,
      }),
    });
    await load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/admin/party-packages/${id}`, { method: "DELETE" });
    await load();
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name || !draft.price) return;
    await fetch("/api/admin/party-packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft({});
    setCreating(false);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Party packages</h1>
          <p className="text-sm text-zinc-400">
            Packages used on the Party Packages page and in marketing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-100 hover:border-cyan-400/70 hover:text-cyan-100"
        >
          Add package
        </button>
      </div>

      {creating && (
        <form
          onSubmit={create}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              placeholder="Name"
              value={draft.name ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
            />
            <input
              placeholder="Price"
              value={draft.price ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, price: e.target.value }))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
            />
            <input
              placeholder="Image URL (optional)"
              value={draft.image_url ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, image_url: e.target.value }))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
            />
          </div>
          <textarea
            placeholder="Description"
            value={draft.description ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, description: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
          />
          <textarea
            placeholder="Includes / features (plain text list)"
            value={draft.includes ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, includes: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
          />
          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setDraft({});
              }}
              className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-cyan-600 px-4 py-1 text-white hover:bg-cyan-500"
            >
              Save package
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <table className="min-w-full text-left text-xs text-zinc-200">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Includes</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-800/70 last:border-0"
              >
                <td className="px-3 py-2 align-top">
                  <input
                    value={row.name}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) =>
                          r.id === row.id ? { ...r, name: e.target.value } : r
                        )
                      )
                    }
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    value={row.price ?? ""}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) =>
                          r.id === row.id ? { ...r, price: e.target.value } : r
                        )
                      )
                    }
                    className="w-20 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <textarea
                    value={row.description ?? ""}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) =>
                          r.id === row.id
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
                  <textarea
                    value={row.includes ?? ""}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) =>
                          r.id === row.id
                            ? { ...r, includes: e.target.value }
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
                    checked={row.is_available}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) =>
                          r.id === row.id
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
                    onClick={() => save(row)}
                    className="rounded-full bg-cyan-600 px-3 py-1 text-[11px] text-white hover:bg-cyan-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] text-red-400 hover:bg-zinc-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-4 text-center text-sm text-zinc-500"
                >
                  No party packages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

