import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";
import type { PartyPackageRow } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const { rows } = await query<PartyPackageRow>(
    "SELECT id, name, description, price, includes, image_url, is_available, created_at, updated_at FROM party_packages ORDER BY created_at DESC"
  );
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await ensureCoreTables();
  const body = await request.json();
  const { name, description, price, includes, image_url } = body || {};
  if (!name || !price) {
    return NextResponse.json(
      { error: "name and price required" },
      { status: 400 }
    );
  }
  const { rows } = await query<PartyPackageRow>(
    "INSERT INTO party_packages (name, description, price, includes, image_url, is_available) VALUES ($1,$2,$3,$4,$5,true) RETURNING id, name, description, price, includes, image_url, is_available, created_at, updated_at",
    [name, description ?? null, price, includes ?? null, image_url ?? null]
  );
  return NextResponse.json(rows[0]);
}

