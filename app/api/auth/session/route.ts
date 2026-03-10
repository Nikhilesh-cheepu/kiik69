import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/userSession";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ user: { id: session.sub, phone: session.phone } });
}

