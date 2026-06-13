"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { statusMeta } from "@/lib/orders";
import { formatPaise, formatDate } from "@/lib/format";
import type { Order, OrderStatus, PaginatedResult } from "@/lib/api/types";

const STATUSES: OrderStatus[] = [
  "pending_payment", "confirmed", "processing", "shipped", "out_for_delivery",
  "delivered", "cancelled", "return_requested", "returned", "refunded",
];

export default function AdminOrdersPage() {
  const { ready } = useRequireRole(["admin"]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResult<Order>>("/api/v1/admin/orders", { query: { limit: 100 } });
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

  const updateStatus = async (id: string, status: OrderStatus) => {
    setBusy(id);
    try {
      await api.patch(`/api/v1/admin/orders/${id}/status`, { status });
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  const filtered = useMemo(
    () =>
      orders.filter((o) =>
        `${o.orderNumber} ${o.shippingAddress?.recipientName ?? ""}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [orders, search],
  );

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">All Orders</h1>
            <p className="text-sm text-[#857467] mt-1">{orders.length} orders across the platform</p>
          </div>

          <div className="bg-white rounded-2xl shadow-artisan p-4 mb-4">
            <div className="relative max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order # or recipient..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#fbf9f5] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-[#857467]"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-[#857467]">No orders found.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0ede9]">
                    {["Order", "Buyer", "Date", "Amount", "Status", "Override"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => {
                    const cfg = statusMeta(order.status);
                    return (
                      <tr key={order._id} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5]">
                        <td className="px-4 py-3.5 text-xs font-bold text-[#8d4f11]">{order.orderNumber}</td>
                        <td className="px-4 py-3.5 text-sm text-[#534439]">{order.shippingAddress?.recipientName}</td>
                        <td className="px-4 py-3.5 text-xs text-[#857467]">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-[#1b1c1a]">{formatPaise(order.totalPaise)}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            disabled={busy === order._id}
                            onChange={(e) => updateStatus(order._id, e.target.value as OrderStatus)}
                            className="text-xs bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#f4a460] disabled:opacity-50"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{statusMeta(s).label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
