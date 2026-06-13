import Link from "next/link";
import { Leaf, Users, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart2, Shield, FileText, Package } from "lucide-react";

const navItems = [
  { icon: BarChart2, label: "Dashboard", href: "/admin/dashboard", active: true },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Shield, label: "Sellers", href: "/admin/sellers" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: AlertTriangle, label: "Disputes", href: "/admin/disputes" },
  { icon: DollarSign, label: "Commission", href: "/admin/commission" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
];

const recentOrders = [
  { id: "#AD-9301", buyer: "Priya Deshmukh", seller: "Laxman Singh", amount: 3450, status: "Delivered" },
  { id: "#AD-9298", buyer: "Rohan Mehta", seller: "Kamala Devi", amount: 5800, status: "Shipped" },
  { id: "#AD-9295", buyer: "Ananya Roy", seller: "Sunita Devi", amount: 6200, status: "Processing" },
  { id: "#AD-9290", buyer: "James Wilson", seller: "Raju Mistri", amount: 2100, status: "Pending" },
  { id: "#AD-9285", buyer: "Meera Kapoor", seller: "Balu Vitthal", amount: 1800, status: "Cancelled" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const revenueData = [280000, 345000, 312000, 428000, 389000, 428500];

export default function AdminDashboard() {
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#1b1c1a] fixed top-0 left-0 h-full flex flex-col py-6 px-3 z-20">
        <Link href="/" className="flex items-center gap-2 px-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">Admin Panel</span>
        </Link>
        <div className="flex items-center gap-2 px-3 mb-6 pb-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#8d4f11] flex items-center justify-center">
            <span className="text-xs font-bold text-white">SA</span>
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Super Admin</p>
            <p className="text-[#857467] text-xs">siddhantd@72dragons.com</p>
          </div>
        </div>
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

      <main className="ml-60 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Admin Dashboard</h1>
            <p className="text-sm text-[#857467] mt-1">Platform overview — June 2024</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Users, label: "Total Users", value: "24,850", trend: "+12.4%", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Shield, label: "Active Sellers", value: "1,240", trend: "+8.1%", color: "text-[#8d4f11]", bg: "bg-[#8d4f11]/10" },
              { icon: ShoppingBag, label: "Total Orders", value: "8,921", trend: "+15.2%", color: "text-[#006d3d]", bg: "bg-[#006d3d]/10" },
              { icon: TrendingUp, label: "GMV (June)", value: "₹42.8L", trend: "+18.5%", color: "text-purple-600", bg: "bg-purple-50" },
            ].map(({ icon: Icon, label, value, trend, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl shadow-artisan p-5">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-xs text-[#857467]">{label}</p>
                <p className="text-xl font-bold text-[#1b1c1a] mt-0.5">{value}</p>
                <p className={`text-xs font-medium ${color} mt-0.5`}>{trend} this month</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            {/* Revenue chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-artisan p-5">
              <h2 className="font-semibold text-[#1b1c1a] mb-5">Platform Revenue (GMV)</h2>
              <div className="flex items-end gap-2 h-36">
                {months.map((month, i) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs font-bold text-[#534439]">₹{(revenueData[i] / 100000).toFixed(1)}L</span>
                    <div
                      className="w-full bg-gradient-to-t from-[#8d4f11] to-[#f4a460] rounded-t-xl"
                      style={{ height: `${(revenueData[i] / maxRevenue) * 90}px` }}
                    />
                    <span className="text-xs text-[#857467]">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl shadow-artisan p-5">
              <h2 className="font-semibold text-[#1b1c1a] mb-4">Platform Health</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Pending Verifications", value: "23", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Open Disputes", value: "7", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
                  { label: "Orders Today", value: "142", icon: ShoppingBag, color: "text-[#006d3d]", bg: "bg-[#006d3d]/10" },
                  { label: "Commission Earned", value: "₹1.2L", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-[#f7f4f0] rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                        <Icon size={13} className={color} />
                      </div>
                      <span className="text-xs text-[#534439]">{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f0ede9] flex items-center justify-between">
              <h2 className="font-semibold text-[#1b1c1a]">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#8d4f11] font-semibold hover:underline">
                View All
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0ede9]">
                  {["Order ID", "Buyer", "Seller", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5]">
                    <td className="px-4 py-3.5 text-xs font-bold text-[#8d4f11]">{order.id}</td>
                    <td className="px-4 py-3.5 text-sm text-[#534439]">{order.buyer}</td>
                    <td className="px-4 py-3.5 text-sm text-[#534439]">{order.seller}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-[#1b1c1a]">₹{order.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.status === "Delivered" ? "bg-[#006d3d]/10 text-[#006d3d]" :
                        order.status === "Shipped" ? "bg-purple-50 text-purple-600" :
                        order.status === "Processing" ? "bg-blue-50 text-blue-600" :
                        order.status === "Pending" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {order.status}
                      </span>
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
