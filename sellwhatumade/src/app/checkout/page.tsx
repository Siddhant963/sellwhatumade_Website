"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, BadgeCheck, Truck, RotateCcw, ShieldCheck, Loader2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";
import { api } from "@/lib/api/client";
import { formatPaise } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import { loadRazorpay, openRazorpay } from "@/lib/razorpay";
import type { CheckoutInitResponse, Order } from "@/lib/api/types";

const NEXT_PUBLIC_RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

const emptyAddress = {
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cart, refresh } = useCart();
  const [addr, setAddr] = useState(emptyAddress);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  const update = (key: keyof typeof addr) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr((a) => ({ ...a, [key]: e.target.value }));

  const canSubmit =
    addr.recipientName && addr.phone && addr.line1 && addr.city && addr.state && addr.pincode;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setPlacing(true);
    try {
      const init = await api.post<CheckoutInitResponse>("/buyer/v1/checkout", {
        shippingAddress: { ...addr, country: "India" },
        idempotencyKey: crypto.randomUUID(),
      });

      // Dev bypass: skip Razorpay modal and auto-confirm with fake payment data
      if (init.devBypass) {
        await api.post<Order>("/buyer/v1/checkout/verify-payment", {
          razorpayOrderId: init.razorpayOrderId,
          razorpayPaymentId: `pay_dev_${Date.now()}`,
          razorpaySignature: "dev_bypass_signature",
        });
        await refresh();
        router.push(`/orders/${init.orderId}?placed=1`);
        return;
      }

      const scriptOk = await loadRazorpay();
      if (!scriptOk) throw new Error("Could not load the payment gateway. Check your connection.");

      const opened = openRazorpay({
        key: init.razorpayKeyId || NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: init.totalPaise,
        currency: init.currency || "INR",
        name: "SellWhatUMade",
        description: init.orderNumber ? `Order ${init.orderNumber}` : "Artisan order",
        order_id: init.razorpayOrderId,
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: addr.phone,
        },
        theme: { color: "#8d4f11" },
        handler: async (resp) => {
          try {
            await api.post<Order>("/buyer/v1/checkout/verify-payment", {
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
            });
            await refresh();
            router.push(`/orders/${init.orderId}?placed=1`);
          } catch (verifyErr) {
            setError(verifyErr instanceof Error ? verifyErr.message : "Payment verification failed.");
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });

      if (!opened) {
        throw new Error("Payment gateway unavailable. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setPlacing(false);
    }
  };

  // Gate: must be signed in --------------------------------------------------
  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Sign in to check out</h1>
          <Link href="/login?next=/checkout" className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            Sign in
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Gate: empty cart ---------------------------------------------------------
  if (!authLoading && items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <ShoppingBag size={48} className="text-[#d8c3b4] mb-4" />
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Your cart is empty</h1>
          <Link href="/marketplace" className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            Browse marketplace
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
          <nav className="flex items-center gap-1.5 text-sm text-[#857467] mb-8">
            <Link href="/" className="hover:text-[#8d4f11]">Home</Link>
            <ChevronRight size={14} />
            <Link href="/cart" className="hover:text-[#8d4f11]">Cart</Link>
            <ChevronRight size={14} />
            <span className="text-[#534439] font-medium">Checkout</span>
          </nav>

          <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-8">
            {/* Left: Address */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-artisan flex flex-col gap-5">
                <h2 className="text-lg font-bold text-[#1b1c1a]">Delivery Address</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Recipient Name" value={addr.recipientName} onChange={update("recipientName")} placeholder="Arjun Sharma" required />
                  <Field label="Phone" value={addr.phone} onChange={update("phone")} placeholder="+91 98765 43210" required type="tel" />
                </div>

                <Field label="Address Line 1" value={addr.line1} onChange={update("line1")} placeholder="Flat 4B, Serenity Apartments, MG Road" required />
                <Field label="Address Line 2 (optional)" value={addr.line2} onChange={update("line2")} placeholder="Landmark, area" />

                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="City" value={addr.city} onChange={update("city")} placeholder="Mumbai" required />
                  <Field label="State" value={addr.state} onChange={update("state")} placeholder="Maharashtra" required />
                  <Field label="PIN Code" value={addr.pincode} onChange={update("pincode")} placeholder="400001" required />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-artisan">
                <h2 className="text-base font-bold text-[#1b1c1a] mb-4">
                  Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                </h2>

                <div className="flex flex-col gap-3 mb-5">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantSku ?? ""}`} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#efeeea]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image || PLACEHOLDER_IMAGE} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1b1c1a] line-clamp-2">{item.name}</p>
                        <p className="text-xs text-[#857467] mt-0.5">Qty {item.quantity}</p>
                        <p className="text-sm font-bold text-[#8d4f11] mt-1">{formatPaise(item.pricePaise * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 py-4 border-t border-[#efeeea] text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#857467]">Subtotal</span>
                    <span className="font-medium">{formatPaise(summary?.subtotalPaise)}</span>
                  </div>
                  {(summary?.couponDiscountPaise ?? 0) > 0 && (
                    <div className="flex justify-between text-[#006d3d]">
                      <span>Discount</span>
                      <span>−{formatPaise(summary?.couponDiscountPaise)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#857467]">Shipping</span>
                    <span className="font-medium text-[#006d3d]">
                      {(summary?.deliveryFeePaise ?? 0) === 0 ? "Free" : formatPaise(summary?.deliveryFeePaise)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#efeeea] text-base font-bold">
                    <span className="text-[#1b1c1a]">Total</span>
                    <span className="text-[#8d4f11]">{formatPaise(summary?.totalPaise)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || placing}
                  className="btn-press w-full py-4 mt-2 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {placing ? <Loader2 size={18} className="animate-spin" /> : null}
                  {placing ? "Processing…" : `Pay ${formatPaise(summary?.totalPaise)}`}
                </button>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-[#f5f3ef] rounded-2xl">
                {[
                  { icon: ShieldCheck, text: "Secure payments via Razorpay" },
                  { icon: Truck, text: "Pan-India delivery" },
                  { icon: RotateCcw, text: "3-day hassle-free returns" },
                  { icon: BadgeCheck, text: "All artisans authenticity verified" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-[#534439]">
                    <Icon size={14} className="text-[#006d3d] shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#f5f3ef] border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] focus:ring-2 focus:ring-[#f4a460]/20 text-sm placeholder:text-[#857467]"
      />
    </div>
  );
}
