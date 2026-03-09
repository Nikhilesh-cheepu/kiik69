import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";
import type { PartyPackageRow } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await request.json();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  const updatable = [
    "name",
    "description",
    "price",
    "includes",
    "image_url",
    "is_available",
  ] as const;
  for (const key of updatable) {
    if (key in body) {
      fields.push(`${key} = $${i++}`);
      values.push(body[key]);
    }
  }
  if (!fields.length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  await query(
    `UPDATE party_packages SET ${fields.join(", ")} WHERE id = $${i}`,
    values
  );
  const { rows } = await query<PartyPackageRow>(
    "SELECT id, name, description, price, includes, image_url, is_available, created_at, updated_at FROM party_packages WHERE id = $1",
    [id]
  );
  return NextResponse.json(rows[0] ?? null);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await query("DELETE FROM party_packages WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}

