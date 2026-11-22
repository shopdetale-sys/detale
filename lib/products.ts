export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  description: string;
  features: string[];
  category: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Car Wash Shampoo",
    slug: "premium-car-wash-shampoo",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 234,
    image: "/products/product-1.jpg",
    badge: "Best Seller",
    description:
      "Ultra-concentrated pH-balanced car wash shampoo that gently lifts dirt and grime without stripping wax or sealant protection. Produces a rich, luxurious foam for a scratch-free wash.",
    features: [
      "pH balanced formula",
      "Safe on wax & ceramic coatings",
      "1 bottle makes up to 50 washes",
      "Streak-free finish",
    ],
    category: "Exterior Wash",
    inStock: true,
  },
  {
    id: "2",
    name: "Ceramic Spray Coating",
    slug: "ceramic-spray-coating",
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 189,
    image: "/products/product-2.jpg",
    badge: "New",
    description:
      "Professional-grade SiO2 ceramic spray coating that bonds to your paint for up to 12 months of hydrophobic protection. Easy spray-and-wipe application.",
    features: [
      "12-month protection",
      "9H hardness rating",
      "Hydrophobic water beading",
      "UV protection",
    ],
    category: "Paint Protection",
    inStock: true,
  },
  {
    id: "3",
    name: "Interior Dashboard Cleaner",
    slug: "interior-dashboard-cleaner",
    price: 399,
    rating: 4.6,
    reviews: 312,
    image: "/products/product-3.jpg",
    description:
      "Non-greasy interior cleaner that safely cleans and conditions all plastic, vinyl, and rubber surfaces. Leaves a natural matte finish without sticky residue.",
    features: [
      "Non-greasy matte finish",
      "Protects against UV cracking",
      "Safe on all interior plastics",
      "Pleasant fresh scent",
    ],
    category: "Interior Care",
    inStock: true,
  },
  {
    id: "4",
    name: "Microfiber Detailing Cloth Set",
    slug: "microfiber-detailing-cloth-set",
    price: 849,
    originalPrice: 999,
    rating: 4.7,
    reviews: 456,
    image: "/products/product-4.jpg",
    badge: "Top Rated",
    description:
      "Set of 10 premium 400 GSM microfiber cloths for scratch-free detailing. Color-coded for different tasks — paint, glass, interior, and wheels.",
    features: [
      "400 GSM ultra-plush",
      "10-piece color-coded set",
      "Machine washable 500+ times",
      "Lint and scratch free",
    ],
    category: "Accessories",
    inStock: true,
  },
  {
    id: "5",
    name: "Tire Shine & Dressing",
    slug: "tire-shine-dressing",
    price: 449,
    rating: 4.5,
    reviews: 198,
    image: "/products/product-5.jpg",
    description:
      "Water-based tire dressing that delivers a rich, deep gloss with no sling. Long-lasting formula resists rain and road grime for weeks.",
    features: [
      "Water-based, no sling",
      "Deep gloss finish",
      "Lasts 4–6 weeks",
      "UV & ozone protection",
    ],
    category: "Exterior Care",
    inStock: true,
  },
  {
    id: "6",
    name: "Glass Cleaner Pro",
    slug: "glass-cleaner-pro",
    price: 349,
    rating: 4.8,
    reviews: 267,
    image: "/products/product-6.jpg",
    badge: "Popular",
    description:
      "Streak-free glass cleaner formulated for automotive glass. Removes road film, haze, and fingerprints from windshields, windows, and mirrors.",
    features: [
      "100% streak-free",
      "Safe on tinted glass",
      "Removes water spots",
      "Anti-fog formula",
    ],
    category: "Glass Care",
    inStock: true,
  },
  {
    id: "7",
    name: "Engine Bay Degreaser",
    slug: "engine-bay-degreaser",
    price: 699,
    originalPrice: 899,
    rating: 4.6,
    reviews: 143,
    image: "/products/product-7.jpg",
    description:
      "Heavy-duty water-soluble degreaser that cuts through oil, grease, and grime in the engine bay. Safe for use on all engine bay surfaces.",
    features: [
      "Water-soluble & eco-safe",
      "Works in 60 seconds",
      "Safe on plastics & rubber",
      "Biodegradable formula",
    ],
    category: "Engine Care",
    inStock: false,
  },
  {
    id: "8",
    name: "Clay Bar Kit",
    slug: "clay-bar-kit",
    price: 1199,
    rating: 4.9,
    reviews: 321,
    image: "/products/product-8.jpg",
    badge: "Pro Pick",
    description:
      "Complete clay bar decontamination kit including 2 clay bars, clay lubricant, and microfiber towel. Remove embedded contamination for ultra-smooth paint.",
    features: [
      "2× 100g clay bars",
      "500ml clay lubricant included",
      "Removes rail dust & tar",
      "Professional detailer's choice",
    ],
    category: "Paint Decontamination",
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badge);
}
