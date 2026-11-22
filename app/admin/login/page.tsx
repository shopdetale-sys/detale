"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Store local indicator for instant UI render
      if (typeof window !== "undefined") {
        localStorage.setItem("detale_admin_auth", "true");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = () => {
    setUsername("admin");
    setPassword("detale@admin2026");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-gray-500 hover:text-purple-700 transition"
          >
            <ArrowLeft size={14} className="mr-1" /> Storefront
          </Link>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
            <ShieldCheck size={13} /> Admin Gateway
          </span>
        </div>

        {/* Brand Logo */}
        <div className="flex justify-center mb-5">
          <Image
            src="/logo.png"
            alt="Detale"
            width={125}
            height={42}
            className="h-10 w-auto"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Admin Portal Login
        </h1>
        <p className="text-xs text-center text-gray-500 mb-6">
          Restricted management area for Detale Car Care operations.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-5">
            <p className="text-xs text-red-600 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Admin Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600 transition bg-white px-3.5 py-2.5">
              <User size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                required
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs outline-none bg-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600 transition bg-white px-3.5 py-2.5">
              <Lock size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs outline-none bg-transparent text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-xs font-bold transition bg-purple-700 hover:bg-purple-800 disabled:opacity-50 shadow-md shadow-purple-200 flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                Access Admin Dashboard <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credential Helper */}
        <div className="mt-6 pt-5 border-t border-gray-100 bg-gray-50/80 -mx-8 -mb-8 p-6 rounded-b-3xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <KeyRound size={13} className="text-purple-700" /> Default Credentials
            </span>
            <button
              type="button"
              onClick={fillQuickDemo}
              className="text-[11px] font-bold text-purple-700 hover:underline"
            >
              Auto-fill
            </button>
          </div>
          <div className="text-[11px] text-gray-500 font-mono space-y-0.5">
            <p>Username: <strong className="text-gray-800">admin</strong></p>
            <p>Password: <strong className="text-gray-800">detale@admin2026</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
