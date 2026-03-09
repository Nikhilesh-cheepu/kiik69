import { NextRequest, NextResponse } from "next/server";
import { getOne } from "@/lib/db";
import type { SiteSection } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sectionKey: string }> }
) {
  await ensureCoreTables();
  const sectionKey = decodeURIComponent((await params).sectionKey);
  const section = await getOne<SiteSection>(
    "SELECT section_key, name, data FROM site_sections WHERE section_key = $1",
    [sectionKey]
  );
  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    section_key: section.section_key,
    name: section.name,
    data: section.data,
  });
}
