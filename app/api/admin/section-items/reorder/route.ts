import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const body = await request.json();
  const sectionKey = body?.sectionKey;
  const orderedIds = body?.orderedIds;
  if (!sectionKey || !Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json(
      { error: "sectionKey and orderedIds (array) required" },
      { status: 400 }
    );
  }
  for (let i = 0; i < orderedIds.length; i++) {
    const id = Number(orderedIds[i]);
    if (!Number.isInteger(id) || id < 1) continue;
    await query(
      "UPDATE section_items SET sort_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND section_key = $3",
      [i, id, sectionKey]
    );
  }
  return NextResponse.json({ ok: true });
}
