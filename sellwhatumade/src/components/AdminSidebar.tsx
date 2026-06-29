"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart2, Shield, ShoppingBag, Tags, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const navItems = [
  { icon: BarChart2, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Shield, label: "Sellers", href: "/admin/users" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: Tags, label: "Categories", href: "/admin/categories" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  return (
    <aside className="w-60 shrink-0 bg-[#1b1c1a] fixed top-0 left-0 h-full flex flex-col py-6 px-3 z-20">
      <Link href="/" className="flex items-center px-3 mb-5">
        <Image
          src="/website_logo.png"
          alt="SellWhatUMade"
          width={400}
          height={100}
          className="h-10 w-auto object-contain brightness-0 invert"
          priority
        />
      </Link>
      <nav className="flex flex-col gap-1 flex-1 mt-4">
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
