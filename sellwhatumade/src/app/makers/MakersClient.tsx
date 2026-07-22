"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BadgeCheck, Search, Star, Package, MapPin, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api/client";
import type { PublicArtisan, PaginatedResult } from "@/lib/api/types";

const CATEGORIES = [
  { label: "All", term: "" },
  { label: "Textiles", term: "Textile" },
  { label: "Pottery", term: "Pottery" },
  { label: "Paintings", term: "Paint" },
  { label: "Metal Craft", term: "Metal" },
  { label: "Wood Craft", term: "Wood" },
];

const PLACEHOLDER = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80";

function MakerSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-artisan animate-pulse">
      <div className="h-28 bg-[#f0ede9] relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full bg-[#e4e2de] border-4 border-white" />
      </div>
      <div className="pt-14 px-5 pb-5 flex flex-col gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-[#e4e2de] rounded" />
          <div className="h-3 w-24 bg-[#f0ede9] rounded" />
          <div className="h-3 w-20 bg-[#f0ede9] rounded" />
        </div>
        <div className="h-10 bg-[#f7f4f0] rounded" />
        <div className="h-8 bg-[#f0ede9] rounded-xl" />
        <div className="h-9 bg-[#e4e2de] rounded-xl" />
      </div>
    </div>
  );
}

export default function MakersClient() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("");
  const [makers, setMakers] = useState<PublicArtisan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMakers = useCallback(
    async (p: number, replace: boolean) => {
      try {
        replace ? setLoading(true) : setLoadingMore(true);
        setError(null);
        const res = await api.get<PaginatedResult<PublicArtisan>>("/api/v1/artisans", {
          query: {
            page: p,
            limit: 9,
            ...(search ? { search } : {}),
            ...(activeCat ? { specialization: activeCat } : {}),
          },
        });
        setMakers((prev) => (replace ? res.data : [...prev, ...res.data]));
        setTotal(res.total);
        setPages(res.pages);
        setPage(p);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load makers.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search, activeCat],
  );

  // Re-fetch when search or category changes
  useEffect(() => {
    const t = setTimeout(() => fetchMakers(1, true), search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchMakers, search, activeCat]);

  const handleCat = (term: string) => {
    setActiveCat(term);
    setSearch("");
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        {/* Hero */}
        <section className="bg-[#1b1c1a] py-16 px-6 text-center">
          <p className="text-sm text-[#f4a460] font-semibold uppercase tracking-widest mb-3">The Makers</p>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            The Hands Behind Every Piece
          </h1>
          <p className="text-[#857467] text-lg max-w-xl mx-auto leading-relaxed">
            Each maker on our platform is a verified artisan preserving a traditional craft.
            Their stories are as beautiful as their work.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveCat("");
                }}
                placeholder="Search makers or craft..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(({ label, term }) => (
                <button
                  key={label}
                  onClick={() => handleCat(term)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-full border transition-colors ${
                    activeCat === term && !search
                      ? "bg-[#8d4f11] text-white border-[#8d4f11]"
                      : "bg-white text-[#534439] border-[#d8c3b4] hover:border-[#f4a460]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-8 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Results count */}
          {!loading && !error && (
            <p className="text-sm text-[#857467] mb-6">
              {total === 0
                ? "No makers found"
                : `Showing ${makers.length} of ${total} maker${total !== 1 ? "s" : ""}`}
            </p>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => <MakerSkeleton key={i} />)
              : makers.map((maker) => (
                  <div
                    key={maker.userId}
                    className="bg-white rounded-2xl overflow-hidden shadow-artisan card-hover"
                  >
                    {/* Cover */}
                    <div className="h-28 bg-gradient-to-br from-[#f4a460]/20 to-[#97f3b5]/10 relative">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={maker.avatar ?? PLACEHOLDER}
                            alt={`${maker.name}, ${maker.specialization || "artisan"} from ${maker.location || "India"}`}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-artisan"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                            }}
                          />
                          {maker.isVerified && (
                            <BadgeCheck
                              size={20}
                              className="absolute -bottom-1 -right-1 fill-[#006d3d] text-white"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-14 px-5 pb-5 flex flex-col gap-4 text-center">
                      <div>
                        <h3 className="font-bold text-[#1b1c1a] text-base">{maker.name}</h3>
                        <p className="text-sm text-[#8d4f11] font-medium">
                          {maker.specialization || maker.shopName}
                        </p>
                        {maker.location && (
                          <p className="text-xs text-[#857467] flex items-center justify-center gap-1 mt-1">
                            <MapPin size={11} />
                            {maker.location}
                          </p>
                        )}
                      </div>

                      {maker.story ? (
                        <blockquote className="text-xs text-[#534439] italic leading-relaxed border-l-2 border-[#f4a460] text-left pl-3 line-clamp-3">
                          &quot;{maker.story}&quot;
                        </blockquote>
                      ) : (
                        <div className="h-10" />
                      )}

                      <div className="flex justify-center gap-6 text-xs">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-[#f4a460] text-[#f4a460]" />
                          <span className="font-bold text-[#534439]">
                            {maker.rating > 0 ? maker.rating.toFixed(1) : "New"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package size={12} className="text-[#857467]" />
                          <span className="text-[#857467]">{maker.totalProducts} crafts</span>
                        </div>
                        {maker.yearsExperience > 0 && (
                          <span className="text-[#857467]">{maker.yearsExperience}y exp</span>
                        )}
                      </div>

                      <Link
                        href={`/artisan/${maker.userId}`}
                        className="btn-press w-full py-2.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        Shop Their Craft
                      </Link>
                    </div>
                  </div>
                ))}
          </div>

          {/* Empty state */}
          {!loading && !error && makers.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#857467] text-lg font-medium">No artisans found</p>
              <p className="text-sm text-[#857467] mt-2">
                Try a different search term or category.
              </p>
              <button
                onClick={() => { setSearch(""); setActiveCat(""); }}
                className="mt-4 text-sm text-[#8d4f11] font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Load more */}
          {!loading && page < pages && (
            <div className="mt-10 text-center">
              <button
                onClick={() => fetchMakers(page + 1, false)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-[#d8c3b4] text-sm font-semibold text-[#534439] rounded-2xl hover:border-[#f4a460] transition-colors disabled:opacity-60"
              >
                {loadingMore && <Loader2 size={15} className="animate-spin" />}
                {loadingMore ? "Loading…" : "Load more makers"}
              </button>
            </div>
          )}

          {/* Become a seller CTA */}
          <div className="mt-16 bg-[#8d4f11] rounded-3xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Are You an Artisan?</h2>
            <p className="text-[#ffdcc3] mb-6 max-w-md mx-auto">
              Join our community of verified makers and share your craft with the world.
            </p>
            <Link
              href="/seller/onboarding"
              className="btn-press inline-block px-8 py-3.5 bg-white text-[#8d4f11] font-bold rounded-2xl hover:bg-[#fbf9f5] transition-colors"
            >
              Start Selling Free →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
