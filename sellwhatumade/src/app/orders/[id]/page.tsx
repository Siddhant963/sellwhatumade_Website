"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Package, Truck, MapPin, ArrowLeft, Loader2, CheckCircle, BadgeCheck, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { statusMeta } from "@/lib/orders";
import { formatPaise, formatDate } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import type { Order } from "@/lib/api/types";

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf9f5]" />}>
      <OrderDetail />
    </Suspense>
  );
}

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed") === "1";
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    let active = true;
    setLoading(true);
    api
      .get<Order>(`/buyer/v1/orders/${id}`)
      .then((o) => active && setOrder(o))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, authLoading, isAuthenticated]);

  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Sign in to view this order</h1>
          <Link href={`/login?next=/orders/${id}`} className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            Sign in
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 text-[#857467]">
          <Loader2 className="animate-spin mr-2" /> Loading order…
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Order not found</h1>
          <Link href="/orders" className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            Back to orders
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const cfg = statusMeta(order.status);
  const StatusIcon = cfg.icon;
  const addr = order.shippingAddress;
  const history = order.statusHistory ?? [];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-[#857467] hover:text-[#534439] mb-6">
            <ArrowLeft size={15} />
            Back to Orders
          </Link>

          {justPlaced && (
            <div className="mb-6 flex items-center gap-3 bg-[#97f3b5]/20 border border-[#97f3b5] rounded-2xl px-5 py-4">
              <CheckCircle size={20} className="text-[#006d3d]" />
              <p className="text-sm font-semibold text-[#006d3d]">
                Order placed! The artisan will begin crafting your piece shortly.
              </p>
            </div>
          )}

          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Order #{order.orderNumber}</h1>
              <p className="text-sm text-[#857467] mt-1">Placed {formatDate(order.createdAt)}</p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.color} ${cfg.bg}`}>
              <StatusIcon size={12} className={cfg.color} />
              {cfg.label}
            </span>
          </div>

          {order.orderGroupId && (
            <Link
              href={`/orders?group=${order.orderGroupId}`}
              className="inline-block mb-6 text-xs font-semibold text-[#8d4f11] hover:underline"
            >
              Part of a multi-vendor order — view all
            </Link>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Timeline + items */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-artisan p-6">
                <h2 className="font-bold text-[#1b1c1a] mb-6">Order Timeline</h2>
                {history.length === 0 ? (
                  <p className="text-sm text-[#857467]">No status updates yet.</p>
                ) : (
                  <div className="relative flex flex-col gap-0">
                    {history.map((step, i) => {
                      const sm = statusMeta(step.status);
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 bg-[#006d3d]">
                              <CheckCircle size={18} className="text-white" />
                            </div>
                            {i < history.length - 1 && <div className="w-0.5 h-12 bg-[#006d3d]" />}
                          </div>
                          <div className="pb-8 flex-1">
                            <p className="text-sm font-semibold text-[#1b1c1a]">{sm.label}</p>
                            <p className="text-xs text-[#006d3d] mt-0.5">{formatDate(step.timestamp)}</p>
                            {step.note && <p className="text-xs text-[#857467] mt-0.5">{step.note}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="mt-2 bg-[#f7f4f0] rounded-xl p-4">
                    <p className="text-xs text-[#857467] font-medium uppercase tracking-wide mb-1">Courier Partner</p>
                    <p className="text-sm font-bold text-[#1b1c1a]">{order.shippingProvider || "Courier"}</p>
                    <p className="text-xs text-[#534439] mt-0.5">Tracking ID: {order.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-artisan p-6">
                <h2 className="font-bold text-[#1b1c1a] mb-4">Items ({order.items.length})</h2>
                <div className="flex flex-col gap-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image || PLACEHOLDER_IMAGE} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.productId}`} className="text-sm font-semibold text-[#1b1c1a] leading-snug hover:text-[#8d4f11]">
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#857467] mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#1b1c1a]">{formatPaise(item.totalPricePaise)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[#efeeea] flex flex-col gap-2 text-sm">
                  <Row label="Subtotal" value={formatPaise(order.subtotalPaise)} />
                  {(order.couponDiscountPaise ?? 0) > 0 && (
                    <Row label="Discount" value={`−${formatPaise(order.couponDiscountPaise)}`} accent />
                  )}
                  <Row
                    label="Shipping"
                    value={(order.deliveryFeePaise ?? 0) === 0 ? "Free" : formatPaise(order.deliveryFeePaise)}
                  />
                  <div className="flex justify-between pt-2 border-t border-[#efeeea] font-bold text-base">
                    <span className="text-[#1b1c1a]">Total</span>
                    <span className="text-[#8d4f11]">{formatPaise(order.totalPaise)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-72 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} className="text-[#8d4f11]" />
                  <h3 className="font-semibold text-[#1b1c1a] text-sm">Delivery Address</h3>
                </div>
                <p className="text-sm text-[#534439] leading-relaxed">
                  {addr.recipientName}<br />
                  {addr.line1}{addr.line2 ? <>, {addr.line2}</> : null}<br />
                  {addr.city}, {addr.state} {addr.pincode}<br />
                  {addr.phone}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck size={15} className="text-[#006d3d]" />
                  <h3 className="font-semibold text-[#1b1c1a] text-sm">Payment</h3>
                </div>
                <p className="text-sm text-[#534439] capitalize">{order.paymentStatus ?? "—"}</p>
              </div>

              {(order.status === "shipped" || order.status === "out_for_delivery") && (
                <div className="bg-white rounded-2xl shadow-artisan p-5 flex items-center gap-2 text-sm text-[#534439]">
                  <Truck size={16} className="text-[#8d4f11]" />
                  On the way to you
                </div>
              )}

              {order.status === "delivered" && (
                <Link
                  href={`/returns?orderId=${order._id}`}
                  className="btn-press flex items-center justify-center gap-2 py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-xl hover:border-[#f4a460] transition-colors"
                >
                  <RotateCcw size={15} />
                  Request Return
                </Link>
              )}

              <Link
                href="/help"
                className="btn-press flex items-center justify-center gap-2 py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-xl hover:border-[#f4a460] transition-colors"
              >
                <Package size={15} />
                Report an Issue
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#857467]">{label}</span>
      <span className={accent ? "text-[#006d3d]" : "text-[#534439]"}>{value}</span>
    </div>
  );
}
