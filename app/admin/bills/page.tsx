"use client";

import { useEffect, useMemo, useState } from "react";

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

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export default function AdminBillsPage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [suggestions, setSuggestions] = useState<
    { id: string; phone: string; createdAt: string }[]
  >([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    phone: string;
    createdAt: string;
  } | null>(null);
  const [bills, setBills] = useState<BillWithStatus[]>([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"a_la_carte" | "128">("a_la_carte");
  const [newNotes, setNewNotes] = useState("");

  const [partialBillId, setPartialBillId] = useState<string | null>(null);
  const [partialAmount, setPartialAmount] = useState("");

  // Debounced user search
  useEffect(() => {
    if (!phoneInput.trim()) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const data = await fetchJson<{
          users: { id: string; phone: string; createdAt: string }[];
        }>(`/api/admin/users/search?q=${encodeURIComponent(phoneInput)}`);
        setSuggestions(data.users);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [phoneInput]);

  async function loadBillsForPhone(phone: string) {
    setError(null);
    setLoadingBills(true);
    try {
      const data = await fetchJson<{
        user: { id: string; phone: string; createdAt: string };
        bills: BillWithStatus[];
      }>(`/api/admin/bills?phone=${encodeURIComponent(phone)}`);
      setUser(data.user);
      setBills(data.bills);
    } catch (e: any) {
      setError(e.message || "Failed to load bills");
      setUser(null);
      setBills([]);
    } finally {
      setLoadingBills(false);
    }
  }

  const pendingBills = useMemo(
    () => bills.filter((b) => b.status === "PENDING" || b.status === "PARTIAL"),
    [bills],
  );
  const paidBills = useMemo(
    () => bills.filter((b) => b.status === "PAID"),
    [bills],
  );

  async function handleCreateBill(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    setError(null);
    try {
      const created = await fetchJson<BillWithStatus>("/api/admin/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: user.phone,
          amount: Number(newAmount),
          billType: newType,
          notes: newNotes || undefined,
        }),
      });
      setBills((prev) => [created, ...prev]);
      setNewAmount("");
      setNewNotes("");

      const waText = `Hi! Your bill at SkyHy Live Sports Brewery is \u20B9${created.amount}. You can pay it at ${process.env.NEXT_PUBLIC_APP_URL}/bills`;
      const url = `https://wa.me/91${created.userId}?text=${encodeURIComponent(
        waText,
      )}`;
      console.log("Share bill via WhatsApp (open on phone):", url);
    } catch (e: any) {
      setError(e.message || "Failed to create bill");
    } finally {
      setCreating(false);
    }
  }

  async function updateBill(
    id: string,
    data: Partial<Pick<BillWithStatus, "amount" | "billType" | "notes" | "status" | "paidAmount">> &
      { status?: BillStatus },
  ) {
    setError(null);
    const updated = await fetchJson<BillWithStatus>(
      `/api/admin/bills/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    setBills((prev) => prev.map((b) => (b.id === id ? updated : b)));
  }

  async function deleteBill(id: string) {
    setError(null);
    await fetchJson<{ ok: boolean }>(`/api/admin/bills/${id}`, {
      method: "DELETE",
    });
    setBills((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Bill management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Create, update and track customer bills linked to their phone number.
          </p>
        </div>
      </header>

      <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              1. Find customer by phone
            </h2>
            <p className="text-[11px] text-zinc-500">
              Search by mobile to load their billing history.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="10-digit phone"
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white shadow-sm"
          />
          <button
            type="button"
            onClick={() => loadBillsForPhone(phoneInput)}
            className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-emerald-400 transition-colors"
          >
            Load
          </button>
        </div>
        {suggestLoading && (
          <p className="text-[11px] text-zinc-500">Searching users…</p>
        )}
        {suggestions.length > 0 && (
          <div className="space-y-1 rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 text-xs">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setPhoneInput(s.phone);
                  setSuggestions([]);
                  loadBillsForPhone(s.phone);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left hover:bg-zinc-800/80"
              >
                <span>{s.phone}</span>
                <span className="text-[10px] text-zinc-500">
                  {new Date(s.createdAt).toLocaleDateString("en-IN")}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {user && (
        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                2. Create new bill
              </h2>
              <p className="text-[11px] text-zinc-400">
                For customer +91 {user.phone}
              </p>
            </div>
          </div>
          <form onSubmit={handleCreateBill} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newType}
                onChange={(e) =>
                  setNewType(e.target.value as "a_la_carte" | "128")
                }
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white shadow-sm"
              >
                <option value="a_la_carte">À la carte</option>
                <option value="128">128 menu</option>
              </select>
              <input
                type="number"
                min={0}
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Amount (₹)"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white shadow-sm"
                required
              />
            </div>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Optional notes"
              className="h-20 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white shadow-sm"
            />
            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-sm disabled:opacity-60 hover:bg-emerald-400 transition-colors"
            >
              {creating ? "Creating…" : "Create bill"}
            </button>
          </form>
        </section>
      )}

      {error && (
        <p className="rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      {user && (
        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
          <h2 className="text-sm font-semibold text-zinc-100">
            3. Bills for +91 {user.phone}
          </h2>

          {loadingBills && (
            <p className="text-xs text-zinc-400">Loading bills…</p>
          )}

          {!loadingBills && pendingBills.length === 0 && paidBills.length === 0 && (
            <p className="text-xs text-zinc-400">No bills yet for this user.</p>
          )}

          {pendingBills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                Pending / Partial
              </h3>
              {pendingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="space-y-1 rounded-xl border border-zinc-800 bg-zinc-900/70 p-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-zinc-50">
                        ₹{bill.amount.toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] text-zinc-400">
                          ({bill.billType})
                        </span>
                      </div>
                      {bill.notes && (
                        <p className="text-[11px] text-zinc-300">
                          {bill.notes}
                        </p>
                      )}
                      <p className="text-[10px] text-zinc-500">
                        Created{" "}
                        {new Date(bill.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      {bill.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => updateBill(bill.id, { status: "PAID" })}
                      className="rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-semibold text-black"
                    >
                      Mark as PAID
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPartialBillId(bill.id);
                        setPartialAmount("");
                      }}
                      className="rounded-full bg-amber-500/90 px-2 py-1 text-[10px] font-semibold text-black"
                    >
                      Partially paid
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateBill(bill.id, {
                          amount: bill.amount,
                          billType: bill.billType,
                          notes: bill.notes ?? undefined,
                        })
                      }
                      className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] text-zinc-200"
                    >
                      Save edits
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBill(bill.id)}
                      className="rounded-full bg-red-500/80 px-2 py-1 text-[10px] font-semibold text-black"
                    >
                      Delete
                    </button>
                  </div>

                  {partialBillId === bill.id && (
                    <div className="mt-2 space-y-1 rounded-lg bg-zinc-950/90 p-2">
                      <p className="text-[10px] text-zinc-300">
                        Enter amount received now:
                      </p>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          min={0}
                          value={partialAmount}
                          onChange={(e) => setPartialAmount(e.target.value)}
                          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateBill(bill.id, {
                              status: "PARTIAL",
                              paidAmount: Number(partialAmount),
                            });
                            setPartialBillId(null);
                          }}
                          className="rounded-lg bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-black"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {paidBills.length > 0 && (
            <div className="space-y-2 pt-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Paid bills
              </h3>
              <div className="space-y-1">
                {paidBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="rounded-xl border border-emerald-700/60 bg-emerald-900/20 p-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-emerald-100">
                          ₹{bill.amount.toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] text-emerald-300/80">
                            ({bill.billType})
                          </span>
                        </div>
                        {bill.notes && (
                          <p className="text-[11px] text-emerald-50/90">
                            {bill.notes}
                          </p>
                        )}
                        <p className="text-[10px] text-emerald-200/80">
                          Paid at{" "}
                          {bill.paidAt &&
                            new Date(bill.paidAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-black">
                        PAID
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

