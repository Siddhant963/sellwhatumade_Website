import Link from "next/link";
import { Leaf, TrendingUp, Eye, ShoppingCart, Star, Users, LayoutDashboard, Package, ShoppingBag, BarChart2, Settings, Banknote } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Products", href: "/seller/inventory" },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics", active: true },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Banknote, label: "Payouts", href: "/seller/payouts" },
];

const topProducts = [
  { name: "Hand-Painted Blue Pottery Vase", views: 4821, sales: 18, revenue: 62100, rating: 4.9 },
  { name: "Banarasi Silk Stole", views: 3109, sales: 12, revenue: 69600, rating: 5.0 },
  { name: "Madhubani Wall Art", views: 2890, sales: 9, revenue: 55800, rating: 4.7 },
  { name: "Tribal Silver Earrings", views: 3442, sales: 22, revenue: 31900, rating: 4.8 },
  { name: "Terracotta Wind Chime", views: 987, sales: 35, revenue: 31150, rating: 4.6 },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const viewsData = [1820, 2400, 2100, 3500, 3100, 4200];
const ordersData = [12, 18, 15, 24, 22, 28];

export default function AnalyticsPage() {
  const maxViews = Math.max(...viewsData);

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
          {navItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active ? "bg-[#8d4f11] text-white" : "text-[#857467] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-56 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Analytics</h1>
              <p className="text-sm text-[#857467] mt-1">Performance insights for your Maker Studio</p>
            </div>
            <select className="px-4 py-2.5 bg-white border border-[#d8c3b4] rounded-xl text-sm text-[#534439] focus:outline-none focus:border-[#f4a460]">
              <option>Last 6 months</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Eye, label: "Total Views", value: "17,120", trend: "+24%", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: ShoppingCart, label: "Total Orders", value: "119", trend: "+18%", color: "text-[#006d3d]", bg: "bg-[#006d3d]/10" },
              { icon: TrendingUp, label: "Conversion Rate", value: "0.7%", trend: "+0.2%", color: "text-[#8d4f11]", bg: "bg-[#8d4f11]/10" },
              { icon: Star, label: "Avg Rating", value: "4.82", trend: "+0.1", color: "text-amber-600", bg: "bg-amber-50" },
            ].map(({ icon: Icon, label, value, trend, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl shadow-artisan p-5">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-xs text-[#857467]">{label}</p>
                <p className="text-xl font-bold text-[#1b1c1a] mt-0.5">{value}</p>
                <p className={`text-xs font-medium ${color} mt-0.5`}>{trend} this period</p>
              </div>
            ))}
          </div>

          {/* Traffic chart */}
          <div className="bg-white rounded-2xl shadow-artisan p-5 mb-5">
            <h2 className="font-semibold text-[#1b1c1a] mb-5">Monthly Store Traffic</h2>
            <div className="flex items-end gap-3 h-36">
              {months.map((month, i) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-[#534439]">{viewsData[i].toLocaleString()}</span>
                  <div
                    className="w-full bg-gradient-to-t from-[#8d4f11] to-[#f4a460] rounded-t-xl"
                    style={{ height: `${(viewsData[i] / maxViews) * 90}px` }}
                  />
                  <span className="text-xs text-[#857467]">{month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Orders chart */}
            <div className="bg-white rounded-2xl shadow-artisan p-5">
              <h2 className="font-semibold text-[#1b1c1a] mb-4">Orders per Month</h2>
              <div className="flex items-end gap-2 h-24">
                {months.map((month, i) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[#97f3b5] rounded-t"
                      style={{ height: `${(ordersData[i] / Math.max(...ordersData)) * 80}px` }}
                    />
                    <span className="text-xs text-[#857467]">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div className="bg-white rounded-2xl shadow-artisan p-5">
              <h2 className="font-semibold text-[#1b1c1a] mb-4">Top Buyer Locations</h2>
              <div className="flex flex-col gap-3">
                {[
                  { city: "Mumbai", pct: 28 },
                  { city: "Bangalore", pct: 22 },
                  { city: "Delhi", pct: 18 },
                  { city: "Hyderabad", pct: 12 },
                  { city: "Others", pct: 20 },
                ].map(({ city, pct }) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="text-xs text-[#534439] w-20">{city}</span>
                    <div className="flex-1 bg-[#e4e2de] rounded-full h-2">
                      <div
                        className="bg-[#8d4f11] h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#534439] w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f0ede9] flex items-center justify-between">
              <h2 className="font-semibold text-[#1b1c1a]">Top Performing Products</h2>
              <Link href="/seller/inventory" className="text-xs text-[#8d4f11] font-semibold hover:underline">View All</Link>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0ede9]">
                  {["Product", "Views", "Sales", "Revenue", "Rating"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5]">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#d8c3b4] w-4">{i + 1}</span>
                        <span className="text-sm text-[#1b1c1a]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#534439]">{p.views.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#006d3d]">{p.sales}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-[#1b1c1a]">₹{p.revenue.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-[#f4a460] text-[#f4a460]" />
                        <span className="text-xs font-bold text-[#534439]">{p.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
