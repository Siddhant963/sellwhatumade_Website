import Link from "next/link";
import { Leaf, Camera, MessageCircle, Share2, Play, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1b1c1a] text-[#e4e2de] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#f4a460] flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">SellWhatUMade</span>
            </Link>
            <p className="text-sm text-[#857467] leading-relaxed max-w-xs">
              Connecting rural artisans directly with conscious consumers. Every purchase honors a craft, supports a family, and preserves a heritage.
            </p>
            <div className="flex items-center gap-1 px-3 py-2 bg-[#006d3d]/20 border border-[#006d3d]/40 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-[#97f3b5]" />
              <span className="text-xs font-medium text-[#97f3b5]">Authentic Artisan Certified Platform</span>
            </div>
            <div className="flex gap-3">
              {[Camera, MessageCircle, Share2, Play].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl bg-[#30312e] hover:bg-[#f4a460]/20 flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-[#857467] hover:text-[#f4a460]" />
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Platform</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Marketplace", href: "/marketplace" },
                { label: "Maker Stories", href: "/makers" },
                { label: "Become a Seller", href: "/seller/onboarding" },
                { label: "Pricing", href: "/pricing" },
                { label: "About Us", href: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#857467] hover:text-[#f4a460] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Support</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Help Center", href: "/help" },
                { label: "Shipping & Returns", href: "/returns" },
                { label: "Authenticity Guarantee", href: "/about" },
                { label: "Seller Dashboard", href: "/seller/dashboard" },
                { label: "My Orders", href: "/orders" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#857467] hover:text-[#f4a460] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Stay Connected</h4>
            <p className="text-sm text-[#857467] leading-relaxed">
              Get stories from the craft room, new arrivals, and exclusive maker highlights.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#534439]" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-8 pr-3 py-2.5 text-sm bg-[#30312e] border border-[#534439] rounded-xl focus:outline-none focus:border-[#f4a460] text-white placeholder:text-[#534439]"
                />
              </div>
              <button className="px-4 py-2.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#30312e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#534439]">© 2024 SellWhatUMade. Honoring Craftsmanship.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Sustainability Report"].map((item) => (
              <Link key={item} href="#" className="text-sm text-[#534439] hover:text-[#f4a460] transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
