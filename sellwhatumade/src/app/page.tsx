import Link from "next/link";
import { Leaf, MapPin } from "lucide-react";

export const metadata = {
  title: "SellWhatUMade — Coming Soon",
  description:
    "A marketplace for authentic handcrafted treasures from rural Indian artisans. Launching soon in India.",
};

export default function ComingSoonPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#fbf9f5] px-6 text-center">
      {/* ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f4a460]/10 via-transparent to-[#97f3b5]/8 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f4a460]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#97f3b5]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#8d4f11] flex items-center justify-center shadow-artisan-lg">
            <Leaf size={28} className="text-white" />
          </div>
          <span className="text-3xl font-bold text-[#1b1c1a] tracking-tight">
            SellWhatUMade
          </span>
        </div>

        {/* Coming soon badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#97f3b5]/20 border border-[#97f3b5]/50 rounded-full">
          <MapPin size={15} className="text-[#006d3d]" />
          <span className="text-sm font-semibold text-[#006d3d]">
            Coming soon to India
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl lg:text-6xl font-bold text-[#1b1c1a] leading-[1.15] tracking-tight">
          Something handmade is{" "}
          <span className="text-[#8d4f11] relative">
            on its way
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#f4a460]/60 rounded-full" />
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg text-[#534439] leading-relaxed max-w-lg">
          SellWhatUMade is a marketplace for authentic handcrafted treasures from
          rural Indian artisans. Every purchase will directly support a maker and
          help preserve centuries-old crafts. We&apos;re putting the finishing
          touches on something special — stay tuned.
        </p>

        {/* Sneak peek link */}
        <Link
          href="/home"
          className="btn-press px-8 py-4 bg-[#8d4f11] text-white font-bold rounded-2xl hover:bg-[#6e3900] transition-colors shadow-artisan"
        >
          Take a sneak peek →
        </Link>

        <p className="text-xs text-[#857467]">
          © {new Date().getFullYear()} SellWhatUMade · Made in India
        </p>
      </div>
    </main>
  );
}
