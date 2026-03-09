import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getOne, query } from "@/lib/db";
import type { SectionItem } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await request.json();
  const updates: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (body.data !== undefined) {
    updates.push(`data = $${i++}`);
    values.push(JSON.stringify(body.data));
  }
  if (body.sort_order !== undefined) {
    updates.push(`sort_order = $${i++}`);
    values.push(Number(body.sort_order));
  }
  if (body.is_active !== undefined) {
    updates.push(`is_active = $${i++}`);
    values.push(Boolean(body.is_active));
  }
  if (updates.length === 0) {
    const row = await getOne<SectionItem>(
      "SELECT id, section_key, sort_order, data, is_active, created_at, updated_at FROM section_items WHERE id = $1",
      [id]
    );
    return row
      ? NextResponse.json(row)
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);
  await query(
    `UPDATE section_items SET ${updates.join(", ")} WHERE id = $${i}`,
    values
  );
  const row = await getOne<SectionItem>(
    "SELECT id, section_key, sort_order, data, is_active, created_at, updated_at FROM section_items WHERE id = $1",
    [id]
  );
  return row
    ? NextResponse.json(row)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const { rowCount } = await query("DELETE FROM section_items WHERE id = $1", [
    id,
  ]);
  return NextResponse.json({ deleted: rowCount > 0 });
}
