"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings,
  MessageCircle, Search, ChevronLeft, ChevronRight, Star, BadgeCheck
} from "lucide-react";
import { orders } from "@/lib/data";

type Status = "All" | "New" | "Processing" | "Shipped" | "Delivered";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Inventory", href: "#" },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders", active: true },
  { icon: BarChart3, label: "Analytics", href: "#" },
  { icon: MessageCircle, label: "Messages", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
];

const statusColors: Record<string, string> = {
  New: "bg-[#ffdcc3] text-[#6e3900]",
  Processing: "bg-[#97f3b5]/30 text-[#006d3d]",
  Shipped: "bg-[#efeeea] text-[#534439]",
  Delivered: "bg-[#d8c3b4]/40 text-[#534439]",
};

const actionLabels: Record<string, string> = {
  New: "Accept Order",
  Processing: "Mark as Shipped",
  Shipped: "View Details",
  Delivered: "View Details",
};

export default function SellerOrdersPage() {
  const [activeTab, setActiveTab] = useState<Status>("All");
  const [search, setSearch] = useState("");

  const counts = {
    All: orders.length,
    New: orders.filter((o) => o.status === "New").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Shipped: orders.filter((o) => o.status === "Shipped").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  const filtered = orders.filter((o) => {
    if (activeTab !== "All" && o.status !== activeTab) return false;
    if (search && !o.product.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1b1c1a] min-h-screen fixed left-0 top-0 z-10">
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
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60 px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1b1c1a]">Manage Orders</h1>
          <p className="text-sm text-[#857467] mt-1">
            Track your handcrafted masterpieces from the loom to your customer's doorstep.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border-b border-[#efeeea]">
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {(["All", "New", "Processing", "Shipped", "Delivered"] as Status[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "bg-[#8d4f11] text-white"
                      : "text-[#534439] hover:bg-[#f5f3ef]"
                  }`}
                >
                  {tab}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab ? "bg-white/20 text-white" : "bg-[#efeeea] text-[#857467]"
                    }`}
                  >
                    {counts[tab]}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm bg-[#f5f3ef] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f3ef]">
                  {["Order ID", "Product", "Customer", "Status", "Amount", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#857467] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f3ef]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-[#857467] text-sm">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-[#fbf9f5] transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#8d4f11]">{order.id}</span>
                        <p className="text-[11px] text-[#857467]">{order.date}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#efeeea] shrink-0">
                            <img src={order.productImage} alt={order.product} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1b1c1a] line-clamp-1 max-w-36">{order.product}</p>
                            <p className="text-xs text-[#857467]">Qty: {order.quantity}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <BadgeCheck size={12} className="text-[#857467]" />
                          <div>
                            <p className="text-sm font-medium text-[#1b1c1a]">{order.customer}</p>
                            <p className="text-xs text-[#857467]">{order.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#1b1c1a]">
                          ₹{order.amount.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="btn-press px-3.5 py-1.5 text-xs font-semibold bg-[#8d4f11] text-white rounded-xl hover:bg-[#6e3900] transition-colors whitespace-nowrap">
                          {actionLabels[order.status]}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#efeeea]">
            <p className="text-sm text-[#857467]">
              Showing {filtered.length} of {orders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#d8c3b4] text-[#534439] hover:border-[#f4a460] transition-colors">
                <ChevronLeft size={15} />
              </button>
              <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#8d4f11] text-white text-xs font-bold">1</span>
              <span className="w-8 h-8 flex items-center justify-center rounded-xl text-[#534439] text-xs hover:bg-[#efeeea] transition-colors">2</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#d8c3b4] text-[#534439] hover:border-[#f4a460] transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Tips sidebar */}
        <div className="mt-6 p-5 bg-white rounded-2xl shadow-artisan">
          <h3 className="text-sm font-bold text-[#1b1c1a] mb-3">Artisan Tips</h3>
          <ul className="flex flex-col gap-2 text-xs text-[#534439]">
            <li className="flex gap-2"><span className="text-[#f4a460]">✦</span> Respond to new orders within 24 hours to maintain your seller rating.</li>
            <li className="flex gap-2"><span className="text-[#f4a460]">✦</span> Add tracking numbers when marking orders as shipped.</li>
            <li className="flex gap-2"><span className="text-[#f4a460]">✦</span> Contact us: 9 AM – 6 PM IST for support.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
