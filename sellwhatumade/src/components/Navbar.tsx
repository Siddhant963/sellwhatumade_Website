"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, Package, Heart, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { count: cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [accountOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/marketplace?q=${encodeURIComponent(q)}` : "/marketplace");
    setMobileOpen(false);
  };

  const dashboardHref =
    user?.role === "admin" ? "/admin/dashboard" : user?.role === "seller" ? "/seller/dashboard" : null;

  return (
    <header className="sticky top-0 z-50 bg-[#fbf9f5]/95 backdrop-blur-sm border-b border-[#d8c3b4]/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/website_logo.png" alt="SellWhatUMade" width={400} height={100} className="object-contain h-14 w-auto max-w-[280px]" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Marketplace", href: "/marketplace" },
            { label: "Makers", href: "/makers" },
            { label: "About", href: "/about" },
            { label: "Pricing", href: "/pricing" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-[15px] font-medium text-[#534439] hover:text-[#8d4f11] hover:bg-[#f4a460]/10 rounded-xl transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search bar - desktop */}
        <form onSubmit={submitSearch} className="hidden lg:flex flex-1 max-w-xs relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handcrafted items..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#efeeea] border border-[#d8c3b4] rounded-full focus:outline-none focus:border-[#f4a460] focus:ring-2 focus:ring-[#f4a460]/20 transition placeholder:text-[#857467]"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Become a Seller CTA */}
          {(!isAuthenticated || user?.role === "user") && (
            <Link
              href="/seller/onboarding"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#006d3d] bg-[#97f3b5]/30 border border-[#97f3b5] rounded-full hover:bg-[#97f3b5]/50 transition-colors"
            >
              Sell on SWUM
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl hover:bg-[#efeeea] transition-colors text-[#534439]"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-[10px] font-bold bg-[#8d4f11] text-white rounded-full flex items-center justify-center leading-none px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          {isAuthenticated ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-[#efeeea] transition-colors text-[#534439]"
              >
                <span className="w-8 h-8 rounded-full bg-[#8d4f11] text-white flex items-center justify-center text-sm font-bold">
                  {(user?.fullName || user?.email || "U").charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                  {user?.fullName?.split(" ")[0] || "Account"}
                </span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-artisan border border-[#d8c3b4]/40 py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#d8c3b4]/40 mb-1">
                    <p className="text-sm font-semibold text-[#1b1c1a] truncate">{user?.fullName}</p>
                    <p className="text-xs text-[#857467] truncate">{user?.email}</p>
                  </div>
                  {dashboardHref && (
                    <MenuItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" onNavigate={() => setAccountOpen(false)} />
                  )}
                  <MenuItem href="/orders" icon={Package} label="My Orders" onNavigate={() => setAccountOpen(false)} />
                  <MenuItem href="/wishlist" icon={Heart} label="Wishlist" onNavigate={() => setAccountOpen(false)} />
                  <MenuItem href="/settings" icon={Settings} label="Settings" onNavigate={() => setAccountOpen(false)} />
                  <button
                    onClick={() => { setAccountOpen(false); logout().then(() => router.push("/")); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="p-2.5 rounded-xl hover:bg-[#efeeea] transition-colors text-[#534439]"
            >
              <User size={20} />
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-[#efeeea] transition-colors text-[#534439]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#fbf9f5] border-t border-[#d8c3b4]/40 px-6 py-4 flex flex-col gap-1">
          <form onSubmit={submitSearch} className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handcrafted items..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#efeeea] border border-[#d8c3b4] rounded-full focus:outline-none focus:border-[#f4a460]"
            />
          </form>
          {[
            { label: "Marketplace", href: "/marketplace" },
            { label: "Makers", href: "/makers" },
            { label: "About", href: "/about" },
            { label: "Pricing", href: "/pricing" },
            { label: "Sell on SWUM", href: "/seller/onboarding" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-[15px] font-medium text-[#534439] hover:text-[#8d4f11] hover:bg-[#f4a460]/10 rounded-xl transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function MenuItem({
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#534439] hover:bg-[#efeeea] transition-colors"
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}
