import Image from "next/image";
import Link from "next/link";
import { Share2, Rss, Globe, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#0A0A0A] text-neutral-300 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 drop-shadow-[0_0_10px_rgba(157,110,255,0.35)]">
              <Image
                src="/logo.png"
                alt="Detale"
                width={120}
                height={40}
                className="h-9 w-auto"
              />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Premium automotive detailing products for car enthusiasts and
              professional studios. Engineered for endurance and unmatched
              gloss.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#4D2C9C] hover:text-white transition-colors"
              >
                <Rss size={15} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#4D2C9C] hover:text-white transition-colors"
              >
                <Globe size={15} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#4D2C9C] hover:text-white transition-colors"
              >
                <Share2 size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-neutral-400 hover:text-[#9D6EFF] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                "Exterior Wash",
                "Paint Protection",
                "Interior Care",
                "Glass Care",
                "Engine Care",
                "Accessories",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href="/products"
                    className="text-neutral-400 hover:text-[#9D6EFF] transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2 text-neutral-400">
                <Mail
                  size={14}
                  className="mt-0.5 text-[#9D6EFF] flex-shrink-0"
                />
                <span>support@detale.in</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-400">
                <Phone
                  size={14}
                  className="mt-0.5 text-[#9D6EFF] flex-shrink-0"
                />
                <span>+91 98765 43210</span>
              </li>
              {/* <li className="flex items-start gap-2 text-neutral-400">
                <MapPin size={14} className="mt-0.5 text-[#9D6EFF] flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Detale. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-neutral-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-neutral-300 transition-colors">
              Shipping & Refund
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
