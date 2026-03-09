import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";
import type { MenuItemRow } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const { rows } = await query<MenuItemRow>(
    "SELECT id, name, price, category, description, image, menu_type, is_available, created_at, updated_at FROM menu_items ORDER BY menu_type, category, name"
  );
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const body = await request.json();
  const { name, price, category, description, image, menu_type } = body || {};
  if (!name || !price || !category || !menu_type) {
    return NextResponse.json(
      { error: "name, price, category, menu_type required" },
      { status: 400 }
    );
  }
  const { rows } = await query<MenuItemRow>(
    "INSERT INTO menu_items (name, price, category, description, image, menu_type, is_available) VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING id, name, price, category, description, image, menu_type, is_available, created_at, updated_at",
    [name, price, category, description ?? null, image ?? null, menu_type]
  );
  return NextResponse.json(rows[0]);
}

