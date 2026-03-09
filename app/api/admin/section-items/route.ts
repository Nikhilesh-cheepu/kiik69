import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query, getOne } from "@/lib/db";
import type { SectionItem } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const sectionKey = request.nextUrl.searchParams.get("sectionKey");
  if (!sectionKey) {
    return NextResponse.json(
      { error: "sectionKey query param required" },
      { status: 400 }
    );
  }
  const { rows } = await query<SectionItem>(
    "SELECT id, section_key, sort_order, data, is_active, created_at, updated_at FROM section_items WHERE section_key = $1 ORDER BY sort_order ASC, id ASC",
    [sectionKey]
  );
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const body = await request.json();
  const section_key = body?.section_key;
  const data = body?.data ?? {};
  const sort_order = Number(body?.sort_order) || 0;
  const is_active = body?.is_active !== false;
  if (!section_key) {
    return NextResponse.json(
      { error: "section_key required" },
      { status: 400 }
    );
  }
  const { rows } = await query<SectionItem>(
    "INSERT INTO section_items (section_key, sort_order, data, is_active) VALUES ($1, $2, $3, $4) RETURNING id, section_key, sort_order, data, is_active, created_at, updated_at",
    [section_key, sort_order, JSON.stringify(data), is_active]
  );
  return NextResponse.json(rows[0]);
}
