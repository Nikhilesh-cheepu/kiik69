import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";
import type { SiteSection } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const { rows } = await query<SiteSection>(
    "SELECT id, section_key, name, data, created_at, updated_at FROM site_sections ORDER BY section_key"
  );
  return NextResponse.json(rows);
}
