"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Zap, Star, BadgeCheck, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/lib/data";

const wishlistProducts = products.slice(0, 4).map((p) => ({ ...p, wishlisted: true }));

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistProducts);
  const [sortBy, setSortBy] = useState("Recent");
  const [availableOnly, setAvailableOnly] = useState(false);

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = availableOnly ? items.filter((p) => p.stock > 0) : items;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">My Wishlist</h1>
              <p className="text-sm text-[#857467] mt-1">{items.length} saved items</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#8d4f11]"
                />
                <span className="text-sm text-[#534439] font-medium">Available Only</span>
              </label>
              <div className="flex items-center gap-2 bg-white border border-[#d8c3b4] rounded-xl px-3 py-2">
                <SlidersHorizontal size={13} className="text-[#857467]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm text-[#534439] bg-transparent focus:outline-none"
                >
                  {["Recent", "Price: Low to High", "Price: High to Low", "Rating"].map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Low stock alert */}
          {items.some((p) => p.stock <= 3) && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 mb-6">
              <Zap size={16} className="text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Heads up!</strong>{" "}
                {items.filter((p) => p.stock <= 3).length} items in your wishlist are running low on stock. Grab them before they&apos;re gone!
              </p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="text-[#d8c3b4] mx-auto mb-4" />
              <h2 className="text-lg font-bold text-[#1b1c1a] mb-2">Your wishlist is empty</h2>
              <p className="text-[#857467] mb-6">Start saving artisan crafts you love</p>
              <Link
                href="/marketplace"
                className="btn-press inline-block px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl hover:bg-[#6e3900] transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-artisan card-hover group">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.stock <= 3 && item.stock > 0 && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                        <Zap size={11} fill="white" />
                        Only {item.stock} left
                      </div>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-[#1b1c1a] text-white text-xs font-bold rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} className="text-[#857467] hover:text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-[#8d4f11] font-medium mb-1">
                      {item.artisan}
                      {item.badge === "Verified Artisan" && (
                        <BadgeCheck size={12} className="inline ml-1 fill-[#006d3d] text-white" />
                      )}
                    </p>
                    <h3 className="text-sm font-semibold text-[#1b1c1a] leading-snug line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Star size={12} className="fill-[#f4a460] text-[#f4a460]" />
                      <span className="text-xs font-bold text-[#534439]">{item.rating}</span>
                      <span className="text-xs text-[#857467]">({item.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-[#1b1c1a]">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-[#857467] line-through ml-1.5">
                            ₹{item.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      {item.originalPrice > item.price && (
                        <span className="text-xs font-bold text-[#006d3d] bg-[#006d3d]/10 px-2 py-0.5 rounded-full">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                        </span>
                      )}
                    </div>

                    <button
                      disabled={item.stock === 0}
                      className="btn-press flex items-center justify-center gap-2 w-full py-2.5 bg-[#8d4f11] hover:bg-[#6e3900] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      <ShoppingCart size={14} />
                      {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
