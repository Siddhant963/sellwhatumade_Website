"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import SellerSidebar from "@/components/SellerSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { statusMeta } from "@/lib/orders";
import { formatPaise, formatDate } from "@/lib/format";
import type { Order, OrderStatus, PaginatedResult } from "@/lib/api/types";

const TABS: { key: string; statuses: OrderStatus[] | null }[] = [
  { key: "All", statuses: null },
  { key: "New", statuses: ["confirmed"] },
  { key: "Processing", statuses: ["processing"] },
  { key: "Shipped", statuses: ["shipped", "out_for_delivery"] },
  { key: "Delivered", statuses: ["delivered"] },
];

// Next-status action available for each current status.
const NEXT_ACTION: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  confirmed: { label: "Start Processing", next: "processing" },
  processing: { label: "Mark Shipped", next: "shipped" },
  shipped: { label: "Mark Delivered", next: "delivered" },
};

export default function SellerOrdersPage() {
  const { ready } = useRequireRole(["seller", "admin"]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResult<Order>>("/seller/v1/orders", { query: { limit: 100 } });
      setOrders(res.data ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  const advance = async (order: Order) => {
    const action = NEXT_ACTION[order.status];
    if (!action) return;
    setBusy(order._id);
    try {
      if (action.next === "shipped") {
        const tracking = prompt("Enter tracking number (auto-marks as Shipped):");
        if (!tracking) {
          setBusy(null);
          return;
        }
        await api.patch(`/seller/v1/orders/${order._id}/tracking`, {
          trackingNumber: tracking,
          shippingProvider: "Courier",
        });
      } else {
        await api.patch(`/seller/v1/orders/${order._id}/status`, { status: action.next });
      }
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length };
    for (const t of TABS) {
      if (t.statuses) c[t.key] = orders.filter((o) => t.statuses!.includes(o.status)).length;
    }
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.key === activeTab)!;
    return orders.filter((o) => {
      if (tab.statuses && !tab.statuses.includes(o.status)) return false;
      if (search) {
        const hay = `${o.orderNumber} ${o.shippingAddress?.recipientName ?? ""} ${o.items.map((i) => i.name).join(" ")}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [orders, activeTab, search]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex">
      <SellerSidebar />
      <div className="flex-1 ml-56 px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1b1c1a]">Manage Orders</h1>
          <p className="text-sm text-[#857467] mt-1">
            Track your handcrafted masterpieces from the loom to your customer&apos;s doorstep.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border-b border-[#efeeea]">
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {TABS.map(({ key }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === key ? "bg-[#8d4f11] text-white" : "text-[#534439] hover:bg-[#f5f3ef]"
                  }`}
                >
                  {key}
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === key ? "bg-white/20 text-white" : "bg-[#efeeea] text-[#857467]"
                  }`}>
                    {counts[key] ?? 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm bg-[#f5f3ef] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f3ef]">
                  {["Order", "Items", "Customer", "Status", "Amount", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#857467] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f3ef]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-[#857467] text-sm">
                      <Loader2 className="animate-spin inline mr-2" /> Loading orders…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-[#857467] text-sm">No orders found.</td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const cfg = statusMeta(order.status);
                    const action = NEXT_ACTION[order.status];
                    return (
                      <tr key={order._id} className="hover:bg-[#fbf9f5] transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-[#8d4f11]">{order.orderNumber}</span>
                          <p className="text-[11px] text-[#857467]">{formatDate(order.createdAt)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-[#1b1c1a] line-clamp-1 max-w-48">{order.items[0]?.name}</p>
                          <p className="text-xs text-[#857467]">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-[#1b1c1a]">{order.shippingAddress?.recipientName}</p>
                          <p className="text-xs text-[#857467]">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${cfg.color} ${cfg.bg}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-[#1b1c1a]">{formatPaise(order.totalPaise)}</span>
                        </td>
                        <td className="px-5 py-4">
                          {action ? (
                            <button
                              onClick={() => advance(order)}
                              disabled={busy === order._id}
                              className="btn-press px-3.5 py-1.5 text-xs font-semibold bg-[#8d4f11] text-white rounded-xl hover:bg-[#6e3900] transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                              {busy === order._id ? "…" : action.label}
                            </button>
                          ) : (
                            <span className="text-xs text-[#857467]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
