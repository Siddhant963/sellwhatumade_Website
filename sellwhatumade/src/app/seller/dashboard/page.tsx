"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, ShoppingBag, PlusCircle, BadgeCheck, TrendingUp, Eye, Loader2, Wallet, ArrowUpRight,
} from "lucide-react";
import SellerSidebar from "@/components/SellerSidebar";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { statusMeta } from "@/lib/orders";
import { formatPaise } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import type { EarningsDashboard, Order, PaginatedResult, Product } from "@/lib/api/types";

export default function SellerDashboardPage() {
  const { ready } = useRequireRole(["seller", "admin"]);
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsDashboard | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    setLoading(true);
    Promise.allSettled([
      api.get<EarningsDashboard>("/seller/v1/earnings/dashboard"),
      api.get<PaginatedResult<Product>>("/seller/v1/products", { query: { limit: 100 } }),
      api.get<PaginatedResult<Order>>("/seller/v1/orders", { query: { limit: 50 } }),
    ]).then(([e, p, o]) => {
      if (!active) return;
      if (e.status === "fulfilled") setEarnings(e.value);
      if (p.status === "fulfilled") setProducts(p.value.data ?? []);
      if (o.status === "fulfilled") setOrders(o.value.data ?? []);
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

  const activeProducts = products.filter((p) => p.status === "active").length;
  const newOrders = orders.filter((o) => o.status === "confirmed").length;
  const recentProducts = products.slice(0, 4);

  const metrics = [
    { label: "New Orders", value: String(newOrders), sub: "Awaiting processing", icon: ShoppingBag, color: "bg-[#f4a460]/15 text-[#6e3900]" },
    { label: "Available Balance", value: formatPaise(earnings?.availableBalancePaise), sub: "Ready to withdraw", icon: Wallet, color: "bg-[#97f3b5]/15 text-[#006d3d]" },
    { label: "Lifetime Earnings", value: formatPaise(earnings?.totalEarnedPaise), sub: "All time", icon: TrendingUp, color: "bg-[#97f3b5]/15 text-[#006d3d]" },
    { label: "Active Products", value: String(activeProducts), sub: `${products.length} total`, icon: Package, color: "bg-[#efeeea] text-[#534439]" },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex">
      <SellerSidebar />
      <div className="flex-1 ml-56">
        <header className="sticky top-0 z-20 bg-[#fbf9f5]/95 backdrop-blur border-b border-[#e4e2de] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1b1c1a]">Seller Dashboard</h1>
            <p className="text-xs text-[#857467]">Your storefront at a glance</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f4a460] flex items-center justify-center text-white text-xs font-bold">
              {(user?.fullName || "S").charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#1b1c1a] leading-tight">{user?.fullName || "Seller"}</p>
              <span className="text-[10px] text-[#006d3d] font-semibold flex items-center gap-1">
                <BadgeCheck size={11} className="fill-[#006d3d] text-white" /> Artisan
              </span>
            </div>
          </div>
        </header>

        <div className="px-6 py-8 flex flex-col gap-8">
          <div className="bg-gradient-to-r from-[#8d4f11] to-[#6e3900] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold mb-1">Namaste, {user?.fullName?.split(" ")[0] || "Maker"}! 🙏</h2>
                <p className="text-[#ffdcc3] text-sm">Here&apos;s your storefront activity summary.</p>
              </div>
              <Link href="/seller/add-product" className="flex items-center gap-2 px-4 py-2 bg-white text-[#8d4f11] text-sm font-bold rounded-xl">
                <PlusCircle size={16} /> Add Product
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-artisan flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#857467]">{label}</span>
                  <div className={`p-2 rounded-xl ${color}`}><Icon size={16} /></div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#1b1c1a]">{loading ? "…" : value}</div>
                  <div className="text-xs text-[#857467] mt-1">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent products */}
          <div className="bg-white rounded-2xl p-6 shadow-artisan">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1b1c1a]">Your Products</h3>
              <Link href="/seller/inventory" className="flex items-center gap-1 text-xs font-semibold text-[#8d4f11]">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            {loading ? (
              <div className="py-10 text-center text-[#857467]"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
            ) : recentProducts.length === 0 ? (
              <div className="py-10 text-center text-[#857467]">
                <p>No products yet.</p>
                <Link href="/seller/add-product" className="text-sm text-[#8d4f11] font-semibold mt-1 inline-block">Add your first product</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentProducts.map((craft) => (
                  <Link key={craft._id} href={`/product/${craft._id}`} className="flex flex-col gap-3 p-3 bg-[#f5f3ef] rounded-xl">
                    <div className="aspect-square rounded-xl overflow-hidden bg-[#efeeea]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={craft.images?.[0] || PLACEHOLDER_IMAGE} alt={craft.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-[#1b1c1a] leading-snug line-clamp-2">{craft.name}</p>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        craft.status === "active" ? "bg-[#97f3b5]/30 text-[#006d3d]" : "bg-[#ffdad6]/60 text-[#ba1a1a]"
                      }`}>
                        {craft.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#8d4f11]">{formatPaise(craft.pricePaise)}</span>
                      <span className="text-[10px] text-[#857467] flex items-center gap-0.5">
                        <Eye size={10} /> {craft.viewCount ?? 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl p-6 shadow-artisan">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1b1c1a]">Recent Orders</h3>
              <Link href="/seller/orders" className="flex items-center gap-1 text-xs font-semibold text-[#8d4f11]">
                Manage <ArrowUpRight size={13} />
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-[#857467] py-6 text-center">No orders yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.slice(0, 5).map((o) => {
                  const cfg = statusMeta(o.status);
                  return (
                    <div key={o._id} className="flex items-center justify-between py-2.5 border-b border-[#f5f3ef] last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1a]">{o.orderNumber}</p>
                        <p className="text-xs text-[#857467]">{o.items.length} items · {o.shippingAddress?.city}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                        <span className="text-sm font-bold text-[#1b1c1a]">{formatPaise(o.totalPaise)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
