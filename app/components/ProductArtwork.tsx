import type { Product } from "@/lib/products";

const artworkBySlug: Record<string, { icon: string; accent: string }> = {
  "premium-car-wash-shampoo": { icon: "🧴", accent: "#48b6a4" },
  "ceramic-spray-coating": { icon: "✨", accent: "#a78bfa" },
  "interior-dashboard-cleaner": { icon: "🧽", accent: "#f59e67" },
  "microfiber-detailing-cloth-set": { icon: "🧻", accent: "#5c9de6" },
  "tire-shine-dressing": { icon: "🛞", accent: "#a3a3a3" },
  "glass-cleaner-pro": { icon: "🪟", accent: "#55b8e9" },
  "engine-bay-degreaser": { icon: "⚙️", accent: "#e5a84b" },
  "clay-bar-kit": { icon: "🧼", accent: "#e781a6" },
};

const artworkByCategory: Record<string, { icon: string; accent: string }> = {
  "Exterior Wash": { icon: "🫧", accent: "#48b6a4" },
  "Paint Protection": { icon: "✨", accent: "#a78bfa" },
  "Interior Care": { icon: "🧽", accent: "#f59e67" },
  Accessories: { icon: "🧰", accent: "#5c9de6" },
  "Exterior Care": { icon: "🛞", accent: "#a3a3a3" },
  "Glass Care": { icon: "🪟", accent: "#55b8e9" },
  "Engine Care": { icon: "⚙️", accent: "#e5a84b" },
  "Paint Decontamination": { icon: "🧼", accent: "#e781a6" },
};

export default function ProductArtwork({ product }: { product: Product }) {
  const artwork =
    artworkBySlug[product.slug] ??
    artworkByCategory[product.category] ??
    { icon: "🧴", accent: "#a78bfa" };

  return (
    <div
      role="img"
      aria-label={`${product.name} product illustration`}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#24232a] via-[#17171b] to-[#101012]"
      style={{ "--artwork-accent": artwork.accent } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,var(--artwork-accent)_0%,transparent_58%)] opacity-20" />
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      <span className="relative z-10 select-none text-7xl drop-shadow-[0_12px_18px_rgba(0,0,0,0.65)] sm:text-8xl">
        {artwork.icon}
      </span>
      <span className="absolute bottom-5 left-1/2 h-2.5 w-24 -translate-x-1/2 rounded-full bg-black/70 blur-sm" />
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: artwork.accent }}
      />
    </div>
  );
}
