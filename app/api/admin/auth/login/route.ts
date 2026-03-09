import { NextRequest, NextResponse } from "next/server";
import { createToken, setSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    if (!password) {
      return NextResponse.json(
        { error: "Password required" },
        { status: 400 }
      );
    }

    const expected =
      process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0
        ? process.env.ADMIN_PASSWORD
        : "7013";

    if (String(password) !== expected) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({
      sub: "admin",
      email: "admin",
    });
    await setSession(token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
