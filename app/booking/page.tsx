"use client";

import { useState } from "react";
import Link from "next/link";

export default function BookingPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState<number | undefined>();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!phone) {
      setError("Phone is required");
      return;
    }
    setStatus("submitting");
    try {
      await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "booking_cta_click",
          page: "booking",
          section: "booking_form",
        }),
        keepalive: true,
      }).catch(() => {});

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          partySize,
          date,
          time,
          message,
          source: "website",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Booking failed");
      }
      setStatus("success");
      setName("");
      setPhone("");
      setPartySize(undefined);
      setDate("");
      setTime("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Booking failed");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <h1 className="text-2xl font-semibold text-white mb-1">Book a table</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Share a few details and our team at SkyHy Live Sports Brewery will confirm your reservation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Phone*
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="+91…"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Guests
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={partySize ?? ""}
                onChange={(e) =>
                  setPartySize(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Anything else we should know?
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="Occasion, preferences, timing, games…"
            />
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-gradient-to-r from-sky-500 via-emerald-400 to-cyan-500 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_50px_rgba(8,47,73,0.9)] transition hover:brightness-110 disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Request booking"}
          </button>
          {status === "success" && (
            <p className="mt-2 text-xs text-emerald-400">
              Got it – we’ll reach out to confirm your booking.
            </p>
          )}
        </form>
        <div className="mt-6 text-xs text-zinc-500">
          Prefer WhatsApp?{" "}
          <a
            href="https://wa.me/919274696969?text=Hi! I'd like to book a table at SkyHy Live Sports Brewery (formerly KIIK 69 Sports Bar)."
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Chat with us →
          </a>
        </div>
      </div>
      <Link href="/" className="mt-8 text-white/70 hover:text-white">
        ← Back
      </Link>
    </div>
  );
}
