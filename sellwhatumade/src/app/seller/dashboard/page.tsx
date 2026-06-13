"use client";

import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings,
  PlusCircle, BadgeCheck, TrendingUp, TrendingDown, ArrowUpRight,
  Bell, MessageCircle, Eye, Star
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard", active: true },
  { icon: Package, label: "Inventory", href: "#" },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders" },
  { icon: BarChart3, label: "Analytics", href: "#" },
  { icon: MessageCircle, label: "Messages", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
];

const metrics = [
  {
    label: "New Orders",
    value: "12",
    sub: "+4 since yesterday",
    trend: "up",
    icon: ShoppingBag,
    color: "bg-[#f4a460]/15 text-[#6e3900]",
  },
  {
    label: "Total Revenue",
    value: "₹42,850",
    sub: "Monthly payout pending",
    trend: "up",
    icon: TrendingUp,
    color: "bg-[#97f3b5]/15 text-[#006d3d]",
  },
  {
    label: "Active Products",
    value: "24",
    sub: "Across 4 categories",
    trend: "neutral",
    icon: Package,
    color: "bg-[#efeeea] text-[#534439]",
  },
  {
    label: "Pending Approvals",
    value: "3",
    sub: "Items in verification",
    trend: "down",
    icon: Eye,
    color: "bg-[#ffdad6]/40 text-[#ba1a1a]",
  },
];

const earningsData = [
  { day: "Mon", amount: 3200 },
  { day: "Tue", amount: 5800 },
  { day: "Wed", amount: 4200 },
  { day: "Thu", amount: 7200 },
  { day: "Fri", amount: 6100 },
  { day: "Sat", amount: 8900 },
  { day: "Sun", amount: 5400 },
];

const popularCrafts = [
  {
    name: "Hand-painted Blue Vase",
    price: 1250,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=80&q=80",
    views: 142,
  },
  {
    name: "Banarasi Silk Stole",
    price: 3400,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=80",
    views: 98,
  },
  {
    name: "Terracotta Lamp",
    price: 890,
    status: "PENDING",
    image: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=80&q=80",
    views: 0,
  },
  {
    name: "Teakwood Wall Art",
    price: 5600,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80",
    views: 67,
  },
];

const maxEarning = Math.max(...earningsData.map((d) => d.amount));

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1b1c1a] min-h-screen fixed left-0 top-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#30312e]">
          <div className="w-8 h-8 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Star size={14} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">SellWhatUMade</p>
            <p className="text-[#857467] text-[10px]">Maker Studio</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-5 flex-1">
          {navItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#f4a460]/20 text-[#f4a460]"
                  : "text-[#857467] hover:bg-[#30312e] hover:text-[#e4e2de]"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#30312e]">
          <Link
            href="#"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <PlusCircle size={16} />
            Add New Craft
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#fbf9f5]/95 backdrop-blur border-b border-[#e4e2de] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1b1c1a]">Seller Dashboard</h1>
            <p className="text-xs text-[#857467]">Sunday, 8 June 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-[#efeeea] transition-colors">
              <Bell size={18} className="text-[#534439]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#f4a460] flex items-center justify-center text-white text-xs font-bold">
                MS
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#1b1c1a] leading-tight">Maker Studio</p>
                <div className="flex items-center gap-1">
                  <BadgeCheck size={11} className="fill-[#006d3d] text-white" />
                  <span className="text-[10px] text-[#006d3d] font-semibold">Verified Artisan</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-8 flex flex-col gap-8">
          {/* Welcome */}
          <div className="bg-gradient-to-r from-[#8d4f11] to-[#6e3900] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#f4a460] rounded-full" />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Namaste, Maker Studio! 🙏</h2>
                <p className="text-[#ffdcc3] text-sm">Here's your daily activity summary.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full">
                <BadgeCheck size={14} className="text-[#97f3b5]" />
                <span className="text-xs font-semibold">Authentic Artisan Certified</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map(({ label, value, sub, trend, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-artisan flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#857467]">{label}</span>
                  <div className={`p-2 rounded-xl ${color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1b1c1a]">{value}</div>
                  <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${
                    trend === "up" ? "text-[#006d3d]" : trend === "down" ? "text-[#ba1a1a]" : "text-[#857467]"
                  }`}>
                    {trend === "up" && <TrendingUp size={11} />}
                    {trend === "down" && <TrendingDown size={11} />}
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Earnings Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-artisan">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#1b1c1a]">Recent Earnings</h3>
                <div className="flex gap-1 bg-[#f5f3ef] rounded-xl p-1">
                  {["Last 7 Days", "Last 30 Days"].map((t) => (
                    <button
                      key={t}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        t === "Last 7 Days" ? "bg-white text-[#1b1c1a] shadow-sm" : "text-[#857467]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-3 h-40">
                {earningsData.map((d) => (
                  <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-medium text-[#857467]">
                      ₹{(d.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full bg-[#f4a460] rounded-t-lg transition-all hover:bg-[#8d4f11]"
                      style={{ height: `${(d.amount / maxEarning) * 100}%`, minHeight: "8px" }}
                    />
                    <span className="text-[10px] text-[#857467]">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Maker's Story */}
            <div className="bg-white rounded-2xl p-6 shadow-artisan flex flex-col gap-4">
              <h3 className="font-bold text-[#1b1c1a]">Maker's Story</h3>
              <div className="rounded-xl overflow-hidden h-32 bg-[#efeeea]">
                <img
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80"
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-[#534439] italic leading-relaxed">
                "Each piece I weave carries the memory of my grandmother's teachings and the soul of our village..."
              </p>
              <span className="text-xs font-semibold text-[#8d4f11] bg-[#f4a460]/15 px-2.5 py-1 rounded-full w-fit">
                Traditional Heritage Craft
              </span>
              <Link href="#" className="text-xs text-[#006d3d] font-medium hover:underline">
                Contact Your Advisor →
              </Link>
            </div>
          </div>

          {/* Popular Crafts */}
          <div className="bg-white rounded-2xl p-6 shadow-artisan">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1b1c1a]">Popular Crafts</h3>
              <Link href="#" className="flex items-center gap-1 text-xs font-semibold text-[#8d4f11]">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularCrafts.map((craft) => (
                <div key={craft.name} className="flex flex-col gap-3 p-3 bg-[#f5f3ef] rounded-xl">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#efeeea]">
                    <img src={craft.image} alt={craft.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-semibold text-[#1b1c1a] leading-snug">{craft.name}</p>
                    <span
                      className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        craft.status === "ACTIVE"
                          ? "bg-[#97f3b5]/30 text-[#006d3d]"
                          : "bg-[#ffdad6]/60 text-[#ba1a1a]"
                      }`}
                    >
                      {craft.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#8d4f11]">₹{craft.price.toLocaleString("en-IN")}</span>
                    {craft.views > 0 && (
                      <span className="text-[10px] text-[#857467] flex items-center gap-0.5">
                        <Eye size={10} /> {craft.views}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="#"
              className="btn-press flex items-center gap-3 p-5 bg-[#8d4f11] hover:bg-[#6e3900] text-white rounded-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <PlusCircle size={20} />
              </div>
              <div>
                <p className="font-bold">Add New Product</p>
                <p className="text-xs text-[#ffdcc3]">List a new handcrafted item</p>
              </div>
            </Link>
            <Link
              href="/seller/orders"
              className="btn-press flex items-center gap-3 p-5 bg-white border border-[#e4e2de] hover:border-[#f4a460] rounded-2xl transition-colors shadow-artisan"
            >
              <div className="w-10 h-10 bg-[#f4a460]/15 rounded-xl flex items-center justify-center shrink-0">
                <ShoppingBag size={20} className="text-[#8d4f11]" />
              </div>
              <div>
                <p className="font-bold text-[#1b1c1a]">View All Orders</p>
                <p className="text-xs text-[#857467]">Track your active orders</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
