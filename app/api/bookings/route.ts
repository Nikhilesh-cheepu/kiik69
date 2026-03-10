import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userSession";

const SLOT_CAPACITY = 10;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, mobile, date, time, people, ticketPrice, paymentStatus } =
      body ?? {};

    if (
      !fullName ||
      !mobile ||
      !date ||
      !time ||
      typeof people !== "number" ||
      people <= 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid booking fields" },
        { status: 400 },
      );
    }

    const bookingDate = new Date(date);
    if (Number.isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const dayStart = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
    );
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const existingCount = await prisma.eventBooking.count({
      where: {
        date: { gte: dayStart, lt: dayEnd },
        time,
      },
    });

    if (existingCount >= SLOT_CAPACITY) {
      return NextResponse.json(
        {
          error:
            "This time slot is fully booked. Please choose another time.",
        },
        { status: 400 },
      );
    }

    const session = await getUserSession();
    const userId = session?.sub ?? null;

    const booking = await prisma.eventBooking.create({
      data: {
        eventId: null,
        fullName,
        mobile,
        userId,
        date: bookingDate,
        time,
        people,
        ticketPrice: ticketPrice ?? 0,
        paymentStatus: paymentStatus ?? "BOOKING_CREATED",
        razorpayOrderId: null,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Booking creation error", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}

