"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, BadgeCheck, Ban, CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import type { PaginatedResult, SellerProfile } from "@/lib/api/types";

type Tab = "sellers" | "kyc";

interface KycPending extends SellerProfile {
  kycStatus?: string;
}

export default function AdminSellersPage() {
  const { ready } = useRequireRole(["admin"]);
  const [tab, setTab] = useState<Tab>("sellers");
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [pendingKyc, setPendingKyc] = useState<KycPending[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const sellerId = useCallback((s: SellerProfile) => s.userId || s._id || "", []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, kyc] = await Promise.all([
        api.get<PaginatedResult<SellerProfile>>("/api/v1/admin/sellers", { query: { limit: 100 } }),
        api.get<PaginatedResult<KycPending>>("/api/v1/admin/sellers/kyc/pending", { query: { limit: 100 } }),
      ]);
      setSellers(list.data ?? []);
      setPendingKyc(kyc.data ?? []);
    } catch {
      setSellers([]);
      setPendingKyc([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  const action = async (path: string, body?: unknown, method: "patch" | "post" = "patch") => {
    const id = path;
    setBusy(id);
    try {
      if (method === "post") await api.post(path, body);
      else await api.patch(path, body);
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  const reviewKyc = async (id: string, decision: "approved" | "rejected") => {
    let reason: string | undefined;
    if (decision === "rejected") {
      reason = prompt("Reason for rejection:") || undefined;
      if (!reason) return;
    }
    await action(`/api/v1/admin/sellers/${id}/kyc/review`, { decision, reason }, "post");
  };

  const filtered = useMemo(
    () =>
      sellers.filter((s) =>
        `${s.shopName} ${s.address?.city ?? ""} ${s.address?.state ?? ""}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [sellers, search],
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
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Seller Management</h1>
              <p className="text-sm text-[#857467] mt-1">{sellers.length} sellers · {pendingKyc.length} pending KYC</p>
            </div>
            <div className="flex gap-2 text-sm">
              {([["sellers", "All Sellers"], ["kyc", "Pending KYC"]] as [Tab, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-2 rounded-xl border transition-colors ${
                    tab === key ? "bg-[#8d4f11] text-white border-[#8d4f11]" : "bg-white text-[#534439] border-[#d8c3b4] hover:border-[#f4a460]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {tab === "sellers" && (
            <>
              <div className="bg-white rounded-2xl shadow-artisan p-4 mb-4">
                <div className="relative max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by shop, city, state..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#fbf9f5] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
                {loading ? (
                  <div className="py-16 text-center text-[#857467]"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
                ) : filtered.length === 0 ? (
                  <div className="py-16 text-center text-[#857467]">No sellers found.</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#f0ede9]">
                        {["Shop", "Location", "Products", "Orders", "Status", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => {
                        const id = sellerId(s);
                        return (
                          <tr key={id} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5] transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-[#1b1c1a]">{s.shopName}</p>
                                {s.isVerified && <BadgeCheck size={14} className="text-[#006d3d]" />}
                              </div>
                              {s.specialization && <p className="text-xs text-[#857467]">{s.specialization}</p>}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-[#534439]">{s.address?.city}, {s.address?.state}</td>
                            <td className="px-4 py-3.5 text-sm text-[#1b1c1a]">{s.totalProducts ?? 0}</td>
                            <td className="px-4 py-3.5 text-sm text-[#1b1c1a]">{s.totalOrders ?? 0}</td>
                            <td className="px-4 py-3.5">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                s.isActive === false ? "bg-red-50 text-red-600" : "bg-[#006d3d]/10 text-[#006d3d]"
                              }`}>
                                {s.isActive === false ? "Suspended" : "Active"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                {!s.isVerified && (
                                  <button
                                    onClick={() => action(`/api/v1/admin/sellers/${id}/verify`)}
                                    disabled={busy?.includes(id)}
                                    title="Verify"
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#006d3d]/10 text-[#006d3d] hover:bg-[#006d3d]/20 disabled:opacity-50"
                                  >
                                    Verify
                                  </button>
                                )}
                                {s.isActive === false ? (
                                  <button
                                    onClick={() => action(`/api/v1/admin/sellers/${id}/unsuspend`)}
                                    disabled={busy?.includes(id)}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#f7f4f0] text-[#534439] hover:bg-[#efeeea] disabled:opacity-50"
                                  >
                                    Unsuspend
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => action(`/api/v1/admin/sellers/${id}/suspend`)}
                                    disabled={busy?.includes(id)}
                                    title="Suspend"
                                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center disabled:opacity-50"
                                  >
                                    <Ban size={13} className="text-[#857467] hover:text-red-500" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {tab === "kyc" && (
            <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-[#857467]"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
              ) : pendingKyc.length === 0 ? (
                <div className="py-16 text-center text-[#857467] flex flex-col items-center gap-2">
                  <ShieldCheck size={32} className="text-[#d8c3b4]" />
                  No pending KYC submissions.
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#f0ede9]">
                      {["Shop", "Location", "KYC Status", "Decision"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingKyc.map((s) => {
                      const id = sellerId(s);
                      return (
                        <tr key={id} className="border-b border-[#f7f4f0]">
                          <td className="px-4 py-3.5 text-sm font-semibold text-[#1b1c1a]">{s.shopName}</td>
                          <td className="px-4 py-3.5 text-sm text-[#534439]">{s.address?.city}, {s.address?.state}</td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 capitalize">
                              {s.kycStatus || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => reviewKyc(id, "approved")}
                                disabled={busy?.includes(id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#006d3d]/10 text-[#006d3d] hover:bg-[#006d3d]/20 disabled:opacity-50"
                              >
                                <CheckCircle size={12} /> Approve
                              </button>
                              <button
                                onClick={() => reviewKyc(id, "rejected")}
                                disabled={busy?.includes(id)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
