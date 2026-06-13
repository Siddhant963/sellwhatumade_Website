"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf, Search, Edit, Copy, Trash2, ChevronDown, LayoutDashboard, Package, ShoppingBag, BarChart2, Settings, AlertTriangle } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Products", href: "/seller/inventory", active: true },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const inventoryItems = [
  { id: 1, name: "Hand-Painted Blue Pottery Vase", sku: "POT-001", category: "Pottery", price: 3450, stock: 3, status: "Active", views: 4821 },
  { id: 2, name: "Indigo Block Print Stole", sku: "TEX-012", category: "Textiles", price: 1800, stock: 0, status: "Out of Stock", views: 2341 },
  { id: 3, name: "Dhokra Brass Elephant", sku: "MET-007", category: "Metal", price: 2100, stock: 12, status: "Active", views: 1892 },
  { id: 4, name: "Madhubani Wall Art – Birds", sku: "ART-003", category: "Paintings", price: 5800, stock: 1, status: "Active", views: 3109 },
  { id: 5, name: "Terracotta Wind Chime", sku: "POT-018", category: "Pottery", price: 890, stock: 25, status: "Active", views: 987 },
  { id: 6, name: "Banarasi Silk Dupatta", sku: "TEX-008", category: "Textiles", price: 4200, stock: 0, status: "Pending Review", views: 1654 },
  { id: 7, name: "Rosewood Carved Box", sku: "WOD-002", category: "Wood", price: 3800, stock: 7, status: "Active", views: 2210 },
  { id: 8, name: "Tribal Silver Earrings", sku: "JEW-015", category: "Jewelry", price: 1450, stock: 4, status: "Active", views: 3442 },
  { id: 9, name: "Warli Art Print – Village", sku: "ART-011", category: "Paintings", price: 1800, stock: 8, status: "Draft", views: 412 },
  { id: 10, name: "Patchwork Kantha Quilt", sku: "TEX-021", category: "Textiles", price: 7500, stock: 2, status: "Active", views: 1890 },
];

const statusStyle: Record<string, string> = {
  "Active": "bg-[#006d3d]/10 text-[#006d3d]",
  "Out of Stock": "bg-red-50 text-red-600",
  "Pending Review": "bg-amber-50 text-amber-700",
  "Draft": "bg-gray-100 text-gray-600",
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = inventoryItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    const matchStatus = status === "All" || item.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const stats = [
    { label: "Total Products", value: "148", trend: "+12% this month" },
    { label: "Active Listings", value: "132", trend: "89.2% of total" },
    { label: "Pending Review", value: "9", trend: "Expected: 24-48h" },
    { label: "Out of Stock", value: "7", trend: "Requires restocking", alert: true },
  ];

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      {/* Sidebar */}
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

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
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

          {/* Filters */}
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
            {[
              { label: "Category", value: category, setValue: setCategory, options: ["All", "Pottery", "Textiles", "Metal", "Paintings", "Wood", "Jewelry"] },
              { label: "Status", value: status, setValue: setStatus, options: ["All", "Active", "Draft", "Pending Review", "Out of Stock"] },
            ].map(({ label, value: val, setValue, options }) => (
              <div key={label} className="relative">
                <select
                  value={val}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-3 pr-8 py-2.5 text-sm bg-[#fbf9f5] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460] appearance-none"
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#857467] pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0ede9]">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="accent-[#8d4f11]" />
                  </th>
                  {["Product", "Category", "Price", "Stock", "Status", "Views", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5] transition-colors">
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="accent-[#8d4f11]"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1a] leading-snug">{item.name}</p>
                        <p className="text-xs text-[#857467]">{item.sku}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#534439]">{item.category}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#1b1c1a]">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold ${item.stock === 0 ? "text-red-600" : item.stock <= 3 ? "text-amber-600" : "text-[#534439]"}`}>
                        {item.stock}
                        {item.stock <= 3 && item.stock > 0 && <span className="ml-1 text-amber-500">⚠</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[item.status] || "bg-gray-100 text-gray-600"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#857467]">
                      {item.views.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-lg hover:bg-[#f7f4f0] flex items-center justify-center transition-colors">
                          <Edit size={13} className="text-[#857467]" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-[#f7f4f0] flex items-center justify-center transition-colors">
                          <Copy size={13} className="text-[#857467]" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors">
                          <Trash2 size={13} className="text-[#857467] hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#f0ede9]">
              {selected.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#534439]">{selected.length} selected</span>
                  {["Set Active", "Archive Selected", "Delete"].map((action) => (
                    <button key={action} className="px-3 py-1.5 bg-[#f7f4f0] border border-[#e4e2de] text-xs text-[#534439] font-medium rounded-lg hover:border-[#f4a460] transition-colors">
                      {action}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-[#857467] ml-auto">1 to {Math.min(10, filtered.length)} of {inventoryItems.length} entries</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
