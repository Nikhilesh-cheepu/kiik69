import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userSession";
import { BillStatus } from "@prisma/client";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [pending, paid] = await Promise.all([
    prisma.bill.findMany({
      where: {
        userId: session.sub,
        status: {
          in: [BillStatus.PENDING, BillStatus.PARTIAL],
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bill.findMany({
      where: {
        userId: session.sub,
        status: BillStatus.PAID,
      },
      orderBy: { paidAt: "desc" },
    }),
  ]);

  return NextResponse.json({ pending, paid });
}


