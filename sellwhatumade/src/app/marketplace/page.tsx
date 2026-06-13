"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, Search, X, BadgeCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

const priceRanges = [
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "Over ₹5,000", min: 5000, max: Infinity },
];

const materials = ["Terracotta", "Hand-spun Silk", "Bamboo", "Brass", "Pashmina", "Teak Wood"];
const regions = ["Rajasthan", "West Bengal", "Karnataka", "Bihar", "Uttar Pradesh", "Kashmir"];
const sortOptions = ["Popularity", "Price: Low to High", "Price: High to Low", "Newest", "Top Rated"];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Popularity");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleMaterial = (m: string) =>
    setSelectedMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );

  const toggleRegion = (r: string) =>
    setSelectedRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const filteredProducts = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      if (p.price < range.min || p.price > range.max) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      {/* Trust badge */}
      <div className="flex items-center gap-2 p-3 bg-[#97f3b5]/15 border border-[#97f3b5]/40 rounded-xl">
        <BadgeCheck size={16} className="text-[#006d3d] shrink-0" />
        <span className="text-xs font-semibold text-[#006d3d]">Authentic Artisan Certified Platform</span>
      </div>

      {/* Price */}
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

      {/* Material */}
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

      {/* Region */}
      <div>
        <h3 className="text-sm font-semibold text-[#1b1c1a] mb-3 uppercase tracking-wide">Region</h3>
        <div className="flex flex-col gap-2">
          {regions.map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRegions.includes(r)}
                onChange={() => toggleRegion(r)}
                className="accent-[#8d4f11] w-4 h-4 rounded"
              />
              <span className="text-sm text-[#534439]">{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      {(selectedPriceRange !== null || selectedMaterials.length > 0 || selectedRegions.length > 0) && (
        <button
          onClick={() => {
            setSelectedPriceRange(null);
            setSelectedMaterials([]);
            setSelectedRegions([]);
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
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm text-[#857467] font-medium uppercase tracking-widest">Marketplace</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-[#1b1c1a]">
              Discover {sortedProducts.length.toLocaleString()} handcrafted treasures
            </h1>
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-[#1b1c1a] cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857467] pointer-events-none" />
            </div>
          </div>

          {/* Search bar */}
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

        {/* Mobile filter toggle */}
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
          {/* Sidebar Filters – desktop */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24 p-5 bg-white rounded-2xl border border-[#e4e2de] shadow-artisan">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={15} className="text-[#8d4f11]" />
                <h2 className="text-sm font-bold text-[#1b1c1a] uppercase tracking-wide">Refine</h2>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-24 text-[#857467]">
                <p className="text-lg font-medium">No products match your filters.</p>
                <p className="text-sm mt-1">Try adjusting or clearing your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              {[1, 2, 3, "...", 8].map((page, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                    page === 1
                      ? "bg-[#8d4f11] text-white"
                      : "bg-white border border-[#d8c3b4] text-[#534439] hover:border-[#f4a460]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
