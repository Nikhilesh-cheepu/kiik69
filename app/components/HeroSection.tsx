"use client";

import { useEffect, useState } from "react";

const FALLBACK_HERO_VIDEO =
  "https://scaznok0vgtcf5lu.public.blob.vercel-storage.com/hero%20%20copy.MP4";

export default function HeroSection() {
  const [videoUrl, setVideoUrl] = useState<string>(FALLBACK_HERO_VIDEO);

  useEffect(() => {
    fetch("/api/sections/hero")
      .then((r) => (r.ok ? r.json() : null))
      .then((section) => {
        const url = section?.data?.videoUrl;
        if (url) setVideoUrl(url);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden">
      {/* Video background - vertical 9:16, object-position top */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-top"
          style={{ aspectRatio: "9/16" }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"
          aria-hidden
        />
      </div>
    </section>
  );
}
