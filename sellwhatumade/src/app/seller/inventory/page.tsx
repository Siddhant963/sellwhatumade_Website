"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Search, Edit, Trash2, ChevronDown, AlertTriangle, Loader2, Play, Pause } from "lucide-react";
import SellerSidebar from "@/components/SellerSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { formatPaise } from "@/lib/format";
import type { PaginatedResult, Product, ProductStatus } from "@/lib/api/types";

const statusStyle: Record<string, string> = {
  active: "bg-[#006d3d]/10 text-[#006d3d]",
  out_of_stock: "bg-red-50 text-red-600",
  paused: "bg-amber-50 text-amber-700",
  draft: "bg-gray-100 text-gray-600",
  deleted: "bg-gray-100 text-gray-400",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  out_of_stock: "Out of Stock",
  paused: "Paused",
  draft: "Draft",
  deleted: "Deleted",
};

export default function InventoryPage() {
  const { ready } = useRequireRole(["seller", "admin"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResult<Product>>("/seller/v1/products", { query: { limit: 100 } });
      setProducts(res.data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  const changeStatus = async (id: string, next: ProductStatus) => {
    setBusy(id);
    try {
      await api.patch(`/seller/v1/products/${id}/status`, { status: next });
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setBusy(id);
    try {
      await api.delete(`/seller/v1/products/${id}`);
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === "All" || p.status === status;
        return matchSearch && matchStatus && p.status !== "deleted";
      }),
    [products, search, status],
  );

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === "active").length;
    const draft = products.filter((p) => p.status === "draft").length;
    const oos = products.filter((p) => p.stock === 0 && p.status !== "deleted").length;
    return [
      { label: "Total Products", value: products.filter((p) => p.status !== "deleted").length, trend: "All listings" },
      { label: "Active Listings", value: active, trend: "Visible to buyers" },
      { label: "Drafts", value: draft, trend: "Not published" },
      { label: "Out of Stock", value: oos, trend: "Requires restocking", alert: oos > 0 },
    ];
  }, [products]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <SellerSidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Product Inventory</h1>
              <p className="text-sm text-[#857467] mt-1">Manage your listings, stock levels, and status</p>
            </div>
            <Link
              href="/seller/add-product"
              className="btn-press flex items-center gap-2 px-5 py-2.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              + Add Product
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map(({ label, value, trend, alert }) => (
              <div key={label} className="bg-white rounded-2xl shadow-artisan p-4">
                <p className="text-xs text-[#857467] font-medium">{label}</p>
                <p className="text-2xl font-bold text-[#1b1c1a] mt-1">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${alert ? "text-red-500" : "text-[#006d3d]"}`}>
                  {alert && <AlertTriangle size={11} />}
                  {trend}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-artisan p-4 mb-4 flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#fbf9f5] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460]"
              />
            </div>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="pl-3 pr-8 py-2.5 text-sm bg-[#fbf9f5] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460] appearance-none"
              >
                {["All", "active", "draft", "paused", "out_of_stock"].map((o) => (
                  <option key={o} value={o}>{o === "All" ? "All statuses" : statusLabel[o]}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#857467] pointer-events-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#857467]">
                <Loader2 className="animate-spin mr-2" /> Loading products…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-[#857467]">
                <p className="font-medium">No products found.</p>
                <Link href="/seller/add-product" className="text-sm text-[#8d4f11] font-semibold mt-2 inline-block">
                  Add your first product
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0ede9]">
                    {["Product", "Price", "Stock", "Status", "Views", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5] transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-[#1b1c1a] leading-snug">{item.name}</p>
                        <p className="text-xs text-[#857467]">{item.sku}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-[#1b1c1a]">{formatPaise(item.pricePaise)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold ${item.stock === 0 ? "text-red-600" : item.stock <= 3 ? "text-amber-600" : "text-[#534439]"}`}>
                          {item.stock}
                          {item.stock <= 3 && item.stock > 0 && <span className="ml-1 text-amber-500">⚠</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[item.status] || "bg-gray-100 text-gray-600"}`}>
                          {statusLabel[item.status] || item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#857467]">{(item.viewCount ?? 0).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {item.status === "active" ? (
                            <button
                              onClick={() => changeStatus(item._id, "paused")}
                              disabled={busy === item._id}
                              title="Pause"
                              className="w-7 h-7 rounded-lg hover:bg-[#f7f4f0] flex items-center justify-center transition-colors disabled:opacity-40"
                            >
                              <Pause size={13} className="text-[#857467]" />
                            </button>
                          ) : (
                            <button
                              onClick={() => changeStatus(item._id, "active")}
                              disabled={busy === item._id}
                              title="Activate"
                              className="w-7 h-7 rounded-lg hover:bg-[#f7f4f0] flex items-center justify-center transition-colors disabled:opacity-40"
                            >
                              <Play size={13} className="text-[#006d3d]" />
                            </button>
                          )}
                          <Link
                            href={`/product/${item._id}`}
                            className="w-7 h-7 rounded-lg hover:bg-[#f7f4f0] flex items-center justify-center transition-colors"
                          >
                            <Edit size={13} className="text-[#857467]" />
                          </Link>
                          <button
                            onClick={() => remove(item._id)}
                            disabled={busy === item._id}
                            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors disabled:opacity-40"
                          >
                            <Trash2 size={13} className="text-[#857467] hover:text-red-500" />
                          </button>
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
