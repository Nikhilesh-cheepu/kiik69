"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { firebaseAuth } from "@/lib/firebaseClient";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  type ConfirmationResult,
} from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

type Meal = "lunch" | "dinner";

type UserInfo = {
  id: string;
  phone: string;
};

type OfferId = "eat-drink-128" | "alacarte-25" | null;

type Offer = {
  id: Exclude<OfferId, null>;
  title: string;
  description: string;
};

const IST_TIME_ZONE = "Asia/Kolkata";

const OFFERS: Offer[] = [
  {
    id: "eat-drink-128",
    title: "Eat & Drink @128",
    description: "Special 128 menu valid till early evening.",
  },
  {
    id: "alacarte-25",
    title: "À la carte 10% OFF",
    description: "Regular menu with flat savings at 10% OFF.",
  },
];

function getTodayIstIso(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: IST_TIME_ZONE,
  });
}

function getIstNow(): Date {
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: IST_TIME_ZONE });
  return new Date(istString);
}

function getSlotsForMeal(meal: Meal): string[] {
  const slots: string[] = [];
  const startMinutes = meal === "lunch" ? 12 * 60 : 18 * 60 + 15;
  const endMinutes = meal === "lunch" ? 18 * 60 : 23 * 60 + 45;

  for (let m = startMinutes; m <= endMinutes; m += 15) {
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const suffix = h24 >= 12 ? "PM" : "AM";
    const h12 = ((h24 + 11) % 12) + 1;
    const label = `${h12}:${min.toString().padStart(2, "0")} ${suffix}`;
    slots.push(label);
  }
  return slots;
}

function isFutureSlot(
  slot: string,
  selectedDate: string,
  todayIso: string,
): boolean {
  // If the user chose a different calendar day than today in IST, allow all slots
  if (selectedDate !== todayIso) return true;

  const match = slot.match(/^(\d+):(\d{2}) (AM|PM)$/);
  if (!match) return true;

  const [, hStr, mStr, ampm] = match;
  let hours = Number(hStr);
  const minutes = Number(mStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return true;

  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const istNow = getIstNow();
  const currentMinutes = istNow.getHours() * 60 + istNow.getMinutes();
  const slotMinutes = hours * 60 + minutes;

  return slotMinutes > currentMinutes;
}

function is128OfferValid(selectedTime: string | null): boolean {
  if (!selectedTime) return false;

  const match = selectedTime.match(/^(\d+):(\d{2}) (AM|PM)$/);
  if (!match) return false;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const ampm = match[3];
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const total = hours * 60 + minutes;
  const start = 12 * 60;
  const end = 19 * 60 + 45;
  return total >= start && total <= end;
}

const DRAFT_KEY = "reserve_draft_v1";

type DraftState = {
  selectedDate: string;
  meal: Meal;
  selectedTime: string | null;
  guests: number;
  name: string;
  selectedOfferId: OfferId;
};

function saveDraft(state: DraftState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state));
}

function loadDraft(): DraftState | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DraftState;
  } catch {
    return null;
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DRAFT_KEY);
}

export default function ReservePage() {
  const [todayIso] = useState<string>(() => getTodayIstIso());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [meal, setMeal] = useState<Meal>("dinner");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState<OfferId>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  // Initialise Firebase reCAPTCHA verifier on client only
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).recaptchaVerifier) return;

    try {
      const verifier = new RecaptchaVerifier(
        firebaseAuth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved, allow sending OTP
          },
        },
      );
      (window as any).recaptchaVerifier = verifier;
    } catch (e) {
      // In dev, reinitialisation can throw; ignore if already initialised
      // eslint-disable-next-line no-console
      console.warn("Recaptcha init error", e);
    }
  }, []);

  // Initialise state on client only to avoid hydration mismatches
  useEffect(() => {
    const draft = loadDraft();
    setSelectedDate(draft?.selectedDate ?? todayIso);
    setMeal(draft?.meal ?? "dinner");
    setSelectedTime(draft?.selectedTime ?? null);
    setGuests(draft?.guests ?? 2);
    setName(draft?.name ?? "");
    setSelectedOfferId(draft?.selectedOfferId ?? null);
  }, [todayIso]);

  useEffect(() => {
    if (!selectedDate) return;
    const draftState: DraftState = {
      selectedDate,
      meal,
      selectedTime,
      guests,
      name,
      selectedOfferId,
    };
    saveDraft(draftState);
  }, [selectedDate, meal, selectedTime, guests, name, selectedOfferId]);

  useEffect(() => {
    let isMounted = true;
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user);
          }
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setLoadingSession(false);
      }
    }
    fetchSession();

    const unsub = onAuthStateChanged(firebaseAuth, () => {
      // no-op; we rely on our own session cookie
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const allSlots = useMemo(() => getSlotsForMeal(meal), [meal]);
  const { slotsToRender, hasOnlyPastToday } = useMemo(() => {
    if (!selectedDate) {
      return { slotsToRender: [] as string[], hasOnlyPastToday: false };
    }

    const futureSlots = allSlots.filter((slot) =>
      isFutureSlot(slot, selectedDate, todayIso),
    );

    if (futureSlots.length > 0) {
      return { slotsToRender: futureSlots, hasOnlyPastToday: false };
    }

    const hasOnlyPast = selectedDate === todayIso && futureSlots.length === 0;
    return { slotsToRender: allSlots, hasOnlyPastToday: hasOnlyPast };
  }, [allSlots, selectedDate, todayIso]);

  const selectedOffer =
    selectedOfferId && OFFERS.find((o) => o.id === selectedOfferId);

  async function handleLoginSendOtp() {
    // basic throttle to avoid hammering the endpoint
    if (loginStep === "otp") return;
    setLoginError(null);
    const raw = phoneInput.replace(/\D/g, "");
    if (raw.length !== 10) {
      setLoginError("Enter a valid 10-digit mobile number.");
      return;
    }
    try {
      const verifier = (typeof window !== "undefined"
        ? (window as any).recaptchaVerifier
        : null) as RecaptchaVerifier | null;

      if (!verifier) {
        setLoginError("Unable to start verification. Please try again.");
        return;
      }

      const result = await signInWithPhoneNumber(
        firebaseAuth,
        `+91${raw}`,
        verifier,
      );
      setConfirmationResult(result);
      setLoginStep("otp");
    } catch (error: any) {
      console.error(error);
      const code = typeof error?.code === "string" ? error.code : "";
      let message = "Failed to send OTP. Please try again.";
      if (code.includes("too-many-requests")) {
        message =
          "Too many OTP requests to this number. Please wait a few minutes before trying again.";
      } else if (code.includes("invalid-app-credential")) {
        message =
          "Login is temporarily unavailable. Please refresh the page and try again in a minute.";
      }
      setLoginError(message);
    }
  }

  async function handleLoginVerifyOtp() {
    if (!confirmationResult) return;
    setLoginError(null);
    try {
      const cred = await confirmationResult.confirm(otpInput);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.error || "Login failed");
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setShowLoginModal(false);
    } catch (error) {
      console.error(error);
      setLoginError("Invalid OTP. Please try again.");
    }
  }

  function handlePrimaryCta() {
    if (!selectedDate) {
      return;
    }
    if (!name.trim() || !selectedTime) {
      alert("Please enter your name and select a time slot.");
      return;
    }
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowConfirmModal(true);
  }

  async function handleConfirmBooking() {
    if (!user || !selectedTime) return;
    setSubmitting(true);
    try {
      const payload = {
        fullName: name.trim(),
        mobile: user.phone,
        date: selectedDate,
        time: selectedTime,
        people: guests,
        ticketPrice: 0,
        paymentStatus: "BOOKING_CREATED",
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Booking failed. Please try again.");
        return;
      }

      const dateObj = new Date(selectedDate + "T00:00:00");
      const formattedDate = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(dateObj);

      const brand = "SkyHy Live Sports Brewery";
      const offerText = selectedOffer?.title ?? "None";

      const message = [
        `Hi, I just booked a table at ${brand}.`,
        "",
        `Name: ${name.trim()}`,
        `Guests: ${guests}`,
        `Date: ${formattedDate}`,
        `Time: ${selectedTime}`,
        `Offer: ${offerText}`,
        "",
        "Please confirm my reservation.",
      ].join("\n");

      const whatsappNumber = "919274696969";
      const url =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

      clearDraft();
      setShowConfirmModal(false);

      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    } finally {
      setSubmitting(false);
    }
  }

  const dateChips =
    selectedDate === null
      ? []
      : Array.from({ length: 10 }, (_, offset) => {
          const base = new Date(todayIso + "T00:00:00");
          base.setDate(base.getDate() + offset);
          // Use the same IST-based calendar format as getTodayIstIso()
          const iso = base.toLocaleDateString("en-CA", {
            timeZone: IST_TIME_ZONE,
          });
          const label = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            weekday: "short",
          }).format(base);
          return { iso, label };
        });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="mx-auto flex max-w-md flex-col px-4 pb-16 pt-6">
        <header className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm"
            >
              ←
            </Link>
            <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400/80">
                Book a table
              </p>
              <h1 className="mt-0.5 text-2xl font-semibold">
                Reserve your spot
              </h1>
            </div>
          </div>
        </header>

        <section className="mb-4 space-y-3 rounded-2xl border border-zinc-800/80 bg-black/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-zinc-300">
              Choose date
            </span>
            <span className="text-[10px] text-zinc-500">
              All times shown in IST
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dateChips.map(({ iso, label }) => {
              const active = iso === selectedDate;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={`flex min-w-[96px] flex-col rounded-xl border px-3 py-2 text-left ${
                    active
                      ? "border-amber-400/80 bg-amber-500/15 text-amber-50"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-300"
                  }`}
                >
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800/80 bg-black/40 p-3">
          <button
            type="button"
            onClick={() => setMeal("lunch")}
            className={`rounded-xl border px-3 py-2 text-left text-xs font-medium ${
              meal === "lunch"
                ? "border-amber-400/80 bg-amber-500/10 text-amber-100"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-300"
            }`}
          >
            Lunch
            <span className="mt-0.5 block text-[10px] font-normal text-zinc-400">
              12:00 PM – 6:00 PM
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMeal("dinner")}
            className={`rounded-xl border px-3 py-2 text-left text-xs font-medium ${
              meal === "dinner"
                ? "border-indigo-400/80 bg-indigo-500/10 text-indigo-100"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-300"
            }`}
          >
            Dinner
            <span className="mt-0.5 block text-[10px] font-normal text-zinc-400">
              6:15 PM – 11:45 PM
            </span>
          </button>
        </section>

        <section className="mb-4 rounded-2xl border border-zinc-800/80 bg-black/40 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">
              Time slots
            </span>
            <span className="text-[10px] text-zinc-500">
              All times shown in IST
            </span>
          </div>
          {hasOnlyPastToday && (
            <p className="mb-2 rounded-lg bg-zinc-900/70 px-3 py-2 text-[11px] text-zinc-400">
              No slots left today — all times shown for reference. Pick another
              date for available slots.
            </p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {slotsToRender.map((slot) => {
              const active = slot === selectedTime;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-xl border px-2 py-1.5 text-[11px] ${
                    active
                      ? "border-emerald-400/80 bg-emerald-500/10 text-emerald-50"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-300"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-4 space-y-2 rounded-2xl border border-zinc-800/80 bg-black/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">
              Available offers
            </span>
          </div>
          <div className="space-y-2">
            {OFFERS.map((offer) => {
              const is128 = offer.id === "eat-drink-128";
              if (is128 && !is128OfferValid(selectedTime)) {
                return null;
              }
              const active = selectedOfferId === offer.id;
              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() =>
                    setSelectedOfferId(active ? null : offer.id as OfferId)
                  }
                  className={`flex w-full items-start justify-between rounded-xl border px-3 py-2 text-left text-xs ${
                    active
                      ? "border-amber-400/80 bg-amber-500/10 text-amber-50"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-200"
                  }`}
                >
                  <div>
                    <p className="font-medium">{offer.title}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-400">
                      {offer.description}
                    </p>
                  </div>
                  {active && (
                    <span className="text-[10px] font-semibold text-amber-300">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-4 space-y-3 rounded-2xl border border-zinc-800/80 bg-black/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-300">
                Guests
              </span>
              <div className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/60 px-1 py-0.5">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="h-6 w-6 rounded-full bg-zinc-800 text-center text-xs text-zinc-100"
                >
                  −
                </button>
                <span className="px-2 text-xs font-semibold">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(20, g + 1))}
                  className="h-6 w-6 rounded-full bg-amber-400 text-center text-xs text-black"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right text-[10px] text-zinc-500">
              Large group? Message us on WhatsApp after booking.
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-zinc-300"
            >
              Name for the booking
            </label>
              <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </section>

        <div className="mt-auto space-y-2 pb-4">
          <button
            type="button"
            onClick={handlePrimaryCta}
            disabled={loadingSession || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-4 py-3 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(251,191,36,0.7)] disabled:opacity-60"
          >
            {user ? "Confirm booking" : "Login to confirm booking"}
          </button>
          <p className="text-center text-[10px] text-zinc-500">
            No online payment required. You&apos;ll pay at the venue after
            confirmation.
          </p>
        </div>
      </div>

      <div id="recaptcha-container" />

      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Login with mobile number
                </h2>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="text-xs text-zinc-400"
                >
                  Close
                </button>
              </div>

              {loginStep === "phone" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      Mobile number
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2">
                      <span className="text-xs text-zinc-400">+91</span>
                      <input
                        id="phone"
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        maxLength={10}
                        className="flex-1 bg-transparent text-sm text-white outline-none"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>
                  {loginError && (
                    <p className="text-[11px] text-red-400">{loginError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleLoginSendOtp}
                    className="w-full rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {loginStep === "otp" && (
                <div className="space-y-3">
                  <p className="text-[11px] text-zinc-400">
                    Enter the 6-digit code sent to +91 {phoneInput}.
                  </p>
                  <input
                    type="tel"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    maxLength={6}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-lg tracking-[0.5em] text-white outline-none"
                    placeholder="••••••"
                  />
                  {loginError && (
                    <p className="text-[11px] text-red-400">{loginError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleLoginVerifyOtp}
                    className="w-full rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black"
                  >
                    Verify & Continue
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && selectedTime && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Confirm booking</h2>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="text-xs text-zinc-400"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 text-xs text-zinc-200">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Name</span>
                  <span>{name.trim()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Guests</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date</span>
                  <span>{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Time</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Offer</span>
                  <span>{selectedOffer?.title ?? "None"}</span>
                </div>
                {user && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Mobile</span>
                    <span>+91 {user.phone}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmBooking}
                className="mt-4 w-full rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
              >
                {submitting ? "Booking…" : "Confirm & send via WhatsApp"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

