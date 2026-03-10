import { NextResponse } from "next/server";

// Simple API to provide hero section configuration.
// For now this just returns a static video URL so the
// frontend fetch in HeroSection doesn't see 404s.

const FALLBACK_HERO_VIDEO =
  "https://scaznok0vgtcf5lu.public.blob.vercel-storage.com/hero%20%20copy.MP4";

export async function GET() {
  return NextResponse.json({
    data: {
      videoUrl: FALLBACK_HERO_VIDEO,
    },
  });
}

