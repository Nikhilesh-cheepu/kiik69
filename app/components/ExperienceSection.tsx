"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from "framer-motion";

type ExperienceSectionData = {
  label?: string;
  heading?: string;
  supportingText?: string;
};

type CardData = {
  id: number;
  sort_order: number;
  data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    ctaText?: string;
    ctaLink?: string;
    accentColor?: string;
  };
};

type PackageGroup = {
  id: number;
  sort_order: number;
  data: { label?: string };
};

type PackageItem = {
  id: number;
  sort_order: number;
  data: {
    groupId?: number;
    name?: string;
    description?: string;
    price?: string;
  };
};

type ApiPayload = {
  section: ExperienceSectionData;
  cards: CardData[];
  packageGroups: PackageGroup[];
  packageItems: PackageItem[];
};

const DEFAULT_SECTION: ExperienceSectionData = {
  label: "The Experience",
  heading: "More Than a Sports Bar",
  supportingText:
    "Bowling · Live sports · Pool & darts · Food & drinks · Private parties",
};

const PLACEHOLDER_CARDS: CardData[] = [
  {
    id: 0,
    sort_order: 0,
    data: {
      title: "Bowling",
      description: "Lanes for every mood. Strike, spare, and good times.",
      ctaText: "Book a lane",
      ctaLink: "/booking",
      accentColor: "#ff003c",
    },
  },
  {
    id: 1,
    sort_order: 1,
    data: {
      title: "Live Sports",
      description: "Big screens, electric atmosphere. Never miss a game.",
      ctaText: "See what's on",
      ctaLink: "/#experience",
      accentColor: "#00d4aa",
    },
  },
  {
    id: 2,
    sort_order: 2,
    data: {
      title: "Pool & Darts",
      description: "Snooker, pool, darts. Compete or chill.",
      ctaText: "Reserve a table",
      ctaLink: "/booking",
      accentColor: "#a855f7",
    },
  },
  {
    id: 3,
    sort_order: 3,
    data: {
      title: "Food & Drinks",
      description: "Eat & drink anything. Premium bites and pours.",
      ctaText: "View menu",
      ctaLink: "/menu",
      accentColor: "#f59e0b",
    },
  },
  {
    id: 4,
    sort_order: 4,
    data: {
      title: "Parties & Events",
      description: "Corporate outings, birthdays, private hire.",
      ctaText: "Plan your event",
      ctaLink: "/packages",
      accentColor: "#3b82f6",
    },
  },
];

export default function ExperienceSection() {
  const [data, setData] = useState<ApiPayload | null>(null);
  const [verbIndex, setVerbIndex] = useState(0);
  const x = useMotionValue(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Load content from API (section, cards, packages)
  useEffect(() => {
    fetch("/api/experience")
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (payload) setData(payload);
      })
      .catch(() => {});
  }, []);

  const section = data?.section ?? DEFAULT_SECTION;
  const cards = (data?.cards?.length ? data.cards : PLACEHOLDER_CARDS) as CardData[];
  const packageGroups = data?.packageGroups ?? [];
  const packageItems = data?.packageItems ?? [];

  const accent =
    cards[0]?.data?.accentColor && typeof cards[0].data.accentColor === "string"
      ? (cards[0].data.accentColor as string)
      : "#22d3ee"; // cool neon cyan by default

  const itemsByGroup = packageGroups.map((g) => ({
    ...g,
    items: packageItems.filter((p) => p.data?.groupId === g.id),
  }));
  const displayCards = (cards.length > 0 ? cards : PLACEHOLDER_CARDS) as CardData[];

  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState(0);
  const lastTime = useRef(0);

  // Track viewport width so we can compute how many repeated
  // card sets are needed to always cover the visible area.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setViewportWidth(window.innerWidth || 0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Measure the width of a single full card sequence so we know exactly
  // how far to scroll before wrapping, for any number of cards.
  useEffect(() => {
    if (!firstSetRef.current) return;

    const measure = () => {
      if (!firstSetRef.current) return;
      setSetWidth(firstSetRef.current.offsetWidth);
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(firstSetRef.current);
      return () => observer.disconnect();
    }

    return;
  }, [displayCards.length]);

  // Drive a truly continuous marquee: move left at a constant speed,
  // and when we've shifted one full sequence width, jump the offset
  // forward by that same width so the second sequence becomes the first.
  useAnimationFrame((time) => {
    if (!setWidth) return;
    if (lastTime.current === 0) {
      lastTime.current = time;
      return;
    }
    const deltaSeconds = (time - lastTime.current) / 1000;
    lastTime.current = time;

    const SPEED = 60; // px per second
    let nextX = x.get() - SPEED * deltaSeconds;
    if (nextX <= -setWidth) {
      nextX += setWidth;
    }
    x.set(nextX);
  });

  // Ensure we render enough duplicate sets so the viewport is
  // always completely filled – no right-side gaps even when the
  // first sequence has fully scrolled past.
  const repeatCount =
    setWidth && viewportWidth
      ? Math.max(3, Math.ceil(viewportWidth / setWidth) + 2)
      : 3;

  // Rotate minimal verbs above heading
  const VERBS = ["PLAY", "WATCH", "EAT", "DRINK", "COMPETE", "CELEBRATE"];
  useEffect(() => {
    if (VERBS.length === 0) return;
    const id = setInterval(
      () => setVerbIndex((v) => (v + 1) % VERBS.length),
      1100
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="experience"
      className="relative w-full overflow-hidden bg-[#020617] py-14 md:py-18"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading block */}
        <div className="text-center">
          {/* Minimal rotating verb */}
          <div className="mb-0.5 h-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-400/80">
            <AnimatePresence mode="wait">
              <motion.span
                key={verbIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {VERBS[verbIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-[0.08em] text-white sm:text-4xl md:text-5xl lg:text-[2.9rem]"
          >
            <span
              className="bg-gradient-to-r from-sky-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent uppercase"
            >
              {section.heading}
            </span>
          </motion.h2>

          {/* Short category line */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mx-auto mt-2 max-w-2xl text-balance text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 sm:text-[11px]"
          >
            {section.supportingText}
          </motion.p>
        </div>

        {/* Video cards continuous loop */}
        <div className="mt-8 md:mt-10">
          <div className="-mx-5 sm:-mx-10 lg:-mx-20">
            <div className="relative">
              <motion.div
                className="flex gap-3 px-5 sm:gap-4 sm:px-10 lg:px-20"
                style={{ x }}
              >
                {Array.from({ length: repeatCount }).map((_, setIndex) => (
                  <div
                    key={setIndex}
                    ref={setIndex === 0 ? firstSetRef : undefined}
                    className="flex gap-3 sm:gap-4"
                  >
                    {displayCards.map((card) => (
                      <div
                        key={`${card.id}-set-${setIndex}`}
                        className="relative shrink-0 w-[72vw] max-w-[320px] sm:w-[240px] sm:max-w-none md:w-[260px] lg:w-[280px]"
                      >
                        <motion.div
                          layout
                          className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-zinc-800/80 bg-gradient-to-b from-slate-900/80 via-zinc-900/80 to-black shadow-[0_16px_50px_rgba(0,0,0,0.9)]"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {card.data.videoUrl ? (
                            <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className="absolute inset-0 h-full w-full object-cover"
                              src={card.data.videoUrl}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-slate-900" />
                          )}
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent"
                            aria-hidden
                          />
                        </motion.div>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expandable package / pricing area */}
        {/* (Inline pricing details moved to Packages page; keep CTA below) */}
        {/* <div className="mt-16 md:mt-20">
          <ExperiencePricingAccordion groups={itemsByGroup} accent={accent} />
        </div> */}

        {/* Global CTA to explore packages */}
        <div className="mt-10 flex justify-center">
          <motion.a
            href="/packages"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-gradient-to-r from-slate-900/90 via-sky-900/80 to-slate-900/90 px-7 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-cyan-50 shadow-[0_16px_60px_rgba(8,47,73,0.8)] backdrop-blur-md"
            onClick={async () => {
              try {
                await fetch("/api/events/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    eventType: "packages_explore_click",
                    page: "home",
                    section: "experience",
                  }),
                  keepalive: true,
                });
              } catch {
                // ignore
              }
            }}
          >
            <span>Explore Packages & Pricing</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function ExperiencePricingAccordion({
  groups,
  accent,
}: {
  groups: { id: number; data: { label?: string }; items: PackageItem[] }[];
  accent: string;
}) {
  const [openId, setOpenId] = useState<number | null>(groups[0]?.id ?? null);

  if (groups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 backdrop-blur-sm"
      >
        <h3 className="font-display text-2xl text-white" style={{ fontFamily: "var(--font-bebas), sans-serif" }}>
          Packages & pricing
        </h3>
        <p className="mt-2 text-zinc-500">
          Food, drinks, games, and custom packages. Content managed from admin.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden backdrop-blur-sm"
    >
      <div className="border-b border-zinc-800/80 px-6 py-4">
        <h3 className="font-display text-2xl text-white" style={{ fontFamily: "var(--font-bebas), sans-serif" }}>
          Packages & pricing
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Expand each category to see options.
        </p>
      </div>
      <div className="divide-y divide-zinc-800/60">
        {groups.map((group) => {
          const isOpen = openId === group.id;
          const hasItems = group.items.length > 0;
          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : group.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-zinc-800/40"
              >
                <span className="font-medium text-white">
                  {group.data?.label ?? "Package group"}
                </span>
                <span
                  className="text-2xl leading-none transition-transform duration-200"
                  style={{ color: accent, transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-zinc-800/60 bg-black/20 px-6 pb-4 pt-2">
                      {hasItems ? (
                        <ul className="space-y-3">
                          {group.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-4 py-3"
                            >
                              <div>
                                <span className="font-medium text-white">
                                  {item.data?.name ?? "Package"}
                                </span>
                                {item.data?.description && (
                                  <p className="mt-0.5 text-sm text-zinc-400">
                                    {item.data.description}
                                  </p>
                                )}
                              </div>
                              {item.data?.price && (
                                <span className="text-sm font-medium" style={{ color: accent }}>
                                  {item.data.price}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-zinc-500">No packages in this group yet.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
