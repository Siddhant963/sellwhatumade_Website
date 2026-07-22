import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import PricingClient from "./PricingClient";

const title = "Seller Pricing — Sell Handmade Crafts Online, Zero Setup Fee";
const description =
  "Simple, transparent pricing for artisans selling on SellWhatUMade. Start free, keep more of what you earn as you grow, and reach buyers across India who are vocal for local.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: { title, description, url: `${SITE_URL}/pricing` },
  twitter: { title, description },
};

export default function PricingPage() {
  return <PricingClient />;
}
