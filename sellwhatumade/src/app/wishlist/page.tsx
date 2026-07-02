"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { productToCard } from "@/lib/mappers";
import type { Product } from "@/lib/api/types";

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let active = true;
    api
      .get<Product[]>("/buyer/v1/wishlist")
      .then((list) => active && setProducts(list))
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated]);

  // Reflect removals made from any ProductCard heart button instantly.
  const items = products.filter((p) => ids.has(p._id));

  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Sign in to see your wishlist</h1>
          <Link href="/login?next=/wishlist" className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            Sign in
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">My Wishlist</h1>
            <p className="text-sm text-[#857467] mt-1">{items.length} saved items</p>
          </div>

          {loading || authLoading ? (
            <div className="flex items-center justify-center py-32 text-[#857467]">
              <Loader2 className="animate-spin mr-2" /> Loading wishlist…
            </div>
          ) : items.length === 0 ? (
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
              {items.map((p) => (
                <ProductCard key={p._id} product={productToCard(p)} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
