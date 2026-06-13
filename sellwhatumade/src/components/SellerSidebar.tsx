"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, Package, ShoppingBag, BarChart2, Wallet, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Products", href: "/seller/inventory" },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders" },
  { icon: Wallet, label: "Payouts", href: "/seller/payouts" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-[#1b1c1a] fixed top-0 left-0 h-full flex flex-col py-6 px-3 z-20">
      <Link href="/" className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-[#f4a460] flex items-center justify-center">
          <Leaf size={16} className="text-white" />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">Maker Studio</span>
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
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
          );
        })}
      </nav>
      <button
        onClick={() => logout().then(() => (window.location.href = "/"))}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#857467] hover:bg-white/5 hover:text-white transition-colors"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}
