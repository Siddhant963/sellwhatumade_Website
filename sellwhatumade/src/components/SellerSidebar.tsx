"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, BarChart2, Wallet, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Products", href: "/seller/inventory" },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders" },
  { icon: Wallet, label: "Payouts", href: "/seller/payouts" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: Settings, label: "Settings", href: "/seller/settings" },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile/tablet top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#1b1c1a] flex items-center justify-between px-4 z-30">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/website_logo.png" alt="SellWhatUMade" width={112} height={28} className="object-contain h-7 w-auto" />
          <span className="font-bold text-white text-sm tracking-tight">Maker Studio</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-white p-2 -mr-2"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop (mobile/tablet only, when drawer open) */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`w-56 shrink-0 bg-[#1b1c1a] fixed top-0 left-0 h-full flex flex-col py-6 px-3 z-30 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <Link href="/" className="hidden lg:flex items-center gap-2 px-3 mb-8">
          <Image src="/website_logo.png" alt="SellWhatUMade" width={128} height={32} className="object-contain h-8 w-auto" />
          <span className="font-bold text-white text-sm tracking-tight">Maker Studio</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1 mt-14 lg:mt-0">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
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
    </>
  );
}
