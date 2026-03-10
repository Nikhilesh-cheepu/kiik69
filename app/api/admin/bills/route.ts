import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function normalizePhone(raw: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length > 10) return digits.slice(-10);
  return null;
}

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const phoneParam = searchParams.get("phone");
  const phone = normalizePhone(phoneParam);

  if (!phone) {
    return NextResponse.json(
      { error: "Valid phone (10 digits) required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  const bills = await prisma.bill.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    user: { id: user.id, phone: user.phone, createdAt: user.createdAt },
    bills,
  });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { phone: rawPhone, amount, billType, notes } = body ?? {};

  const phone = normalizePhone(typeof rawPhone === "string" ? rawPhone : null);
  if (!phone) {
    return NextResponse.json(
      { error: "Valid phone (10 digits) required" },
      { status: 400 },
    );
  }

  const amountInt = Number(amount);
  if (!Number.isInteger(amountInt) || amountInt <= 0) {
    return NextResponse.json(
      { error: "Amount must be a positive integer (rupees)" },
      { status: 400 },
    );
  }

  const billTypeStr =
    typeof billType === "string" && billType.length > 0
      ? billType
      : "a_la_carte";

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  const bill = await prisma.bill.create({
    data: {
      userId: user.id,
      amount: amountInt,
      billType: billTypeStr,
      notes: typeof notes === "string" && notes.length > 0 ? notes : null,
    },
  });

  return NextResponse.json(bill, { status: 201 });
}

