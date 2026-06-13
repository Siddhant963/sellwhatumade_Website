"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf, Search, Users, Shield, ShoppingBag, BarChart2, AlertTriangle, DollarSign, FileText, Package, ChevronDown, Eye, Ban } from "lucide-react";

const navItems = [
  { icon: BarChart2, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Users", href: "/admin/users", active: true },
  { icon: Shield, label: "Sellers", href: "/admin/sellers" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: AlertTriangle, label: "Disputes", href: "/admin/disputes" },
  { icon: DollarSign, label: "Commission", href: "/admin/commission" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
];

const users = [
  { id: 1, name: "Priya Deshmukh", email: "priya@email.com", role: "Buyer", location: "Mumbai", joined: "Jan 2024", orders: 12, status: "Active" },
  { id: 2, name: "Rohan Mehta", email: "rohan@email.com", role: "Buyer", location: "Bangalore", joined: "Feb 2024", orders: 8, status: "Active" },
  { id: 3, name: "Ananya Roy", email: "ananya@email.com", role: "Buyer", location: "Kolkata", joined: "Mar 2024", orders: 5, status: "Active" },
  { id: 4, name: "Laxman Singh", email: "laxman@art.com", role: "Seller", location: "Jaipur", joined: "Jan 2024", orders: 145, status: "Active" },
  { id: 5, name: "Kamala Devi", email: "kamala@art.com", role: "Seller", location: "Varanasi", joined: "Feb 2024", orders: 98, status: "Active" },
  { id: 6, name: "James Wilson", email: "james@email.com", role: "Buyer", location: "Delhi", joined: "Apr 2024", orders: 3, status: "Suspended" },
  { id: 7, name: "Sunita Devi", email: "sunita@art.com", role: "Seller", location: "Madhubani", joined: "Mar 2024", orders: 62, status: "Active" },
  { id: 8, name: "Meera Kapoor", email: "meera@email.com", role: "Buyer", location: "Jaipur", joined: "May 2024", orders: 15, status: "Active" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <aside className="w-60 shrink-0 bg-[#1b1c1a] fixed top-0 left-0 h-full flex flex-col py-6 px-3 z-20">
        <Link href="/" className="flex items-center gap-2 px-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">Admin Panel</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1 mt-4">
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

      <main className="ml-60 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">User Management</h1>
              <p className="text-sm text-[#857467] mt-1">24,850 registered users</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 text-sm">
                {["All", "Buyer", "Seller"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 rounded-xl border transition-colors ${
                      roleFilter === role ? "bg-[#8d4f11] text-white border-[#8d4f11]" : "bg-white text-[#534439] border-[#d8c3b4] hover:border-[#f4a460]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-artisan p-4 mb-4">
            <div className="relative max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#fbf9f5] border border-[#e4e2de] rounded-xl focus:outline-none focus:border-[#f4a460]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0ede9]">
                  {["User", "Role", "Location", "Joined", "Orders / Sales", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f4a460]/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#8d4f11]">{user.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1b1c1a]">{user.name}</p>
                          <p className="text-xs text-[#857467]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.role === "Seller" ? "bg-[#8d4f11]/10 text-[#8d4f11]" : "bg-blue-50 text-blue-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#534439]">{user.location}</td>
                    <td className="px-4 py-3.5 text-xs text-[#857467]">{user.joined}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#1b1c1a]">{user.orders}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.status === "Active" ? "bg-[#006d3d]/10 text-[#006d3d]" : "bg-red-50 text-red-600"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-lg hover:bg-[#f7f4f0] flex items-center justify-center">
                          <Eye size={13} className="text-[#857467]" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Ban size={13} className="text-[#857467] hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-[#f0ede9]">
              <p className="text-xs text-[#857467]">Showing {filtered.length} of {users.length} users</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
