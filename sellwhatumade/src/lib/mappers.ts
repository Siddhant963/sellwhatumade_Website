/**
 * Adapters from backend API entities to the shapes the existing UI components
 * expect. Keeps presentational components stable while the data source changes.
 */
import type { Product } from "@/lib/api/types";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='100%' height='100%' fill='%23efeeea'/><text x='50%' y='50%' font-family='sans-serif' font-size='28' fill='%23b9b3aa' text-anchor='middle' dominant-baseline='middle'>No image</text></svg>`,
  );

/** UI shape consumed by <ProductCard>. */
export interface CardProduct {
  id: string;
  name: string;
  price: number; // rupees
  originalPrice: number; // rupees
  rating: number;
  reviews: number;
  artisan: string;
  artisanLocation: string;
  category: string;
  image: string;
  badge: string;
  isNew: boolean;
  isFeatured: boolean;
  stock: number;
}

export interface ProductMeta {
  artisan?: string;
  location?: string;
  category?: string;
}

function isRecent(iso?: string): boolean {
  if (!iso) return false;
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return false;
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - created < fourteenDays;
}

export function productToCard(p: Product, meta: ProductMeta = {}): CardProduct {
  return {
    id: p._id,
    name: p.name,
    price: Math.round((p.pricePaise ?? 0) / 100),
    originalPrice: Math.round((p.mrpPaise ?? 0) / 100),
    rating: p.rating ?? 0,
    reviews: p.reviewCount ?? 0,
    artisan: meta.artisan ?? "",
    artisanLocation: meta.location ?? "",
    category: meta.category ?? p.tags?.[0] ?? p.materials?.[0] ?? "",
    image: p.images?.[0] || PLACEHOLDER_IMAGE,
    badge: p.isHandmade ? "Handmade" : "",
    isNew: isRecent(p.createdAt),
    isFeatured: !!p.isFeatured,
    stock: p.stock ?? 0,
  };
}

export { PLACEHOLDER_IMAGE };
