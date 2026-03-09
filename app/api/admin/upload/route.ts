import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const key = (formData.get("key") as string) || undefined;
  if (!file || file.size === 0) {
    return NextResponse.json(
      { error: "File required" },
      { status: 400 }
    );
  }
  const filename = file.name || "upload";
  const blob = await put(key || filename, file, {
    access: "public",
    addRandomSuffix: !key,
  });
  const insert = formData.get("saveToMedia") === "true";
  if (insert) {
    const { rows } = await query<{ id: number }>(
      "INSERT INTO media (blob_url, filename, mime_type, file_size, key) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [blob.url, filename, file.type || null, file.size, blob.pathname]
    );
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      mediaId: rows[0]?.id,
    });
  }
  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
