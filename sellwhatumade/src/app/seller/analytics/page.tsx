"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Eye, ShoppingCart, Star, Loader2, TrendingDown } from "lucide-react";
import SellerSidebar from "@/components/SellerSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { formatPaise } from "@/lib/format";
import type { SellerAnalytics } from "@/lib/api/types";

type Period = "6m" | "90d" | "30d";

export default function AnalyticsPage() {
  const { ready } = useRequireRole(["seller", "admin"]);
  const [period, setPeriod] = useState<Period>("6m");
  const [data, setData] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    setLoading(true);
    setError(null);
    api
      .get<SellerAnalytics>("/seller/v1/analytics", { query: { period } })
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load analytics.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [ready, period]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  const s = data?.summary;
  const monthly = data?.monthly ?? [];
  const locations = data?.locations ?? [];
  const topProducts = data?.topProducts ?? [];

  const maxViews = Math.max(...monthly.map((m) => m.views), 1);
  const maxOrders = Math.max(...monthly.map((m) => m.orders), 1);

  const kpis = [
    {
      icon: Eye,
      label: "Total Views",
      value: s ? s.totalViews.toLocaleString("en-IN") : "—",
      trend: null,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: s ? String(s.totalOrders) : "—",
      trend: s?.trends.orders ?? null,
      color: "text-[#006d3d]",
      bg: "bg-[#006d3d]/10",
    },
    {
      icon: TrendingUp,
      label: "Conversion Rate",
      value: s ? `${s.conversionRate}%` : "—",
      trend: null,
      color: "text-[#8d4f11]",
      bg: "bg-[#8d4f11]/10",
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: s ? (s.avgRating > 0 ? s.avgRating.toFixed(2) : "—") : "—",
      trend: null,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <SellerSidebar />

      <main className="pt-14 lg:pt-0 lg:ml-56 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Analytics</h1>
              <p className="text-sm text-[#857467] mt-1">Performance insights for your Maker Studio</p>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="px-4 py-2.5 bg-white border border-[#d8c3b4] rounded-xl text-sm text-[#534439] focus:outline-none focus:border-[#f4a460]"
            >
              <option value="6m">Last 6 months</option>
              <option value="90d">Last 90 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map(({ icon: Icon, label, value, trend, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl shadow-artisan p-5">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-xs text-[#857467]">{label}</p>
                {loading ? (
                  <div className="h-7 w-20 bg-[#f0ede9] animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-xl font-bold text-[#1b1c1a] mt-0.5">{value}</p>
                )}
                {trend !== null && !loading && (
                  <div className={`flex items-center gap-1 mt-0.5 text-xs font-medium ${trend >= 0 ? color : "text-red-500"}`}>
                    {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {trend >= 0 ? "+" : ""}{trend}% vs prev period
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Monthly Store Traffic */}
          <div className="bg-white rounded-2xl shadow-artisan p-5 mb-5">
            <h2 className="font-semibold text-[#1b1c1a] mb-5">Monthly Store Traffic</h2>
            {loading ? (
              <div className="h-36 bg-[#f0ede9] animate-pulse rounded-xl" />
            ) : monthly.length === 0 ? (
              <p className="text-sm text-[#857467] text-center py-10">No traffic data for this period.</p>
            ) : (
              <div className="flex items-end gap-3 h-36">
                {monthly.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs font-bold text-[#534439]">
                      {m.views > 0 ? m.views.toLocaleString("en-IN") : "0"}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-[#8d4f11] to-[#f4a460] rounded-t-xl transition-all"
                      style={{ height: `${Math.max((m.views / maxViews) * 90, m.views > 0 ? 4 : 0)}px` }}
                    />
                    <span className="text-xs text-[#857467]">{m.month}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Orders per Month */}
            <div className="bg-white rounded-2xl shadow-artisan p-5">
              <h2 className="font-semibold text-[#1b1c1a] mb-4">Orders per Month</h2>
              {loading ? (
                <div className="h-24 bg-[#f0ede9] animate-pulse rounded-xl" />
              ) : monthly.length === 0 ? (
                <p className="text-sm text-[#857467] text-center py-8">No order data.</p>
              ) : (
                <div className="flex items-end gap-2 h-24">
                  {monthly.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      {m.orders > 0 && (
                        <span className="text-[10px] font-semibold text-[#534439]">{m.orders}</span>
                      )}
                      <div
                        className="w-full bg-[#97f3b5] rounded-t transition-all"
                        style={{ height: `${Math.max((m.orders / maxOrders) * 72, m.orders > 0 ? 4 : 0)}px` }}
                      />
                      <span className="text-xs text-[#857467]">{m.month}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Buyer Locations */}
            <div className="bg-white rounded-2xl shadow-artisan p-5">
              <h2 className="font-semibold text-[#1b1c1a] mb-4">Top Buyer Locations</h2>
              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-5 bg-[#f0ede9] animate-pulse rounded" />
                  ))}
                </div>
              ) : locations.length === 0 ? (
                <p className="text-sm text-[#857467] text-center py-8">No location data yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {locations.map(({ city, pct }) => (
                    <div key={city} className="flex items-center gap-3">
                      <span className="text-xs text-[#534439] w-20 truncate">{city}</span>
                      <div className="flex-1 bg-[#e4e2de] rounded-full h-2">
                        <div
                          className="bg-[#8d4f11] h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#534439] w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Performing Products */}
          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f0ede9] flex items-center justify-between">
              <h2 className="font-semibold text-[#1b1c1a]">Top Performing Products</h2>
              <Link href="/seller/inventory" className="text-xs text-[#8d4f11] font-semibold hover:underline">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="p-5 flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-[#f0ede9] animate-pulse rounded" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-sm text-[#857467] text-center py-10">No products yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0ede9]">
                    {["Product", "Views", "Sales", "Revenue", "Rating"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.productId} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5]">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#d8c3b4] w-4">{i + 1}</span>
                          <Link
                            href={`/product/${p.productId}`}
                            className="text-sm text-[#1b1c1a] hover:text-[#8d4f11] line-clamp-1"
                          >
                            {p.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#534439]">
                        {p.views.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-[#006d3d]">{p.sales}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-[#1b1c1a]">
                        {formatPaise(p.revenuePaise)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-[#f4a460] text-[#f4a460]" />
                          <span className="text-xs font-bold text-[#534439]">
                            {p.rating > 0 ? p.rating.toFixed(1) : "—"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
