import type { MetadataRoute } from "next";
import { serverFetchOrNull } from "@/lib/api/server";
import { SITE_URL } from "@/lib/seo";
import type { PaginatedResult, Product, PublicArtisan } from "@/lib/api/types";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/marketplace", priority: 0.9, changeFrequency: "daily" },
  { path: "/makers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" },
];

const PAGE_LIMIT = 100;
const MAX_PAGES = 10; // caps each collection at ~1,000 sitemap entries

/** Walks a paginated list endpoint, capped at MAX_PAGES. Returns whatever was
 *  fetched so far (possibly empty) if the backend is unreachable or errors. */
async function fetchAllPages<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await serverFetchOrNull<PaginatedResult<T>>(
        `${path}${path.includes("?") ? "&" : "?"}page=${page}&limit=${PAGE_LIMIT}`,
      );
      if (!res?.data?.length) break;
      items.push(...res.data);
      if (page >= res.pages) break;
    }
  } catch {
    // Backend unreachable/erroring at build time — ship the static routes only.
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [products, artisans] = await Promise.all([
    fetchAllPages<Product>("/api/v1/products"),
    fetchAllPages<PublicArtisan>("/api/v1/artisans"),
  ]);

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p._id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const artisanEntries: MetadataRoute.Sitemap = artisans.map((a) => ({
    url: `${SITE_URL}/artisan/${a.userId}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...artisanEntries];
}
