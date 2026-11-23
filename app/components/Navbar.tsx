"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { itemCount, openDrawer } = useCart();

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "light" ? "light" : "dark"
    );
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("detale-theme", nextTheme);
  };

  return (
    <header className="sticky top-0 z-40 bg-black">
      <div className="border-b border-neutral-900 bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <Image
                src="/logo.png"
                alt="Detale"
                width={120}
                height={40}
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-neutral-300 hover:text-[#9D6EFF] text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-neutral-300 hover:text-[#9D6EFF] text-sm font-medium transition-colors"
              >
                Products
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-800 hover:bg-neutral-900 text-neutral-300 transition"
              >
                {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-900 text-neutral-200 hover:text-[#9D6EFF] transition"
              >
                <ShoppingBag size={21} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#6D3EE6] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-900 text-neutral-300"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-[#0d0d0d] border-t border-neutral-900 px-5 py-5 flex flex-col gap-3">
            <Link
              href="/"
              className="text-neutral-200 text-sm font-medium py-1.5 hover:text-[#9D6EFF]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-neutral-200 text-sm font-medium py-1.5 hover:text-[#9D6EFF]"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-neutral-200 text-sm font-medium py-1.5 hover:text-[#9D6EFF]"
              onClick={() => setMenuOpen(false)}
            >
              Cart{itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
