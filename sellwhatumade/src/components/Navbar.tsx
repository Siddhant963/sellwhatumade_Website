"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, Leaf } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(2);

  return (
    <header className="sticky top-0 z-50 bg-[#fbf9f5]/95 backdrop-blur-sm border-b border-[#d8c3b4]/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#8d4f11] flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#1b1c1a] text-lg tracking-tight">
            SellWhatUMade
          </span>
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
        <div className="hidden lg:flex flex-1 max-w-xs relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]"
          />
          <input
            type="text"
            placeholder="Search handcrafted items..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#efeeea] border border-[#d8c3b4] rounded-full focus:outline-none focus:border-[#f4a460] focus:ring-2 focus:ring-[#f4a460]/20 transition placeholder:text-[#857467]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden md:flex p-2.5 rounded-xl hover:bg-[#efeeea] transition-colors text-[#534439]">
            <Search size={20} />
          </button>

          {/* Become a Seller CTA */}
          <Link
            href="/seller/onboarding"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#006d3d] bg-[#97f3b5]/30 border border-[#97f3b5] rounded-full hover:bg-[#97f3b5]/50 transition-colors"
          >
            Sell on SWUM
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl hover:bg-[#efeeea] transition-colors text-[#534439]"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-[10px] font-bold bg-[#8d4f11] text-white rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link href="/login" className="p-2.5 rounded-xl hover:bg-[#efeeea] transition-colors text-[#534439]">
            <User size={20} />
          </Link>

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
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
            <input
              type="text"
              placeholder="Search handcrafted items..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#efeeea] border border-[#d8c3b4] rounded-full focus:outline-none focus:border-[#f4a460]"
            />
          </div>
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
