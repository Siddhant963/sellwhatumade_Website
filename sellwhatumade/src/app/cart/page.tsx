"use client";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShieldCheck, Truck, RotateCcw, Tag, ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import { formatPaise } from "@/lib/format";

export default function CartPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart, loading, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [busyItem, setBusyItem] = useState<string | null>(null);

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  const changeQty = async (productId: string, qty: number) => {
    setBusyItem(productId);
    try {
      await updateQuantity(productId, Math.max(1, qty));
    } finally {
      setBusyItem(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setBusyItem(productId);
    try {
      await removeItem(productId);
    } finally {
      setBusyItem(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponBusy(true);
    setCouponError(null);
    try {
      await applyCoupon(coupon.trim());
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : "Invalid coupon.");
    } finally {
      setCouponBusy(false);
    }
  };

  // Guest / empty states ------------------------------------------------------
  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <ShoppingBag size={48} className="text-[#d8c3b4] mb-4" />
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Sign in to view your cart</h1>
          <p className="text-[#857467] mb-6">Your cart is saved to your account.</p>
          <Link href="/login?next=/cart" className="px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
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
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Shopping Cart</h1>
            <p className="text-sm text-[#857467] mt-1">
              {items.length} {items.length === 1 ? "item" : "items"} from artisan workshops
            </p>
          </div>

          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center py-24 text-[#857467]">
              <Loader2 className="animate-spin mr-2" /> Loading your cart…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag size={48} className="text-[#d8c3b4] mb-4" />
              <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Your cart is empty</h2>
              <p className="text-[#857467] mb-6">Discover handcrafted treasures from across India.</p>
              <Link href="/marketplace" className="px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
                Browse marketplace
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Items */}
              <div className="flex-1 flex flex-col gap-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantSku ?? ""}`} className="bg-white rounded-2xl p-5 shadow-artisan flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || PLACEHOLDER_IMAGE}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/product/${item.productId}`} className="font-semibold text-[#1b1c1a] text-sm leading-snug hover:text-[#8d4f11]">
                            {item.name}
                          </Link>
                          {item.variantSku && (
                            <p className="text-xs text-[#857467] mt-0.5">Variant: {item.variantSku}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          disabled={busyItem === item.productId}
                          className="text-[#857467] hover:text-red-500 transition-colors shrink-0 disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1b1c1a]">
                            {formatPaise(item.pricePaise * item.quantity)}
                          </span>
                          {item.mrpPaise > item.pricePaise && (
                            <span className="text-xs text-[#857467] line-through">
                              {formatPaise(item.mrpPaise * item.quantity)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 bg-[#f7f4f0] rounded-xl px-1 py-1">
                          <button
                            onClick={() => changeQty(item.productId, item.quantity - 1)}
                            disabled={busyItem === item.productId || item.quantity <= 1}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40"
                          >
                            <Minus size={13} className="text-[#534439]" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-[#1b1c1a]">{item.quantity}</span>
                          <button
                            onClick={() => changeQty(item.productId, item.quantity + 1)}
                            disabled={busyItem === item.productId}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40"
                          >
                            <Plus size={13} className="text-[#534439]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { icon: ShieldCheck, text: "Authenticity Guaranteed" },
                    { icon: Truck, text: "Free shipping over ₹499" },
                    { icon: RotateCcw, text: "Easy 7-day returns" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm">
                      <Icon size={15} className="text-[#006d3d] shrink-0" />
                      <span className="text-xs text-[#534439] font-medium leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:w-80 shrink-0">
                <div className="bg-white rounded-2xl shadow-artisan p-6 sticky top-24">
                  <h2 className="font-bold text-[#1b1c1a] text-base mb-5">Order Summary</h2>

                  {/* Coupon */}
                  {cart?.couponCode ? (
                    <div className="flex items-center justify-between mb-5 px-3 py-2.5 bg-[#97f3b5]/15 border border-[#97f3b5]/40 rounded-xl">
                      <span className="text-sm font-medium text-[#006d3d]">Coupon {cart.couponCode} applied</span>
                      <button onClick={() => removeCoupon()} className="text-xs text-[#857467] hover:text-red-500">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="mb-5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
                          <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Coupon code"
                            className="w-full pl-8 pr-3 py-2.5 text-sm bg-[#f7f4f0] border border-transparent rounded-xl focus:outline-none focus:border-[#f4a460]"
                          />
                        </div>
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponBusy}
                          className="px-4 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors disabled:opacity-60"
                        >
                          {couponBusy ? "…" : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-[#ba1a1a] mt-1.5">{couponError}</p>}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between text-[#534439]">
                      <span>Subtotal ({summary?.itemCount ?? items.length} items)</span>
                      <span>{formatPaise(summary?.subtotalPaise)}</span>
                    </div>
                    {(summary?.couponDiscountPaise ?? 0) > 0 && (
                      <div className="flex justify-between text-[#006d3d]">
                        <span>Coupon discount</span>
                        <span>−{formatPaise(summary?.couponDiscountPaise)}</span>
                      </div>
                    )}
                    {(summary?.coinDiscountPaise ?? 0) > 0 && (
                      <div className="flex justify-between text-[#006d3d]">
                        <span>Haat coins</span>
                        <span>−{formatPaise(summary?.coinDiscountPaise)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#534439]">
                      <span>Shipping</span>
                      <span className={(summary?.deliveryFeePaise ?? 0) === 0 ? "text-[#006d3d] font-medium" : ""}>
                        {(summary?.deliveryFeePaise ?? 0) === 0 ? "FREE" : formatPaise(summary?.deliveryFeePaise)}
                      </span>
                    </div>
                    <div className="h-px bg-[#e4e2de] my-1" />
                    <div className="flex justify-between font-bold text-[#1b1c1a] text-base">
                      <span>Total</span>
                      <span>{formatPaise(summary?.totalPaise)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn-press flex items-center justify-center gap-2 w-full py-4 mt-5 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors"
                  >
                    Proceed to Checkout
                    <ChevronRight size={16} />
                  </Link>

                  <p className="text-center text-xs text-[#857467] mt-3">
                    Secure checkout · All payments encrypted
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
