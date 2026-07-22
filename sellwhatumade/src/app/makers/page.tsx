import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import MakersClient from "./MakersClient";

const title = "Meet India's Master Artisans — Rural Craftspeople & Makers";
const description =
  "Meet the rural Indian artisans behind SellWhatUMade — weavers, potters, painters, and craftspeople preserving centuries-old traditions. Discover their stories and shop directly from the maker.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/makers` },
  openGraph: { title, description, url: `${SITE_URL}/makers` },
  twitter: { title, description },
};

export default function MakersPage() {
  return <MakersClient />;
}
