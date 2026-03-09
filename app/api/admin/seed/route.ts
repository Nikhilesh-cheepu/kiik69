import { NextRequest, NextResponse } from "next/server";
import { query, getOne } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import type { AdminUser } from "@/lib/db";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.ADMIN_SEED_TOKEN;
  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const existing = await getOne<AdminUser>(
    "SELECT id FROM admin_users LIMIT 1"
  );
  if (existing) {
    return NextResponse.json(
      { error: "Admin already exists" },
      { status: 400 }
    );
  }
  const body = await request.json();
  const email = body?.email?.trim()?.toLowerCase();
  const password = body?.password;
  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (min 8 chars) required" },
      { status: 400 }
    );
  }
  const password_hash = await hashPassword(password);
  await query(
    "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)",
    [email, password_hash]
  );
  return NextResponse.json({ ok: true, email });
}
