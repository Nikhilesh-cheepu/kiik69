import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BillStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  const data: any = {};

  if ("amount" in body) {
    const amountInt = Number(body.amount);
    if (!Number.isInteger(amountInt) || amountInt < 0) {
      return NextResponse.json(
        { error: "amount must be an integer >= 0" },
        { status: 400 },
      );
    }
    data.amount = amountInt;
  }

  if ("billType" in body && typeof body.billType === "string") {
    data.billType = body.billType;
  }

  if ("notes" in body) {
    data.notes =
      typeof body.notes === "string" && body.notes.length > 0
        ? body.notes
        : null;
  }

  const now = new Date();

  if ("status" in body) {
    const statusStr = String(body.status) as BillStatus;
    if (
      statusStr !== "PENDING" &&
      statusStr !== "PARTIAL" &&
      statusStr !== "PAID"
    ) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    if (statusStr === "PAID") {
      data.status = "PAID";
      // paidAmount will be set to amount by a small update query below
      data.paidAt = now;
    } else if (statusStr === "PARTIAL") {
      const paidAmountInt = Number(body.paidAmount);
      if (!Number.isInteger(paidAmountInt) || paidAmountInt < 0) {
        return NextResponse.json(
          { error: "paidAmount must be an integer >= 0" },
          { status: 400 },
        );
      }
      data.status = "PARTIAL";
      data.paidAmount = paidAmountInt;
      data.paidAt = now;
    } else if (statusStr === "PENDING") {
      data.status = "PENDING";
    }
  }

  // If marking as PAID and no explicit paidAmount provided, set to amount later
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.bill.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    let finalData = { ...data } as any;

    if (
      "status" in data &&
      data.status === "PAID" &&
      (data.paidAmount === undefined || data.paidAmount === null)
    ) {
      finalData.paidAmount = "amount" in data ? data.amount : existing.amount;
    }

    const bill = await tx.bill.update({
      where: { id },
      data: finalData,
    });

    return bill;
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.bill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

