"use client";
import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Clock, Banknote, ChevronRight, Loader2 } from "lucide-react";
import SellerSidebar from "@/components/SellerSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { formatPaise, formatDate, toPaise } from "@/lib/format";
import type { EarningsDashboard, LedgerEntry, PaginatedResult, Payout } from "@/lib/api/types";

export default function PayoutsPage() {
  const { ready } = useRequireRole(["seller", "admin"]);
  const [dashboard, setDashboard] = useState<EarningsDashboard | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, p, l] = await Promise.all([
        api.get<EarningsDashboard>("/seller/v1/earnings/dashboard"),
        api.get<PaginatedResult<Payout> | Payout[]>("/seller/v1/earnings/payouts"),
        api.get<PaginatedResult<LedgerEntry>>("/seller/v1/earnings/ledger", { query: { limit: 20 } }),
      ]);
      setDashboard(d);
      setPayouts(Array.isArray(p) ? p : p.data ?? []);
      setLedger(l.data ?? []);
    } catch {
      /* leave empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  const requestPayout = async () => {
    setMessage(null);
    const available = dashboard?.availableBalancePaise ?? 0;
    if (available < 10000) {
      setMessage("Minimum payout is ₹100. Not enough balance.");
      return;
    }
    const input = prompt(`Enter amount to withdraw (₹). Available: ${formatPaise(available)}`);
    if (!input) return;
    const amountPaise = toPaise(input);
    if (amountPaise < 10000 || amountPaise > available) {
      setMessage("Enter an amount between ₹100 and your available balance.");
      return;
    }
    setRequesting(true);
    try {
      await api.post("/seller/v1/earnings/payouts", { amountPaise });
      setMessage("Payout requested. It will be processed to your registered bank account.");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not request payout.");
    } finally {
      setRequesting(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  const cards = [
    { icon: Banknote, label: "Available Balance", value: formatPaise(dashboard?.availableBalancePaise), color: "text-[#8d4f11]", bg: "bg-[#8d4f11]/10" },
    { icon: TrendingUp, label: "Total Earned (lifetime)", value: formatPaise(dashboard?.totalEarnedPaise), color: "text-[#006d3d]", bg: "bg-[#006d3d]/10" },
    { icon: Clock, label: "Total Paid Out", value: formatPaise(dashboard?.totalPaidOutPaise), color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <SellerSidebar />
      <main className="pt-14 lg:pt-0 lg:ml-56 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Payouts &amp; Earnings</h1>
              <p className="text-sm text-[#857467] mt-1">Track your income and request payouts to your bank account</p>
            </div>
          </div>

          {message && (
            <div className="mb-5 rounded-xl bg-[#97f3b5]/15 border border-[#97f3b5]/40 px-4 py-3 text-sm text-[#006d3d]">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {cards.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl shadow-artisan p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-xs text-[#857467] font-medium">{label}</p>
                <p className="text-2xl font-bold text-[#1b1c1a] mt-1">{loading ? "…" : value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-artisan p-5 mb-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-[#857467] uppercase tracking-wide font-medium mb-1">Withdraw your earnings</p>
              <p className="text-base font-bold text-[#1b1c1a]">{formatPaise(dashboard?.availableBalancePaise)} available</p>
              <p className="text-xs text-[#857467] mt-0.5">Minimum payout ₹100 · sent to your KYC bank account</p>
            </div>
            <button
              onClick={requestPayout}
              disabled={requesting}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors disabled:opacity-60"
            >
              {requesting ? <Loader2 size={14} className="animate-spin" /> : null}
              Request Payout
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Payout history */}
          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-[#f0ede9]">
              <h2 className="font-semibold text-[#1b1c1a]">Payout History</h2>
            </div>
            {payouts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#857467]">No payouts yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0ede9]">
                    {["Requested", "Amount", "Status", "Processed"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p._id} className="border-b border-[#f7f4f0]">
                      <td className="px-4 py-3.5 text-xs text-[#857467]">{formatDate(p.createdAt)}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-[#1b1c1a]">{formatPaise(p.amountPaise)}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 capitalize">{p.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#857467]">{p.processedAt ? formatDate(p.processedAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Ledger */}
          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f0ede9]">
              <h2 className="font-semibold text-[#1b1c1a]">Earnings Ledger</h2>
            </div>
            {ledger.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#857467]">No transactions yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0ede9]">
                    {["Date", "Description", "Amount", "Balance"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((e) => (
                    <tr key={e._id} className="border-b border-[#f7f4f0]">
                      <td className="px-4 py-3.5 text-xs text-[#857467]">{formatDate(e.createdAt)}</td>
                      <td className="px-4 py-3.5 text-sm text-[#534439]">{e.description || e.type}</td>
                      <td className={`px-4 py-3.5 text-sm font-semibold ${e.amountPaise < 0 ? "text-red-500" : "text-[#006d3d]"}`}>
                        {e.amountPaise < 0 ? "−" : "+"}{formatPaise(Math.abs(e.amountPaise))}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#1b1c1a]">{formatPaise(e.balancePaise)}</td>
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
