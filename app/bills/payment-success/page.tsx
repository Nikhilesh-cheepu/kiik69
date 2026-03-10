"use client";

import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function BillPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status") ?? "paid";
  const total = searchParams.get("total") ?? "";
  const paymentId = searchParams.get("paymentId") ?? "";

  const isPaid = status === "paid";

  const whatsappText = [
    "SKYHY Bill Payment Confirmation:",
    total ? `Total Paid: ₹${total}` : "",
    paymentId ? `Payment ID: ${paymentId}` : "",
    `Status: ${isPaid ? "PAID via Razorpay" : status.toUpperCase()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `https://wa.me/919274696969?text=${encodeURIComponent(
    whatsappText,
  )}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-md flex-col items-center px-4 pb-10 pt-10 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-black">
          ✓
        </div>
        <h1 className="text-2xl font-semibold">
          {isPaid ? "Bill paid successfully" : "Bill status updated"}
        </h1>
        {total && (
          <p className="mt-2 text-sm text-zinc-300">
            Total paid:{" "}
            <span className="font-semibold text-emerald-300">₹{total}</span>
          </p>
        )}
        {paymentId && (
          <p className="mt-1 text-xs text-zinc-400">
            Payment ID: <span className="font-mono">{paymentId}</span>
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/bills")}
          className="mt-5 w-full rounded-full bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to bills
        </button>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = whatsappUrl;
            }
          }}
          className="mt-3 w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black"
        >
          Send confirmation on WhatsApp
        </button>
      </div>
    </div>
  );
}

