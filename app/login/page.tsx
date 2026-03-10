"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { firebaseAuth } from "@/lib/firebaseClient";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  // set up invisible reCAPTCHA
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).recaptchaVerifier) return;

    try {
      const verifier = new RecaptchaVerifier(
        firebaseAuth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
      (window as any).recaptchaVerifier = verifier;
    } catch {
      // ignore in dev double-mount
    }
  }, []);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const verifier = (window as any)
        .recaptchaVerifier as RecaptchaVerifier | null;
      if (!verifier) {
        setError("Unable to start verification. Please try again.");
        return;
      }
      const result = await signInWithPhoneNumber(
        firebaseAuth,
        `+91${digits}`,
        verifier,
      );
      setConfirmationResult(result);
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      const message =
        typeof err?.code === "string" && err.code.includes("too-many-requests")
          ? "Too many OTP requests to this number. Please wait a few minutes before trying again."
          : "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmationResult) return;
    setError(null);
    setLoading(true);
    try {
      const cred = await confirmationResult.confirm(otp);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace(returnTo);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-2xl">
        <h1 className="text-lg font-semibold text-white">
          Login to SkyHy account
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Use your mobile number to view and pay your bills.
        </p>

        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-xs font-medium text-zinc-300"
              >
                Mobile number
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2">
                <span className="text-xs text-zinc-400">+91</span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="flex-1 bg-transparent text-sm text-white outline-none"
                  placeholder="10-digit number"
                />
              </div>
            </div>
            {error && (
              <p className="text-[11px] text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <p className="text-[11px] text-zinc-400">
              Enter the 6-digit code sent to +91 {phone}.
            </p>
            <input
              type="tel"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-lg tracking-[0.5em] text-white outline-none"
              placeholder="••••••"
            />
            {error && (
              <p className="text-[11px] text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
      <div id="recaptcha-container" />
    </div>
  );
}

