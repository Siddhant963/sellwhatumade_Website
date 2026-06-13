import Link from "next/link";
import { BadgeCheck, Star, Package } from "lucide-react";

interface Artisan {
  id: string;
  name: string;
  craft: string;
  location: string;
  avatar: string;
  story: string;
  products: number;
  rating: number;
  certified: boolean;
  yearsActive: number;
}

export default function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-artisan card-hover flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#f4a460]"
          />
          {artisan.certified && (
            <BadgeCheck
              size={18}
              className="absolute -bottom-1 -right-1 fill-[#006d3d] text-white"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/artisan/${artisan.id}`} className="font-semibold text-[#1b1c1a] text-base hover:text-[#8d4f11] transition-colors">
            {artisan.name}
          </Link>
          <p className="text-sm text-[#8d4f11] font-medium">{artisan.craft}</p>
          <p className="text-xs text-[#857467] mt-0.5">{artisan.location}</p>
        </div>
      </div>

      {/* Story */}
      <blockquote className="text-sm text-[#534439] italic leading-relaxed border-l-2 border-[#f4a460] pl-3">
        "{artisan.story}"
      </blockquote>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-[#f4a460] text-[#f4a460]" />
          <span className="font-semibold text-[#534439]">{artisan.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Package size={12} className="text-[#857467]" />
          <span className="text-[#857467]">{artisan.products} products</span>
        </div>
        <span className="text-[#857467]">{artisan.yearsActive} yrs active</span>
      </div>

      {/* CTA */}
      <Link
        href={`/artisan/${artisan.id}`}
        className="btn-press w-full py-2.5 bg-[#f4a460]/15 border border-[#f4a460]/50 text-[#6e3900] text-sm font-semibold rounded-xl hover:bg-[#f4a460]/25 transition-colors text-center block"
      >
        Buy Their Craft →
      </Link>
    </div>
  );
}
