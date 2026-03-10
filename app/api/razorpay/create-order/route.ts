import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  // eslint-disable-next-line no-console
  console.warn("RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET not set");
}

const razorpay =
  KEY_ID && KEY_SECRET
    ? new Razorpay({
        key_id: KEY_ID,
        key_secret: KEY_SECRET,
      })
    : null;

export async function POST(request: NextRequest) {
  if (!razorpay) {
    return NextResponse.json(
      { error: "Razorpay not configured" },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { type } = body ?? {};

  if (type !== "bill") {
    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
  }

  const billId = body.billId as string | undefined;
  if (!billId) {
    return NextResponse.json({ error: "billId required" }, { status: 400 });
  }

  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }

  if (bill.status !== "PENDING" && bill.status !== "PARTIAL") {
    return NextResponse.json(
      { error: "Bill is not payable" },
      { status: 400 },
    );
  }

  const remainingRupees = bill.amount - (bill.paidAmount ?? 0);
  if (remainingRupees <= 0) {
    return NextResponse.json(
      { error: "Bill already fully paid" },
      { status: 400 },
    );
  }

  const amountPaise = remainingRupees * 100;

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    notes: {
      billId: bill.id,
      userId: bill.userId,
    },
  });

  await prisma.bill.update({
    where: { id: bill.id },
    data: {
      razorpayOrderId: order.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    id: order.id,
    amount: amountPaise,
    finalAmountRupees: remainingRupees,
  });
}

