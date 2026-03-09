"use client";

import { useEffect, useState } from "react";

type Totals = {
  callClicks: number;
  whatsappClicks: number;
  bookingCtaClicks: number;
  bookingSubmissions: number;
  packagesExploreClicks: number;
};

type EventRow = {
  id: number;
  event_type: string;
  page: string | null;
  section: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export default function AdminAnalyticsPage() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [recent, setRecent] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const json = await res.json();
          setTotals(json.totals);
          setRecent(json.recent);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-xl font-semibold text-white">Analytics</h1>
        <p className="text-xs text-zinc-400">
          High-level engagement across key actions – calls, WhatsApp, bookings, and CTAs.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          label="Call clicks"
          value={totals?.callClicks ?? 0}
          loading={loading}
        />
        <MetricCard
          label="WhatsApp clicks"
          value={totals?.whatsappClicks ?? 0}
          loading={loading}
        />
        <MetricCard
          label="Booking CTA clicks"
          value={totals?.bookingCtaClicks ?? 0}
          loading={loading}
        />
        <MetricCard
          label="Booking submissions"
          value={totals?.bookingSubmissions ?? 0}
          loading={loading}
        />
        <MetricCard
          label="Packages explore clicks"
          value={totals?.packagesExploreClicks ?? 0}
          loading={loading}
        />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Recent events</h2>
          <span className="text-xs text-zinc-500">
            Last {recent.length || 0} events
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Event</th>
                <th className="py-2 pr-4">Page</th>
                <th className="py-2 pr-4">Section</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-b border-zinc-900/60 last:border-0">
                  <td className="py-2 pr-4 text-zinc-500">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">{row.event_type}</td>
                  <td className="py-2 pr-4">{row.page ?? "–"}</td>
                  <td className="py-2 pr-4">{row.section ?? "–"}</td>
                </tr>
              ))}
              {!loading && recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-zinc-500">
                    No events tracked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.7)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">
        {loading ? "–" : value}
      </p>
    </div>
  );
}

