"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, BadgeCheck, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import type { CardProduct } from "@/lib/mappers";

export default function ProductCard({ product }: { product: CardProduct }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/product/${product.id}`)}`);
      return;
    }
    setWishlistBusy(true);
    try {
      await toggle(product.id);
    } catch {
      // surfaced elsewhere; keep card resilient
    } finally {
      setWishlistBusy(false);
    }
  };

  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/product/${product.id}`)}`);
      return;
    }
    setAdding(true);
    try {
      await addItem({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      // surfaced elsewhere; keep card resilient
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-artisan card-hover flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <Link href={`/product/${product.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-[#8d4f11] text-white text-[11px] font-semibold rounded-full">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-[#006d3d] text-white text-[11px] font-semibold rounded-full">
              {discount}% off
            </span>
          )}
          {product.stock > 0 && product.stock <= 3 && (
            <span className="px-2.5 py-1 bg-[#ba1a1a] text-white text-[11px] font-semibold rounded-full">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 bg-[#534439] text-white text-[11px] font-semibold rounded-full">
              Sold out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          disabled={wishlistBusy}
          className={`absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm disabled:opacity-60 ${
            wishlisted ? "text-[#ba1a1a] opacity-100" : "text-[#534439] hover:text-[#ba1a1a] opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={15} className={wishlisted ? "fill-[#ba1a1a]" : ""} />
        </button>

        {/* Category tag */}
        {product.category && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 bg-[#f4a460]/20 backdrop-blur-sm text-[#6e3900] text-[11px] font-semibold rounded-full border border-[#f4a460]/40">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Artisan */}
        {product.artisan && (
          <div className="flex items-center gap-1.5">
            <BadgeCheck size={13} className="text-[#006d3d] shrink-0" />
            <span className="text-xs text-[#534439] font-medium truncate">{product.artisan}</span>
            {product.artisanLocation && (
              <span className="text-xs text-[#857467]">· {product.artisanLocation}</span>
            )}
          </div>
        )}

        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-[#1b1c1a] text-[15px] leading-snug hover:text-[#8d4f11] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.round(product.rating)
                    ? "fill-[#f4a460] text-[#f4a460]"
                    : "fill-[#e4e2de] text-[#e4e2de]"
                }
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#534439]">{product.rating || "—"}</span>
          <span className="text-xs text-[#857467]">({product.reviews})</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#efeeea]">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#1b1c1a]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-xs text-[#857467] line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            className="btn-press flex items-center gap-1.5 px-3.5 py-2 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {adding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : added ? (
              <Check size={14} />
            ) : (
              <ShoppingCart size={14} />
            )}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
