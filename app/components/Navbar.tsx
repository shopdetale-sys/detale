"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, Shield, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const { profile, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-black">
      {/* ── Top Trust Banner (Yellow) ── */}
      <div className="bg-[#FFE500] text-black font-bold text-xs py-2 px-4 text-center flex items-center justify-center gap-1.5 shadow-sm">
        <ShieldCheck size={14} className="text-black" />
        <span>Trusted by 20,00,000+ customers across India</span>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="border-b border-neutral-900 bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="brightness-0 invert transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,229,0,0.6)]">
                <Image
                  src="/logo.png"
                  alt="Detale"
                  width={120}
                  height={40}
                  className="h-9 w-auto"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-neutral-300 hover:text-[#FFE500] text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-neutral-300 hover:text-[#FFE500] text-sm font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                href="/orders"
                className="text-neutral-300 hover:text-[#FFE500] text-sm font-medium transition-colors"
              >
                Track Orders
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FFE500] text-black px-3 py-1.5 rounded-full hover:bg-yellow-400 transition"
                >
                  <LayoutDashboard size={13} />
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* User Account / Profile */}
              <div className="relative">
                {profile ? (
                  <div>
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-neutral-900 text-xs font-medium text-neutral-200 border border-neutral-800 transition"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FFE500] text-black flex items-center justify-center font-bold text-xs">
                        {profile.phone.slice(-2)}
                      </div>
                      <span className="hidden sm:inline">
                        {isAdmin ? "Admin" : `+91 ${profile.phone.slice(-4)}`}
                      </span>
                    </button>

                    {userDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#161616] rounded-2xl shadow-2xl border border-neutral-800 py-2 z-50">
                        <div className="px-4 py-2 border-b border-neutral-800">
                          <p className="text-xs font-bold text-white">
                            {profile.name || "My Account"}
                          </p>
                          <p className="text-[11px] text-neutral-400">+91 {profile.phone}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-[#FFE500] font-semibold hover:bg-neutral-900"
                          >
                            <Shield size={14} /> Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-900"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdown(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-neutral-900 transition"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-neutral-300 hover:text-[#FFE500] hover:bg-neutral-900 transition"
                    title="Sign In"
                  >
                    <User size={20} />
                  </Link>
                )}
              </div>

              {/* Shopping Bag / Cart Button */}
              <button
                onClick={openDrawer}
                aria-label="Open Cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-900 text-neutral-200 hover:text-[#FFE500] transition"
              >
                <ShoppingBag size={21} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#FFE500] text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-900 text-neutral-300"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0d0d0d] border-t border-neutral-900 px-5 py-5 flex flex-col gap-3">
            <Link
              href="/"
              className="text-neutral-200 text-sm font-medium py-1.5 hover:text-[#FFE500]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-neutral-200 text-sm font-medium py-1.5 hover:text-[#FFE500]"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/orders"
              className="text-neutral-200 text-sm font-medium py-1.5 hover:text-[#FFE500]"
              onClick={() => setMenuOpen(false)}
            >
              My Orders
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-[#FFE500] text-sm font-bold py-1.5"
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {!profile ? (
              <Link
                href="/login"
                className="text-[#FFE500] font-bold text-sm py-1.5"
                onClick={() => setMenuOpen(false)}
              >
                Sign In with OTP
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left text-red-400 text-sm font-medium py-1.5"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
