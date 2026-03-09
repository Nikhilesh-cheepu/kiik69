import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";
import type { MediaRow } from "@/lib/db";
import { del } from "@vercel/blob";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { rows } = await query<MediaRow>(
    "SELECT id, blob_url, filename, mime_type, file_size, key, created_at FROM media ORDER BY created_at DESC LIMIT 200"
  );
  return NextResponse.json(rows);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const { rows } = await query<MediaRow>(
    "SELECT id, key FROM media WHERE id = $1",
    [id]
  );
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.key) {
    try {
      await del(row.key);
    } catch (e) {
      console.warn("Failed to delete blob from Vercel", e);
    }
  }

  await query("DELETE FROM media WHERE id = $1", [id]);

  return NextResponse.json({ ok: true });
}

