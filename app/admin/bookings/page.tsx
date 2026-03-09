"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  name: string | null;
  phone: string | null;
  party_size: number | null;
  date: string | null;
  time: string | null;
  message: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = ["new", "confirmed", "cancelled"] as const;

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
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

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Bookings</h1>
        <p className="text-sm text-zinc-400">
          View and manage table bookings from the website.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <table className="min-w-full text-left text-xs text-zinc-200">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Guest</th>
              <th className="px-3 py-2">Party</th>
              <th className="px-3 py-2">Slot</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr
                key={b.id}
                className="border-b border-zinc-800/70 last:border-0"
              >
                <td className="px-3 py-2 text-zinc-500">
                  {new Date(b.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-xs">
                    {b.name ?? "Unknown"}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">
                    {b.phone}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {b.party_size ? `${b.party_size} guests` : "—"}
                </td>
                <td className="px-3 py-2">
                  {b.date || b.time ? `${b.date ?? ""} ${b.time ?? ""}` : "—"}
                </td>
                <td className="px-3 py-2 text-[11px] text-zinc-400">
                  {b.source ?? "website"}
                </td>
                <td className="px-3 py-2">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-100"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-[11px] text-zinc-400">
                  {b.message ?? "—"}
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-4 text-center text-sm text-zinc-500"
                >
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

