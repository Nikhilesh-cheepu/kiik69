"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

async function trackEvent(eventType: string, metadata?: Record<string, unknown>) {
  try {
    await fetch("/api/events/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        page: "home",
        section: "hero_action_bar",
        metadata,
      }),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

const btnBase =
  "relative flex min-h-[44px] w-full items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-medium transition-colors md:min-h-[48px] md:text-[15px]";

export default function HeroActionBar() {
  const [reachOpen, setReachOpen] = useState(false);
  const phoneHref = "tel:+919274696969";
  const whatsappHref =
    "https://wa.me/919274696969?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20SkyHy.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:px-6 md:pb-6 md:pt-4"
    >
      <div className="mx-auto flex max-w-md items-stretch gap-2.5 rounded-3xl border border-zinc-800 bg-black/80 px-2.5 py-2.5 shadow-[0_14px_40px_rgba(0,0,0,0.9)] md:gap-3 md:px-3 md:py-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1"
        >
          <button
            type="button"
            className={`${btnBase} text-white/90`}
            onClick={() => setReachOpen(true)}
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(34,197,94,0.16))",
              border: "1px solid rgba(52,211,153,0.55)",
            }}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              initial={{ opacity: 0.25 }}
              animate={{
                opacity: [0.25, 0.6, 0.25],
                boxShadow: [
                  "0 0 0 0 rgba(52,211,153,0.7)",
                  "0 0 0 6px rgba(52,211,153,0.0)",
                  "0 0 0 0 rgba(52,211,153,0.0)",
                ],
              }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-2">
              <span className="text-lg opacity-95" aria-hidden>
                📞
              </span>
              <span>Reach Us</span>
            </span>
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1"
        >
          <Link
            href="/bills"
            className={`${btnBase} text-white/90`}
            onClick={() => trackEvent("nav_click", { intent: "pay_bill" })}
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.22), rgba(56,189,248,0.18))",
              border: "1px solid rgba(192,132,252,0.7)",
            }}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              initial={{ opacity: 0.22 }}
              animate={{
                opacity: [0.22, 0.55, 0.22],
                boxShadow: [
                  "0 0 0 0 rgba(129,140,248,0.8)",
                  "0 0 0 6px rgba(129,140,248,0.0)",
                  "0 0 0 0 rgba(129,140,248,0.0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-2">
              <span className="text-lg opacity-95" aria-hidden>
                💳
              </span>
              <span>Pay Bill</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex flex-1"
        >
          <Link
            href="/reserve"
            className={`${btnBase} text-white`}
            style={{
              background:
                "conic-gradient(from 210deg, #f97316, #ec4899, #ef4444, #f97316)",
              border: "1px solid rgba(254,226,226,0.9)",
              boxShadow:
                "0 6px 26px rgba(248,113,113,0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
            onClick={() => trackEvent("booking_cta_click")}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative flex items-center gap-2">
              <span className="text-lg opacity-95" aria-hidden>
                📅
              </span>
              <span>Book Table</span>
            </span>
          </Link>
          {/* Floating 10% OFF chip slightly outside the button */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="pointer-events-none absolute -top-2 right-1 md:-top-2.5 md:right-2"
          >
            <div className="rounded-full border border-emerald-300/80 bg-emerald-500 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-black shadow-[0_0_10px_rgba(16,185,129,0.7)]">
              10% off
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {reachOpen && (
            <>
              <motion.button
                type="button"
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setReachOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md rounded-t-2xl border border-zinc-800 bg-zinc-950/98 pb-5 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.9)]"
              >
                <div className="mx-auto h-1 w-10 rounded-full bg-zinc-700/80" />
                <div className="mt-3 px-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Contact
                    </p>
                    <button
                      type="button"
                      onClick={() => setReachOpen(false)}
                      className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300"
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-sm font-medium text-center text-zinc-100">
                    SkyHy Live Sports Brewery
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        trackEvent("call_click");
                        window.location.href = phoneHref;
                      }}
                      className="flex items-center justify-between rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(16,185,129,0.65)]"
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden>📞</span>
                        <span>Call</span>
                      </span>
                      <span className="text-xs opacity-80">+91 92746 96969</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        trackEvent("whatsapp_click", { intent: "reach_us" });
                        window.open(whatsappHref, "_blank");
                      }}
                      className="flex items-center justify-between rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(52,211,153,0.65)]"
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden>💬</span>
                        <span>WhatsApp</span>
                      </span>
                      <span className="text-xs opacity-80">+91 92746 96969</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
