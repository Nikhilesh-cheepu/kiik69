import { NextRequest, NextResponse } from "next/server";
import { firebaseAdminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { setUserSession } from "@/lib/userSession";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken required" }, { status: 400 });
    }

    const decoded = await firebaseAdminAuth.verifyIdToken(idToken);
    const phoneNumber = decoded.phone_number;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number missing on Firebase token" },
        { status: 400 },
      );
    }

    const normalizedPhone = phoneNumber.replace(/^\+91/, "").replace(/\D/g, "");

    const user = await prisma.user.upsert({
      where: { phone: normalizedPhone },
      create: { phone: normalizedPhone },
      update: {},
    });

    await setUserSession({ sub: user.id, phone: user.phone });

    return NextResponse.json({ user: { id: user.id, phone: user.phone } });
  } catch (error) {
    console.error("Auth login error", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

