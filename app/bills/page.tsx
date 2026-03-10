"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type BillStatus = "PENDING" | "PARTIAL" | "PAID";

type BillWithStatus = {
  id: string;
  userId: string;
  amount: number;
  billType: string;
  notes: string | null;
  status: BillStatus;
  paidAmount: number;
  paidAt: string | Date | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function BillsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pendingBills, setPendingBills] = useState<BillWithStatus[]>([]);
  const [paidBills, setPaidBills] = useState<BillWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        if (sessionRes.status === 401) {
          router.replace("/login?returnTo=/bills");
          return;
        }

        const res = await fetch("/api/bills/pending");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load bills");
          return;
        }
        const data = await res.json();
        setPendingBills(data.pending ?? []);
        setPaidBills(data.paid ?? []);
      } catch (e) {
        console.error(e);
        setError("Failed to load bills");
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, [router]);

  async function handlePay(bill: BillWithStatus) {
    try {
      setPayingId(bill.id);
      if (typeof window === "undefined") return;

      const amount = bill.amount;
      const vpa = "bassik.in@kotak";
      const tn = `Bill payment - ₹${amount}`;
      const upiUrl =
        "upi://pay" +
        `?pa=${encodeURIComponent(vpa)}` +
        `&cu=INR` +
        `&am=${encodeURIComponent(String(amount))}` +
        `&tn=${encodeURIComponent(tn)}`;

      // On mobile UPI-supported apps this should open directly.
      window.location.href = upiUrl;
    } catch (e) {
      console.error(e);
      setError("Unable to open UPI payment link");
    } finally {
      setPayingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-md flex-col px-4 pb-10 pt-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Your bills</h1>
          <p className="mt-1 text-sm text-zinc-400">
            View and pay your pending bills securely.
          </p>
        </header>

        {loading && <p className="text-sm text-zinc-400">Loading bills…</p>}
        {error && (
          <p className="mb-3 rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {!loading && pendingBills.length === 0 && paidBills.length === 0 && !error && (
          <p className="text-sm text-zinc-400">
            You don&apos;t have any pending bills right now.
          </p>
        )}

        {!loading && (pendingBills.length > 0 || paidBills.length > 0) && (
          <p className="mb-2 text-[11px] text-zinc-500">
            Payments are processed via UPI to{" "}
            <span className="font-semibold text-emerald-300">
              bassik.in@kotak
            </span>
            . On desktop, copy the link or scan from your UPI app if it
            doesn&apos;t open automatically.
          </p>
        )}

        <div className="space-y-4">
          {pendingBills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Pending / partial bills
              </h2>
              {pendingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        ₹{bill.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Type: {bill.billType}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      {bill.status}
                    </span>
                  </div>
                  {bill.notes && (
                    <p className="mt-1 text-xs text-zinc-300">{bill.notes}</p>
                  )}
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Created at:{" "}
                    {new Date(bill.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <button
                    type="button"
                    onClick={() => handlePay(bill)}
                    disabled={payingId === bill.id}
                    className="mt-3 w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                  >
                    {payingId === bill.id
                      ? "Opening UPI…"
                      : `Pay ₹${bill.amount.toLocaleString("en-IN")}`}
                  </button>
                </div>
              ))}
            </div>
          )}

          {paidBills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Paid bills
              </h2>
              {paidBills.map((bill) => (
                <div
                  key={bill.id}
                  className="rounded-2xl border border-emerald-700/70 bg-emerald-900/20 p-3"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-100">
                        ₹{bill.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-emerald-200/80">
                        Type: {bill.billType}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-black">
                      PAID
                    </span>
                  </div>
                  {bill.notes && (
                    <p className="mt-1 text-xs text-emerald-50/90">
                      {bill.notes}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-emerald-200/80">
                    Paid at:{" "}
                    {bill.paidAt &&
                      new Date(bill.paidAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
