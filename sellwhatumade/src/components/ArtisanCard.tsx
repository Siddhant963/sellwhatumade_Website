import Link from "next/link";
import { BadgeCheck, Star, Package } from "lucide-react";
import type { PublicArtisan } from "@/lib/api/types";

const AVATAR_PLACEHOLDER = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80";

export default function ArtisanCard({ artisan }: { artisan: PublicArtisan }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-artisan card-hover flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artisan.avatar ?? AVATAR_PLACEHOLDER}
            alt={`${artisan.name}, ${artisan.specialization || "artisan"} from ${artisan.location || "India"}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#f4a460]"
          />
          {artisan.isVerified && (
            <BadgeCheck
              size={18}
              className="absolute -bottom-1 -right-1 fill-[#006d3d] text-white"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/artisan/${artisan.userId}`}
            className="font-semibold text-[#1b1c1a] text-base hover:text-[#8d4f11] transition-colors"
          >
            {artisan.name}
          </Link>
          <p className="text-sm text-[#8d4f11] font-medium">
            {artisan.specialization || artisan.shopName}
          </p>
          <p className="text-xs text-[#857467] mt-0.5">{artisan.location}</p>
        </div>
      </div>

      {/* Story */}
      {artisan.story ? (
        <blockquote className="text-sm text-[#534439] italic leading-relaxed border-l-2 border-[#f4a460] pl-3 line-clamp-3">
          &ldquo;{artisan.story}&rdquo;
        </blockquote>
      ) : (
        <p className="text-sm text-[#857467] italic pl-3">
          {artisan.specialization
            ? `Specialises in ${artisan.specialization} from ${artisan.location || "India"}.`
            : `Authentic handcrafted products from ${artisan.location || "India"}.`}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-[#f4a460] text-[#f4a460]" />
          <span className="font-semibold text-[#534439]">
            {artisan.rating > 0 ? artisan.rating.toFixed(1) : "New"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Package size={12} className="text-[#857467]" />
          <span className="text-[#857467]">{artisan.totalProducts} products</span>
        </div>
        {artisan.yearsExperience > 0 && (
          <span className="text-[#857467]">{artisan.yearsExperience} yrs active</span>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/artisan/${artisan.userId}`}
        className="btn-press w-full py-2.5 bg-[#f4a460]/15 border border-[#f4a460]/50 text-[#6e3900] text-sm font-semibold rounded-xl hover:bg-[#f4a460]/25 transition-colors text-center block"
      >
        Buy Their Craft →
      </Link>
    </div>
  );
}
