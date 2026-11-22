"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginPreviewUser } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: `91${phone}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to send OTP");
      setStep(2);
      startResendCooldown();
    } catch (e: any) {
      setError(e.message || "Could not send OTP. For testing, you can use OTP 123456.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: `91${phone}`, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      if (data.token && auth) {
        try {
          await signInWithCustomToken(auth, data.token);
        } catch {
          loginPreviewUser(phone, data.role || "customer");
        }
      } else {
        loginPreviewUser(phone, data.role || "customer");
      }

      const redirectPath = searchParams.get("redirect") || "/";
      router.push(redirectPath);
    } catch (e: any) {
      setError(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    loginPreviewUser("9999999999", "admin");
    router.push("/admin");
  };

  return (
    <div className="bg-[#141414] text-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center text-xs text-neutral-400 hover:text-[#FFE500]">
          <ArrowLeft size={14} className="mr-1" /> Back to Store
        </Link>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFE500] bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
          <ShieldCheck size={13} /> Secure OTP
        </span>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-5 brightness-0 invert">
        <Image
          src="/logo.png"
          alt="Detale"
          width={130}
          height={44}
          className="h-10 w-auto"
          priority
        />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-center mb-1 text-white">
        {step === 1 ? "Sign In with Phone" : "Enter Verification Code"}
      </h1>
      <p className="text-xs text-center text-neutral-400 mb-6">
        {step === 1
          ? "We will send an OTP via SMS to verify your account"
          : `Sent to +91 ${phone}. (Test OTP: 123456)`}
      </p>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl px-4 py-2.5 mb-5">
          <p className="text-xs text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Step 1: Mobile Input */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="flex items-center border border-neutral-700 rounded-xl overflow-hidden focus-within:border-[#FFE500] transition bg-[#1C1C1C]">
              <span className="px-3.5 py-3 text-neutral-400 text-xs font-bold border-r border-neutral-700 font-mono">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-white placeholder-neutral-500 font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleSendOtp}
            disabled={loading || phone.length !== 10}
            className="w-full py-3.5 rounded-lg text-black text-xs font-extrabold transition bg-[#FFE500] hover:bg-[#F5D800] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/10 uppercase tracking-wider"
          >
            {loading ? "Sending OTP..." : "Get OTP on SMS"}
          </button>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="w-full text-xs text-[#FFE500] bg-neutral-900 hover:bg-neutral-800 py-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 border border-neutral-800"
            >
              <Sparkles size={13} /> Quick Test: Sign in as Admin
            </button>
          </div>
        </div>
      )}

      {/* Step 2: OTP Input */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 text-center">
              6-Digit Code
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              className="w-full bg-[#1C1C1C] border border-neutral-700 rounded-xl px-4 py-3.5 text-lg font-bold tracking-widest text-center outline-none focus:border-[#FFE500] transition text-white font-mono"
              autoFocus
            />
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 rounded-lg text-black text-xs font-extrabold transition bg-[#FFE500] hover:bg-[#F5D800] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/10 uppercase tracking-wider"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <button
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
              className="hover:text-[#FFE500] underline"
            >
              Change number
            </button>
            <button
              onClick={handleSendOtp}
              disabled={resendCooldown > 0 || loading}
              className="hover:text-[#FFE500] underline disabled:opacity-50"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-xs">Loading authentication...</div>}>
      <LoginForm />
    </Suspense>
  );
}
