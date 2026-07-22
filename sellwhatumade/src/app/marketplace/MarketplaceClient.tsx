"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Search, X, BadgeCheck, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api/client";
import { productToCard } from "@/lib/mappers";
import type { PaginatedResult, Product } from "@/lib/api/types";

const priceRanges = [
  { label: "Under ₹2,000", min: 0, max: 200000 },
  { label: "₹2,000 – ₹5,000", min: 200000, max: 500000 },
  { label: "Over ₹5,000", min: 500000, max: undefined as number | undefined },
];

const materials = ["Terracotta", "Silk", "Bamboo", "Brass", "Pashmina", "Teak Wood"];
const sortOptions = [
  { label: "Popularity", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
  { label: "Top Rated", value: "rating" },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(initialQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep the search box in sync if navbar passes a new ?q=
  useEffect(() => {
    setSearch(initialQuery);
    setDebouncedSearch(initialQuery);
  }, [initialQuery]);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedPriceRange, sortBy]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const range = selectedPriceRange !== null ? priceRanges[selectedPriceRange] : null;
    try {
      const res = await api.get<PaginatedResult<Product>>("/api/v1/products", {
        query: {
          page,
          limit: 12,
          q: debouncedSearch || undefined,
          sort: sortBy,
          minPrice: range?.min,
          maxPrice: range?.max,
        },
      });
      setProducts(res.data ?? []);
      setTotal(res.total ?? 0);
      setPages(res.pages ?? 1);
    } catch {
      setError("Could not load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortBy, selectedPriceRange]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleMaterial = (m: string) =>
    setSelectedMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  // Material filter is applied client-side on the current page (no API param).
  const visibleProducts = useMemo(() => {
    if (selectedMaterials.length === 0) return products;
    return products.filter((p) =>
      p.materials?.some((mat) =>
        selectedMaterials.some((sel) => mat.toLowerCase().includes(sel.toLowerCase())),
      ),
    );
  }, [products, selectedMaterials]);

  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 p-3 bg-[#97f3b5]/15 border border-[#97f3b5]/40 rounded-xl">
        <BadgeCheck size={16} className="text-[#006d3d] shrink-0" />
        <span className="text-xs font-semibold text-[#006d3d]">Authentic Artisan Certified Platform</span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#1b1c1a] mb-3 uppercase tracking-wide">Price Range</h3>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range, i) => (
            <label key={i} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selectedPriceRange === i}
                onChange={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                className="accent-[#8d4f11] w-4 h-4"
              />
              <span className="text-sm text-[#534439]">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#1b1c1a] mb-3 uppercase tracking-wide">Material</h3>
        <div className="flex flex-wrap gap-2">
          {materials.map((m) => (
            <button
              key={m}
              onClick={() => toggleMaterial(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                selectedMaterials.includes(m)
                  ? "bg-[#8d4f11] border-[#8d4f11] text-white"
                  : "bg-transparent border-[#d8c3b4] text-[#534439] hover:border-[#f4a460]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {(selectedPriceRange !== null || selectedMaterials.length > 0) && (
        <button
          onClick={() => {
            setSelectedPriceRange(null);
            setSelectedMaterials([]);
          }}
          className="flex items-center gap-1.5 text-sm text-[#8d4f11] font-medium"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm text-[#857467] font-medium uppercase tracking-widest">Marketplace</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-[#1b1c1a]">
              {loading ? "Discovering treasures…" : `Discover ${total.toLocaleString()} handcrafted treasures`}
            </h1>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-[#1b1c1a] cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857467] pointer-events-none" />
            </div>
          </div>

          <div className="relative max-w-md mt-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] focus:ring-2 focus:ring-[#f4a460]/20 placeholder:text-[#857467]"
            />
          </div>
        </div>

        <button
          className="md:hidden flex items-center gap-2 mb-6 px-4 py-2.5 bg-white border border-[#d8c3b4] rounded-xl text-sm font-medium text-[#534439]"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        {mobileFiltersOpen && (
          <div className="md:hidden mb-6 p-5 bg-white border border-[#d8c3b4] rounded-2xl shadow-artisan">
            <FilterPanel />
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24 p-5 bg-white rounded-2xl border border-[#e4e2de] shadow-artisan">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={15} className="text-[#8d4f11]" />
                <h2 className="text-sm font-bold text-[#1b1c1a] uppercase tracking-wide">Refine</h2>
              </div>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-24 text-[#857467]">
                <Loader2 className="animate-spin mr-2" /> Loading products…
              </div>
            ) : error ? (
              <div className="text-center py-24 text-[#ba1a1a]">
                <p className="text-lg font-medium">{error}</p>
                <button onClick={() => load()} className="mt-3 text-sm text-[#8d4f11] font-semibold">
                  Retry
                </button>
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="text-center py-24 text-[#857467]">
                <p className="text-lg font-medium">No products match your filters.</p>
                <p className="text-sm mt-1">Try adjusting or clearing your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleProducts.map((p) => (
                  <ProductCard key={p._id} product={productToCard(p)} />
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[#8d4f11] text-white"
                        : "bg-white border border-[#d8c3b4] text-[#534439] hover:border-[#f4a460]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function MarketplaceClient() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <MarketplaceContent />
    </Suspense>
  );
}
