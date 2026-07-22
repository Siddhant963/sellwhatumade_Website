import Link from "next/link";
import { Search, ArrowRight, ShieldCheck, Truck, RotateCcw, BadgeCheck, TrendingUp, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ArtisanCard from "@/components/ArtisanCard";
import TestimonialCard from "@/components/TestimonialCard";
import { categories, testimonials } from "@/lib/data";
import { serverFetchOrNull } from "@/lib/api/server";
import { productToCard } from "@/lib/mappers";
import { SITE_URL, DEFAULT_KEYWORDS } from "@/lib/seo";
import type { PaginatedResult, Product, PublicArtisan } from "@/lib/api/types";

interface PlatformStats {
  artisans: number;
  products: number;
  buyers: number;
  states: number;
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  return `${n}+`;
}

const title = "SellWhatUMade — Authentic Handcrafted Treasures from India";
const description =
  "Discover authentic handcrafted treasures from rural Indian artisans. Every purchase directly supports a maker and preserves a centuries-old craft. Vocal for Local, made in India.";

export const metadata = {
  title,
  description,
  keywords: DEFAULT_KEYWORDS,
  alternates: { canonical: SITE_URL },
  openGraph: { title, description, url: SITE_URL },
  twitter: { title, description },
};

export default async function HomePage() {
  const [featured, artisansRes, stats] = await Promise.all([
    serverFetchOrNull<PaginatedResult<Product>>(
      "/api/v1/products?sort=popular&limit=4",
      { cache: "no-store" },
    ),
    serverFetchOrNull<PaginatedResult<PublicArtisan>>(
      "/api/v1/artisans?limit=6",
      { cache: "no-store" },
    ),
    serverFetchOrNull<PlatformStats>("/api/v1/stats", { cache: "no-store" }),
  ]);
  const featuredProducts = (featured?.data ?? []).map((p) => productToCard(p));
  const allArtisans = artisansRes?.data ?? [];
  const withStory = allArtisans.filter((a) => a.story);
  const withoutStory = allArtisans.filter((a) => !a.story);
  const spotlightArtisans = [...withStory, ...withoutStory].slice(0, 3);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featuredProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/product/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <>
      {featuredProducts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#fbf9f5]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4a460]/8 via-transparent to-[#97f3b5]/6 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-2 w-fit px-4 py-2 bg-[#97f3b5]/20 border border-[#97f3b5]/50 rounded-full">
                <BadgeCheck size={15} className="text-[#006d3d]" />
                <span className="text-sm font-semibold text-[#006d3d]">
                  {stats ? formatStat(stats.artisans) : "1,240+"} Authentic Artisans
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#1b1c1a] leading-[1.15] tracking-tight">
                  Honoring the{" "}
                  <span className="text-[#8d4f11] relative">
                    Hands
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#f4a460]/60 rounded-full" />
                  </span>{" "}
                  that Create
                </h1>
                <p className="text-lg text-[#534439] leading-relaxed max-w-md">
                  Discover authentic handcrafted treasures from rural Indian artisans. Every purchase directly supports a maker and preserves a centuries-old craft.
                </p>
              </div>

              <form action="/marketplace" method="get" className="flex gap-2 bg-white border border-[#d8c3b4] rounded-2xl p-2 shadow-artisan max-w-lg">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search pottery, silk, wood craft..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-transparent focus:outline-none placeholder:text-[#857467] text-[#1b1c1a]"
                  />
                </div>
                <button type="submit" className="btn-press px-5 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap gap-4">
                {[
                  { icon: ShieldCheck, text: "Authenticity Guarantee" },
                  { icon: Truck, text: "Pan-India Delivery" },
                  { icon: RotateCcw, text: "7-Day Returns" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs font-medium text-[#534439]">
                    <Icon size={14} className="text-[#006d3d]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4 h-[500px]">
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden flex-1 shadow-artisan">
                  <img
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80"
                    alt="Hand-painted blue pottery from Jaipur, Rajasthan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden h-36 shadow-artisan">
                  <img
                    src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80"
                    alt="Hand-cast Dhokra brass craft from tribal Chhattisgarh artisans"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-8">
                <div className="rounded-2xl overflow-hidden h-36 shadow-artisan">
                  <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80"
                    alt="Hand-woven Banarasi silk textile from Varanasi weavers"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden flex-1 shadow-artisan">
                  <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
                    alt="Hand-painted Madhubani folk art from Bihar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="bg-[#1b1c1a] py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: stats ? formatStat(stats.artisans) : "1,240+", label: "Verified Artisans", icon: BadgeCheck, color: "text-[#f4a460]" },
                { value: stats ? formatStat(stats.products) : "18,500+", label: "Unique Products", icon: TrendingUp, color: "text-[#97f3b5]" },
                { value: stats ? formatStat(stats.buyers) : "42,000+", label: "Happy Buyers", icon: Users, color: "text-[#ffb77d]" },
                { value: stats ? `${stats.states} States` : "28 States", label: "Craft Regions", icon: ShieldCheck, color: "text-[#fc9f66]" },
              ].map(({ value, label, icon: Icon, color }) => (
                <div key={label} className="flex flex-col gap-2 text-center lg:text-left">
                  <Icon size={22} className={color} />
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="text-sm text-[#857467]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[#8d4f11] uppercase tracking-widest mb-2">Explore by Craft</p>
              <h2 className="text-3xl font-bold text-[#1b1c1a]">Crafts that Tell a Story</h2>
            </div>
            <Link href="/marketplace" className="flex items-center gap-1 text-sm font-semibold text-[#8d4f11] hover:gap-2 transition-all">
              View all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/marketplace?category=${cat.id}`}
                className="group flex flex-col gap-3 card-hover"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#efeeea] shadow-artisan">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#1b1c1a] leading-snug">{cat.name}</p>
                  <p className="text-xs text-[#857467]">{cat.count}+ items</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="bg-[#f5f3ef] py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-sm font-semibold text-[#8d4f11] uppercase tracking-widest mb-2">Handpicked</p>
                  <h2 className="text-3xl font-bold text-[#1b1c1a]">Featured Masterpieces</h2>
                </div>
                <Link href="/marketplace" className="flex items-center gap-1 text-sm font-semibold text-[#8d4f11] hover:gap-2 transition-all">
                  Browse all <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Artisan Spotlight */}
        {spotlightArtisans.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-[#8d4f11] uppercase tracking-widest mb-2">The Makers</p>
                <h2 className="text-3xl font-bold text-[#1b1c1a]">Stories Behind the Craft</h2>
              </div>
              <Link href="/makers" className="flex items-center gap-1 text-sm font-semibold text-[#8d4f11] hover:gap-2 transition-all">
                Meet all makers <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spotlightArtisans.map((artisan) => (
                <ArtisanCard key={artisan.userId} artisan={artisan} />
              ))}
            </div>
          </section>
        )}

        {/* Seller CTA */}
        <section className="bg-[#8d4f11] py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f4a460] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f4a460] rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <p className="text-[#ffb77d] text-sm font-semibold uppercase tracking-widest mb-3">Are you an artisan?</p>
            <h2 className="text-4xl font-bold text-white mb-5 leading-tight">
              Sell What You Made to the World
            </h2>
            <p className="text-[#ffdcc3] text-lg mb-8 leading-relaxed">
              Join {stats ? formatStat(stats.artisans) : "1,240+"} artisans who earn directly from their craft. No middlemen. Zero upfront cost. Your story, your price.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/seller/onboarding"
                className="btn-press px-8 py-4 bg-white text-[#8d4f11] font-bold rounded-2xl hover:bg-[#fbf9f5] transition-colors"
              >
                Start Selling Free →
              </Link>
              <Link
                href="/makers"
                className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-2xl hover:bg-white/10 transition-colors"
              >
                Meet the Makers
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#8d4f11] uppercase tracking-widest mb-2">Community Love</p>
            <h2 className="text-3xl font-bold text-[#1b1c1a]">What Our Buyers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
