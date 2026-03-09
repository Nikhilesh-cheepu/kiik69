import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { SectionItem } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export async function GET(request: NextRequest) {
  const sectionKey = request.nextUrl.searchParams.get("sectionKey");
  if (!sectionKey) {
    return NextResponse.json(
      { error: "sectionKey query param required" },
      { status: 400 }
    );
  }
  await ensureCoreTables();
  const { rows } = await query<SectionItem>(
    "SELECT id, sort_order, data FROM section_items WHERE section_key = $1 AND is_active = true ORDER BY sort_order ASC, id ASC",
    [sectionKey]
  );
  return NextResponse.json(rows);
}
