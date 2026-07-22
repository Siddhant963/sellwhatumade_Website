"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Truck, Star, RotateCcw, XCircle, ChevronRight, Package, Loader2, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { statusMeta, groupOrdersByCheckout } from "@/lib/orders";
import { formatPaise, formatDate } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import type { Order, OrderStatus, PaginatedResult } from "@/lib/api/types";

const TAB_FILTERS: { key: string; statuses: OrderStatus[] | null }[] = [
  { key: "All", statuses: null },
  { key: "Active", statuses: ["confirmed", "processing", "shipped", "out_for_delivery"] },
  { key: "Delivered", statuses: ["delivered"] },
  { key: "Returns", statuses: ["return_requested", "return_approved", "returned", "refunded"] },
  { key: "Cancelled", statuses: ["cancelled", "payment_failed"] },
];

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf9f5]" />}>
      <OrdersList />
    </Suspense>
  );
}

function OrdersList() {
  const searchParams = useSearchParams();
  const justPlacedGroup = searchParams.get("placed") === "1" ? searchParams.get("group") : null;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResult<Order>>("/buyer/v1/orders", { query: { limit: 50 } });
      setOrders(res.data ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) void load();
    else setLoading(false);
  }, [authLoading, isAuthenticated, load]);

  const cancelOrder = async (id: string) => {
    setBusy(id);
    try {
      await api.post(`/buyer/v1/orders/${id}/cancel`, { reason: "Changed my mind" });
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  const activeFilter = TAB_FILTERS.find((t) => t.key === activeTab)!;
  const filtered = activeFilter.statuses
    ? orders.filter((o) => activeFilter.statuses!.includes(o.status))
    : orders;
  const groups = groupOrdersByCheckout(filtered);

  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <Package size={48} className="text-[#d8c3b4] mb-4" />
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Sign in to view your orders</h1>
          <Link href="/login?next=/orders" className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
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
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">My Orders</h1>
            <p className="text-sm text-[#857467] mt-1">Track and manage your craft purchases</p>
          </div>

          {justPlacedGroup && (
            <div className="mb-6 flex items-center gap-3 bg-[#97f3b5]/20 border border-[#97f3b5] rounded-2xl px-5 py-4">
              <CheckCircle size={20} className="text-[#006d3d]" />
              <p className="text-sm font-semibold text-[#006d3d]">
                Order placed! The artisan{groups.find((g) => g[0]?.orderGroupId === justPlacedGroup)?.length !== 1 ? "s" : ""} will begin crafting your piece shortly.
              </p>
            </div>
          )}

          <div className="flex gap-1 overflow-x-auto pb-1 mb-6 no-scrollbar">
            {TAB_FILTERS.map(({ key }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === key
                    ? "bg-[#8d4f11] text-white"
                    : "bg-white text-[#534439] border border-[#e4e2de] hover:border-[#f4a460]"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-[#857467]">
              <Loader2 className="animate-spin mr-2" /> Loading orders…
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package size={48} className="text-[#d8c3b4] mb-4" />
              <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">No orders here yet</h2>
              <p className="text-[#857467] mb-6">When you place an order it will appear here.</p>
              <Link href="/marketplace" className="px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {groups.map((group) => {
                if (group.length === 1) {
                  return <OrderCard key={group[0]!._id} order={group[0]!} busy={busy} onCancel={cancelOrder} />;
                }
                const groupTotalPaise = group.reduce((sum, o) => sum + o.totalPaise, 0);
                return (
                  <div key={group[0]!.orderGroupId} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1 flex-wrap gap-2">
                      <p className="text-sm font-semibold text-[#534439]">
                        Placed together {formatDate(group[0]!.createdAt)} · {group.length} vendors
                      </p>
                      <p className="text-sm font-bold text-[#1b1c1a]">{formatPaise(groupTotalPaise)}</p>
                    </div>
                    <div className="flex flex-col gap-3 pl-3 border-l-2 border-[#e4e2de]">
                      {group.map((order) => (
                        <OrderCard key={order._id} order={order} busy={busy} onCancel={cancelOrder} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function OrderCard({
  order,
  busy,
  onCancel,
}: {
  order: Order;
  busy: string | null;
  onCancel: (id: string) => void;
}) {
  const cfg = statusMeta(order.status);
  const Icon = cfg.icon;
  const first = order.items[0];
  const extra = order.items.length - 1;
  return (
    <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0ede9]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#534439]">#{order.orderNumber}</span>
          <span className="text-xs text-[#857467]">{formatDate(order.createdAt)}</span>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}>
          <Icon size={12} className={cfg.color} />
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center gap-4 p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={first?.image || PLACEHOLDER_IMAGE}
          alt={first?.name || "Order item"}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1b1c1a] text-sm leading-snug line-clamp-1">
            {first?.name}
            {extra > 0 && <span className="text-[#857467] font-normal"> +{extra} more</span>}
          </h3>
          <p className="text-xs text-[#857467] mt-1">
            {order.items.length} {order.items.length === 1 ? "item" : "items"} · {formatPaise(order.totalPaise)}
          </p>
          {order.deliveredAt && (
            <p className="text-xs text-[#006d3d] mt-1">Delivered on {formatDate(order.deliveredAt)}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 px-5 pb-4 flex-wrap">
        {(order.status === "shipped" || order.status === "out_for_delivery") && (
          <Link
            href={`/orders/${order._id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#8d4f11] text-white text-xs font-semibold rounded-xl hover:bg-[#6e3900] transition-colors"
          >
            <Truck size={13} />
            Track Order
          </Link>
        )}
        {order.status === "delivered" && (
          <>
            <Link
              href={`/product/${first?.productId}#review`}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#8d4f11] text-white text-xs font-semibold rounded-xl hover:bg-[#6e3900] transition-colors"
            >
              <Star size={13} />
              Write Review
            </Link>
            <Link
              href={`/returns?order=${order._id}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#d8c3b4] text-[#534439] text-xs font-semibold rounded-xl hover:border-[#f4a460] transition-colors"
            >
              <RotateCcw size={13} />
              Return
            </Link>
          </>
        )}
        {(order.status === "confirmed" || order.status === "processing" || order.status === "pending_payment") && (
          <button
            onClick={() => onCancel(order._id)}
            disabled={busy === order._id}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#d8c3b4] text-[#534439] text-xs font-semibold rounded-xl hover:border-red-300 transition-colors disabled:opacity-50"
          >
            <XCircle size={13} />
            Cancel Order
          </button>
        )}
        <Link
          href={`/orders/${order._id}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#d8c3b4] text-[#534439] text-xs font-semibold rounded-xl hover:border-[#f4a460] transition-colors ml-auto"
        >
          Details
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
