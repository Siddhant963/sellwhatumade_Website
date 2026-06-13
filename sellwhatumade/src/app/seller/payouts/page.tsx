"use client";
import Link from "next/link";
import { Leaf, TrendingUp, Clock, Banknote, Download, ChevronRight, LayoutDashboard, Package, ShoppingBag, BarChart2, Settings } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Products", href: "/seller/inventory" },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const transactions = [
  { date: "Jun 12, 2024", orderId: "#AC-88421", product: "Blue Pottery Vase", gross: 4200, commission: 210, net: 3990, status: "Paid" },
  { date: "Jun 10, 2024", orderId: "#AC-88390", product: "Banarasi Silk Stole", gross: 5800, commission: 290, net: 5510, status: "Processing" },
  { date: "Jun 08, 2024", orderId: "#AC-88271", product: "Dhokra Elephant", gross: 2100, commission: 105, net: 1995, status: "Paid" },
  { date: "Jun 05, 2024", orderId: "#AC-88124", product: "Madhubani Painting", gross: 6200, commission: 310, net: 5890, status: "Pending" },
  { date: "Jun 05, 2024", orderId: "#AC-88001", product: "Warli Art Print", gross: 1800, commission: 90, net: 1710, status: "Paid" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const grossData = [28000, 34500, 31200, 42800, 38900, 42850];
const netData = [23800, 29325, 26520, 36380, 33065, 36422];

export default function PayoutsPage() {
  const maxVal = Math.max(...grossData);

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <aside className="w-56 shrink-0 bg-[#1b1c1a] fixed top-0 left-0 h-full flex flex-col py-6 px-3 z-20">
        <Link href="/" className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">Maker Studio</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#857467] hover:bg-white/5 hover:text-white transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <Link
            href="/seller/payouts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-[#8d4f11] text-white"
          >
            <Banknote size={16} />
            Payouts
          </Link>
        </nav>
      </aside>

      <main className="ml-56 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Payouts &amp; Earnings</h1>
              <p className="text-sm text-[#857467] mt-1">Track your income, commission deductions, and payout schedule</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d8c3b4] text-sm text-[#534439] font-medium rounded-xl hover:border-[#f4a460] transition-colors">
              <Download size={14} />
              Export CSV
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Banknote, label: "Total Earned (lifetime)", value: "₹1,84,250", sub: "All-time", color: "text-[#8d4f11]", bg: "bg-[#8d4f11]/10" },
              { icon: TrendingUp, label: "This Month", value: "₹42,850", sub: "+18% vs last month", color: "text-[#006d3d]", bg: "bg-[#006d3d]/10" },
              { icon: Clock, label: "Pending Payout", value: "₹12,400", sub: "Processes on 15th", color: "text-amber-600", bg: "bg-amber-50" },
            ].map(({ icon: Icon, label, value, sub, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl shadow-artisan p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-xs text-[#857467] font-medium">{label}</p>
                <p className="text-2xl font-bold text-[#1b1c1a] mt-1">{value}</p>
                <p className={`text-xs mt-0.5 ${color}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Payout schedule */}
          <div className="bg-white rounded-2xl shadow-artisan p-5 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#857467] uppercase tracking-wide font-medium mb-1">Next Payout Schedule</p>
              <p className="text-base font-bold text-[#1b1c1a]">June 15, 2024</p>
              <p className="text-xs text-[#857467] mt-0.5">Expected arrival in 4-6 business days</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-[#006d3d]/10 flex items-center justify-center">
                  <Banknote size={12} className="text-[#006d3d]" />
                </div>
                <span className="text-xs text-[#534439] font-medium">HDFC •••• 4521</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8d4f11] text-white text-xs font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                Request Early Payout
                <ChevronRight size={13} />
              </button>
              <button className="px-4 py-2 border border-[#d8c3b4] text-xs text-[#534439] font-medium rounded-xl hover:border-[#f4a460] transition-colors text-center">
                Change Bank Account
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-artisan p-5 mb-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#1b1c1a]">Monthly Earnings</h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#8d4f11]" /><span className="text-[#534439]">Gross</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#97f3b5]" /><span className="text-[#534439]">Net</span></div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {months.map((month, i) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5">
                    <div
                      className="w-full bg-[#8d4f11] rounded-t-md"
                      style={{ height: `${(grossData[i] / maxVal) * 80}px` }}
                    />
                    <div
                      className="w-full bg-[#97f3b5] rounded-b-md"
                      style={{ height: `${(netData[i] / maxVal) * 80}px` }}
                    />
                  </div>
                  <span className="text-xs text-[#857467]">{month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#857467] mt-3">
              ₹8,500 paid in platform commission (5% Basic plan) · June 2024
            </p>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f0ede9]">
              <h2 className="font-semibold text-[#1b1c1a]">Transaction History</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0ede9]">
                  {["Date", "Order ID", "Product", "Gross", "Commission", "Net Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.orderId} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5] transition-colors">
                    <td className="px-4 py-3.5 text-xs text-[#857467]">{tx.date}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-[#8d4f11]">{tx.orderId}</td>
                    <td className="px-4 py-3.5 text-sm text-[#534439]">{tx.product}</td>
                    <td className="px-4 py-3.5 text-sm text-[#1b1c1a]">₹{tx.gross.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3.5 text-xs text-red-500">-₹{tx.commission.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#1b1c1a]">₹{tx.net.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        tx.status === "Paid" ? "bg-[#006d3d]/10 text-[#006d3d]" :
                        tx.status === "Processing" ? "bg-blue-50 text-blue-600" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-[#f0ede9]">
              <p className="text-xs text-[#857467]">Showing 1-10 of 42 transactions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
