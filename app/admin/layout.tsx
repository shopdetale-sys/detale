"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  Loader2,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // If we are on /admin/login, don't show the dashboard chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true);
      return;
    }

    // Check admin session
    fetch("/api/admin/check")
      .then((res) => {
        if (res.ok) {
          setAuthorized(true);
        } else {
          // Check local fallback
          const localAuth = typeof window !== "undefined" && localStorage.getItem("detale_admin_auth") === "true";
          if (localAuth) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
            router.push("/admin/login");
          }
        }
      })
      .catch(() => {
        setAuthorized(false);
        router.push("/admin/login");
      });
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("detale_admin_auth");
    }
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
        <p className="text-xs text-gray-400">Verifying Admin Credentials...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products & Stock", icon: Package },
    { href: "/admin/orders", label: "Orders & Shipping", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-950 text-white flex-shrink-0 flex flex-col justify-between p-6">
        <div>
          {/* Logo & Badge */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Detale"
                width={110}
                height={36}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <span className="text-[10px] font-bold bg-purple-700 text-white px-2 py-0.5 rounded-full">
              PROTECTED
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? "bg-purple-700 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Info & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-purple-400 transition"
          >
            <ArrowLeft size={14} /> Back to Customer Store
          </Link>
          <div className="bg-white/5 rounded-xl p-3 text-[11px] text-gray-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>Admin: <strong>admin</strong></span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-gray-400 hover:text-red-400 transition p-1"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-gray-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Management Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">Administrator</p>
              <p className="text-[10px] text-gray-500">Security Level: Full Access</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 px-3 py-1.5 rounded-xl transition"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
