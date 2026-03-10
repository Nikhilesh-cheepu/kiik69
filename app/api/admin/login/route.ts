import { NextRequest, NextResponse } from "next/server";
import { createToken, setSession, getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const expectedEmail = process.env.ADMIN_EMAIL;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedEmail || !expectedPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured" },
        { status: 500 },
      );
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 },
      );
    }

    const token = await createToken({
      sub: "admin",
      email: expectedEmail,
    });
    await setSession(token);

    return NextResponse.json({ admin: { email: expectedEmail } });
  } catch (error) {
    console.error("Admin login error", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function GET() {
  // Convenience: allow GET /api/admin/login to return session info
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ admin: { email: session.email } });
}

