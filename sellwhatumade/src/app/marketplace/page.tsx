import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import MarketplaceClient from "./MarketplaceClient";

const title = "Shop Handmade Crafts Online — Pottery, Textiles, Jewellery & More";
const description =
  "Browse thousands of authentic handcrafted products from rural Indian artisans — hand-woven textiles, terracotta pottery, folk paintings, wood and metal craft, and tribal jewellery. Vocal for Local, direct from the maker.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/marketplace` },
  openGraph: { title, description, url: `${SITE_URL}/marketplace` },
  twitter: { title, description },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
