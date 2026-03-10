import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as any;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId: string | undefined = payment.order_id;

    if (orderId) {
      await prisma.$transaction(async (tx: any) => {
        const bill = await tx.bill.findFirst({
          where: { razorpayOrderId: orderId },
        });

        if (!bill) return;

        await tx.bill.update({
          where: { id: bill.id },
          data: {
            status: "PAID",
            razorpayPaymentId: payment.id,
            paidAmount: bill.amount,
            paidAt: new Date(),
          },
        });
      });
    }
  }

  return NextResponse.json({ received: true });
}

