import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getOne, query } from "@/lib/db";
import type { SiteSection } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sectionKey: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const { sectionKey } = await params;
  const section = await getOne<SiteSection>(
    "SELECT id, section_key, name, data, created_at, updated_at FROM site_sections WHERE section_key = $1",
    [decodeURIComponent(sectionKey)]
  );
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }
  return NextResponse.json(section);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectionKey: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const { sectionKey } = await params;
  const key = decodeURIComponent(sectionKey);
  const body = await request.json();
  const { name, data } = body;
  const dataJson = data != null ? JSON.stringify(data) : "{}";
  const nameStr = name != null ? String(name) : key;

  const existing = await getOne<SiteSection>(
    "SELECT id FROM site_sections WHERE section_key = $1",
    [key]
  );
  if (existing) {
    await query(
      "UPDATE site_sections SET name = $1, data = $2, updated_at = CURRENT_TIMESTAMP WHERE section_key = $3",
      [nameStr, dataJson, key]
    );
  } else {
    await query(
      "INSERT INTO site_sections (section_key, name, data) VALUES ($1, $2, $3)",
      [key, nameStr, dataJson]
    );
  }
  const section = await getOne<SiteSection>(
    "SELECT id, section_key, name, data, created_at, updated_at FROM site_sections WHERE section_key = $1",
    [key]
  );
  return NextResponse.json(section);
}
