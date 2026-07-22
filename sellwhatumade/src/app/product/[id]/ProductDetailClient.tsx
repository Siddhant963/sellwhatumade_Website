"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star, ShoppingCart, Heart, BadgeCheck, ChevronRight,
  Truck, RotateCcw, ShieldCheck, Minus, Plus, Share2, Loader2, Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { productToCard, PLACEHOLDER_IMAGE } from "@/lib/mappers";
import { formatPaise, discountPercent } from "@/lib/format";
import type { PaginatedResult, Product, Review } from "@/lib/api/types";

export default function ProductDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundErr, setNotFoundErr] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [variantSku, setVariantSku] = useState<string | undefined>(undefined);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [shared, setShared] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFoundErr(false);
    (async () => {
      try {
        const p = await api.get<Product>(`/api/v1/products/${id}`);
        if (!active) return;
        setProduct(p);
        setActiveImage(0);
        // Fire-and-forget secondary loads.
        api
          .get<PaginatedResult<Review>>(`/api/v1/products/${id}/reviews`, { query: { limit: 6 } })
          .then((r) => active && setReviews(r.data ?? []))
          .catch(() => {});
        api
          .get<PaginatedResult<Product>>("/api/v1/products", {
            query: { categoryId: p.categoryId, limit: 5 },
          })
          .then((r) => active && setRelated((r.data ?? []).filter((x) => x._id !== p._id).slice(0, 4)))
          .catch(() => {});
      } catch (err) {
        if (active && err instanceof ApiError && err.status === 404) setNotFoundErr(true);
        else if (active) setNotFoundErr(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handleAdd = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/product/${id}`)}`);
      return false;
    }
    setActionError(null);
    setAdding(true);
    try {
      await addItem({ productId: id, quantity, variantSku });
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not add to cart.");
      return false;
    } finally {
      setAdding(false);
    }
  }, [isAuthenticated, router, id, quantity, variantSku, addItem]);

  const onAddToCart = async () => {
    const ok = await handleAdd();
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const onBuyNow = async () => {
    const ok = await handleAdd();
    if (ok) router.push("/checkout");
  };

  const onToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/product/${id}`)}`);
      return;
    }
    setWishlistBusy(true);
    try {
      await toggle(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update wishlist.");
    } finally {
      setWishlistBusy(false);
    }
  };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = { title: product?.name ?? "SellWhatUMade", url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // User cancelled the native share sheet — not an error.
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 text-[#857467]">
          <Loader2 className="animate-spin mr-2" /> Loading product…
        </main>
        <Footer />
      </>
    );
  }

  if (notFoundErr || !product) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Product not found</h1>
          <p className="text-[#857467] mb-6">This item may have been removed or is no longer available.</p>
          <Link href="/marketplace" className="px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            Browse marketplace
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const images = product.images?.length ? product.images : [PLACEHOLDER_IMAGE];
  const discount = discountPercent(product.mrpPaise, product.pricePaise);
  const hasVariants = product.variants?.length > 0;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-[#857467] mb-8">
            <Link href="/" className="hover:text-[#8d4f11] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace" className="hover:text-[#8d4f11] transition-colors">Marketplace</Link>
            <ChevronRight size={14} />
            <span className="text-[#534439] font-medium truncate max-w-48">{product.name}</span>
          </nav>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-[#efeeea] shadow-artisan-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                        i === activeImage ? "border-[#f4a460]" : "border-transparent hover:border-[#d8c3b4]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${product.name} — view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <BadgeCheck size={15} className="text-[#006d3d]" />
                <Link href={`/artisan/${product.sellerId}`} className="text-sm font-semibold text-[#534439] hover:text-[#8d4f11]">
                  View artisan storefront
                </Link>
              </div>

              <h1 className="text-3xl font-bold text-[#1b1c1a] leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(product.rating) ? "fill-[#f4a460] text-[#f4a460]" : "fill-[#e4e2de] text-[#e4e2de]"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#534439]">{product.rating || "—"}</span>
                <span className="text-sm text-[#857467]">({product.reviewCount} reviews)</span>
              </div>

              {product.isHandmade && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#97f3b5]/20 border border-[#97f3b5]/50 rounded-xl w-fit">
                  <BadgeCheck size={14} className="text-[#006d3d]" />
                  <span className="text-xs font-semibold text-[#006d3d]">Verified Handmade · Artisan Certified</span>
                </div>
              )}

              <p className="text-sm text-[#534439] leading-relaxed whitespace-pre-line">{product.description}</p>

              {product.materials?.length > 0 && (
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="font-semibold text-[#1b1c1a]">Material:</span>
                  {product.materials.map((m) => (
                    <span key={m} className="px-3 py-1 bg-[#f4a460]/15 text-[#6e3900] rounded-full font-medium">{m}</span>
                  ))}
                </div>
              )}

              {/* Variants */}
              {hasVariants && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#1b1c1a]">Options</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.sku}
                        onClick={() => setVariantSku(variantSku === v.sku ? undefined : v.sku)}
                        className={`px-3 py-2 text-sm rounded-xl border-2 transition-colors ${
                          variantSku === v.sku
                            ? "border-[#8d4f11] bg-[#8d4f11]/5 text-[#8d4f11] font-semibold"
                            : "border-[#d8c3b4] text-[#534439] hover:border-[#f4a460]"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-end gap-3 py-4 border-t border-b border-[#efeeea]">
                <span className="text-4xl font-bold text-[#1b1c1a]">{formatPaise(product.pricePaise)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-[#857467] line-through">{formatPaise(product.mrpPaise)}</span>
                    <span className="text-sm font-bold text-[#006d3d] bg-[#97f3b5]/20 px-2.5 py-1 rounded-full">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>

              {/* Quantity + Stock */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#534439]">Quantity</span>
                <div className="flex items-center gap-2 bg-[#efeeea] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 100, q + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6] px-2.5 py-1 rounded-full">
                    Only {product.stock} left!
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="text-xs font-semibold text-[#534439] bg-[#efeeea] px-2.5 py-1 rounded-full">
                    Out of stock
                  </span>
                )}
              </div>

              {actionError && <p className="text-sm text-[#ba1a1a]">{actionError}</p>}

              {/* CTAs */}
              <div className="flex gap-3">
                <button
                  onClick={onBuyNow}
                  disabled={adding || product.stock === 0}
                  className="btn-press flex-1 py-4 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  Buy It Now
                </button>
                <button
                  onClick={onAddToCart}
                  disabled={adding || product.stock === 0}
                  className="btn-press flex-1 py-4 border-2 border-[#006d3d] text-[#006d3d] hover:bg-[#97f3b5]/10 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {adding ? <Loader2 size={16} className="animate-spin" /> : added ? <Check size={16} /> : <ShoppingCart size={16} />}
                  {added ? "Added to Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={onToggleWishlist}
                  disabled={wishlistBusy}
                  title={isWishlisted(id) ? "Remove from wishlist" : "Add to wishlist"}
                  className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-60 ${
                    isWishlisted(id)
                      ? "border-[#ba1a1a] text-[#ba1a1a]"
                      : "border-[#d8c3b4] text-[#534439] hover:border-[#ba1a1a] hover:text-[#ba1a1a]"
                  }`}
                >
                  <Heart size={18} className={isWishlisted(id) ? "fill-[#ba1a1a]" : ""} />
                </button>
                <button
                  onClick={onShare}
                  title="Share this product"
                  className="w-14 h-14 border border-[#d8c3b4] rounded-2xl flex items-center justify-center text-[#534439] hover:border-[#8d4f11] hover:text-[#8d4f11] transition-colors shrink-0 relative"
                >
                  {shared ? <Check size={18} className="text-[#006d3d]" /> : <Share2 size={18} />}
                  {shared && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-[#1b1c1a] text-white px-2 py-1 rounded-full whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: "Secure Payment" },
                  { icon: Truck, label: `${product.deliveryDays}-Day Delivery` },
                  { icon: RotateCcw, label: "7-Day Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-[#f5f3ef] rounded-xl text-center">
                    <Icon size={18} className="text-[#006d3d]" />
                    <span className="text-xs font-medium text-[#534439]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#1b1c1a] mb-6">Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-[#857467]">No reviews yet. Be the first to review this product.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-[#f5f3ef] rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={13} className={j < review.rating ? "fill-[#f4a460] text-[#f4a460]" : "fill-[#e4e2de] text-[#e4e2de]"} />
                      ))}
                    </div>
                    {review.title && <p className="text-sm font-semibold text-[#1b1c1a]">{review.title}</p>}
                    {review.comment && <p className="text-sm text-[#534439] italic">&ldquo;{review.comment}&rdquo;</p>}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#efeeea] flex items-center justify-center text-xs font-bold text-[#8d4f11]">
                        {(review.userName || "U")[0]}
                      </div>
                      <span className="text-sm font-semibold text-[#1b1c1a]">{review.userName || "Verified buyer"}</span>
                      {review.isVerifiedPurchase && <BadgeCheck size={12} className="fill-[#006d3d] text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1b1c1a] mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p._id} product={productToCard(p)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
