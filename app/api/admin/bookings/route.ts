import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const { rows } = await query(
    "SELECT id, name, phone, party_size, date, time, message, source, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 100"
  );
  return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const body = await request.json();
  const { id, status } = body || {};
  if (!id || !status) {
    return NextResponse.json(
      { error: "id and status required" },
      { status: 400 }
    );
  }
  await query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);
  return NextResponse.json({ ok: true });
}

