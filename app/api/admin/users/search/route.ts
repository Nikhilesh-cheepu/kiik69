import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ users: [] });
  }

  const digits = q.replace(/\D/g, "");

  try {
    const users = await prisma.user.findMany({
      where: {
        phone: {
          contains: digits,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        phone: u.phone,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin users search DB error", error);
    return NextResponse.json(
      { error: "Database error while searching users" },
      { status: 500 },
    );
  }
}

