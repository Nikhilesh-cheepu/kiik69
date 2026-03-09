import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { PartyPackageRow } from "@/lib/db";

export async function GET() {
  const { rows } = await query<PartyPackageRow>(
    "SELECT id, name, description, price, includes AS includes, image_url, is_available, created_at, updated_at FROM party_packages WHERE is_available = true ORDER BY price::numeric NULLS LAST, name ASC"
  );

  return NextResponse.json(rows);
}

