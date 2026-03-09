import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      eventType,
      page,
      section,
      metadata,
    }: {
      eventType?: string;
      page?: string;
      section?: string;
      metadata?: Record<string, unknown>;
    } = body || {};

    if (!eventType || typeof eventType !== "string") {
      return NextResponse.json(
        { error: "eventType required" },
        { status: 400 }
      );
    }

    await query(
      "INSERT INTO analytics_events (event_type, page, section, metadata) VALUES ($1, $2, $3, $4)",
      [
        eventType,
        page ?? null,
        section ?? null,
        metadata ? JSON.stringify(metadata) : "{}",
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Track event error", e);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}

