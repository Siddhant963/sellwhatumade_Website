"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ShoppingBag, TrendingUp, Shield, Clock, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { statusMeta } from "@/lib/orders";
import { formatPaise, formatDate } from "@/lib/format";
import type { Order, PaginatedResult, SellerProfile } from "@/lib/api/types";

export default function AdminDashboard() {
  const { ready } = useRequireRole(["admin"]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [pendingKyc, setPendingKyc] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    setLoading(true);
    Promise.allSettled([
      api.get<PaginatedResult<Order>>("/api/v1/admin/orders", { query: { limit: 50 } }),
      api.get<PaginatedResult<SellerProfile>>("/api/v1/admin/sellers", { query: { limit: 100 } }),
      api.get<PaginatedResult<SellerProfile>>("/api/v1/admin/sellers/kyc/pending", { query: { limit: 100 } }),
    ]).then(([o, s, k]) => {
      if (!active) return;
      if (o.status === "fulfilled") { setOrders(o.value.data ?? []); setOrdersTotal(o.value.total ?? 0); }
      if (s.status === "fulfilled") setSellers(s.value.data ?? []);
      if (k.status === "fulfilled") setPendingKyc(k.value.total ?? (k.value.data?.length ?? 0));
      setLoading(false);
    });
    return () => { active = false; };
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  const gmv = orders.reduce((sum, o) => sum + (o.totalPaise ?? 0), 0);
  const activeSellers = sellers.filter((s) => s.isActive !== false).length;

  const kpis = [
    { icon: Shield, label: "Active Sellers", value: String(activeSellers), color: "text-[#8d4f11]", bg: "bg-[#8d4f11]/10" },
    { icon: ShoppingBag, label: "Total Orders", value: ordersTotal.toLocaleString("en-IN"), color: "text-[#006d3d]", bg: "bg-[#006d3d]/10" },
    { icon: TrendingUp, label: "GMV (recent)", value: formatPaise(gmv), color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Clock, label: "Pending KYC", value: String(pendingKyc), color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Admin Dashboard</h1>
            <p className="text-sm text-[#857467] mt-1">Platform overview</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl shadow-artisan p-5">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-xs text-[#857467]">{label}</p>
                <p className="text-xl font-bold text-[#1b1c1a] mt-0.5">{loading ? "…" : value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f0ede9] flex items-center justify-between">
              <h2 className="font-semibold text-[#1b1c1a]">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#8d4f11] font-semibold hover:underline">View All</Link>
            </div>
            {loading ? (
              <div className="py-12 text-center text-[#857467]"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-[#857467]">No orders yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0ede9]">
                    {["Order", "Buyer", "Date", "Amount", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => {
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
