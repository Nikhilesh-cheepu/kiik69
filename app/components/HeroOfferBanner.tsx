"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FALLBACK_OFFER_ITEMS = [
  "Website Exclusive Deals",
  "Eat & Drink Anything @128 | 12PM – 8PM",
  "Bowling",
  "Snooker",
  "Darts",
  "10% Off À La Carte",
  "Corporate Parties",
];

function GlowDot() {
  return (
    <span
      className="mx-4 shrink-0 rounded-full bg-[#ff003c] opacity-90"
      style={{
        width: "4px",
        height: "4px",
        boxShadow: "0 0 10px rgba(255,0,60,0.9)",
      }}
      aria-hidden
    />
  );
}

export default function HeroOfferBanner() {
  const [items, setItems] = useState<string[]>(FALLBACK_OFFER_ITEMS);

  useEffect(() => {
    fetch("/api/section-items?sectionKey=offer_banner")
      .then((r) => (r.ok ? r.json() : null))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setItems(rows.map((r: { data?: { text?: string } }) => r.data?.text ?? "").filter(Boolean));
        }
      })
      .catch(() => {});
  }, []);

  function OfferSegment() {
    return (
      <>
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center whitespace-nowrap">
            <span className="leading-none">{item}</span>
            {i < items.length - 1 && <GlowDot />}
          </span>
        ))}
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 right-0 top-12 z-40 md:top-16"
      style={{
        background: "rgba(5,5,8,0.78)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,0,60,0.28)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex h-9 w-full items-center overflow-hidden px-3 md:h-10">
        <motion.div
          className="inline-flex h-full items-center gap-0 text-[15px] font-medium leading-none tracking-tight text-white"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 32,
              ease: "linear",
            },
          }}
        >
          <OfferSegment />
          <GlowDot />
          <OfferSegment />
          <GlowDot />
          <OfferSegment />
          <GlowDot />
        </motion.div>
      </div>
    </motion.div>
  );
}
