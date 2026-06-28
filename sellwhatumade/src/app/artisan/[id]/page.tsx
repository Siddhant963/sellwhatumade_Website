import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Star, Package, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { serverFetchOrNull } from "@/lib/api/server";
import { formatPaise } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import type { PublicArtisan, PaginatedResult, Product } from "@/lib/api/types";

const AVATAR_PLACEHOLDER = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80";

export default async function ArtisanStorefrontPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [artisan, productsRes] = await Promise.all([
    serverFetchOrNull<PublicArtisan>(`/api/v1/artisans/${id}`),
    serverFetchOrNull<PaginatedResult<Product>>(
      `/api/v1/products?sellerId=${id}&limit=6`,
    ),
  ]);

  if (!artisan) notFound();

  const artisanProducts = productsRes?.data ?? [];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        {/* Hero banner */}
        <div className="h-48 bg-gradient-to-r from-[#8d4f11]/80 to-[#1b1c1a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {artisan.shopLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artisan.shopLogo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#f4a460]/30 to-[#97f3b5]/10" />
            )}
          </div>
          <div className="max-w-6xl mx-auto px-6 h-full relative">
            <Link
              href="/makers"
              className="absolute top-5 left-6 flex items-center gap-1.5 text-white/80 text-sm hover:text-white transition-colors"
            >
              <ArrowLeft size={15} />
              All Artisans
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          {/* Profile header */}
          <div className="flex items-end gap-5 -mt-12 mb-8 relative">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artisan.avatar ?? AVATAR_PLACEHOLDER}
                alt={artisan.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-artisan"
              />
              {artisan.isVerified && (
                <BadgeCheck
                  size={22}
                  className="absolute -bottom-1 -right-1 fill-[#006d3d] text-white"
                />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-[#1b1c1a]">{artisan.name}</h1>
                {artisan.isVerified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#006d3d] bg-[#006d3d]/10 px-2.5 py-1 rounded-full">
                    <BadgeCheck size={11} />
                    Authentic Artisan Certified
                  </span>
                )}
              </div>
              {artisan.specialization && (
                <p className="text-[#8d4f11] font-semibold">{artisan.specialization}</p>
              )}
              {artisan.location && (
                <p className="text-sm text-[#857467] flex items-center gap-1 mt-0.5">
                  <MapPin size={12} />
                  {artisan.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 pb-16">
            <div className="flex-1">
              {/* About */}
              <div className="bg-white rounded-2xl shadow-artisan p-6 mb-5">
                <h2 className="font-bold text-[#1b1c1a] mb-3">About {artisan.name}</h2>
                <p className="text-sm text-[#534439] leading-relaxed">
                  {artisan.story ||
                    `${artisan.name} is a skilled artisan specialising in ${artisan.specialization || "traditional crafts"}, bringing authentic handmade pieces from ${artisan.location || "India"}.`}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  {
                    label: "Years Active",
                    value: artisan.yearsExperience > 0 ? `${artisan.yearsExperience}+` : "—",
                  },
                  { label: "Total Orders", value: artisan.totalOrders > 0 ? `${artisan.totalOrders}` : "—" },
                  { label: "Products Listed", value: String(artisan.totalProducts) },
                  {
                    label: "Avg Rating",
                    value: artisan.rating > 0 ? artisan.rating.toFixed(1) : "New",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl shadow-artisan p-4 text-center">
                    <p className="text-xl font-bold text-[#8d4f11]">{value}</p>
                    <p className="text-xs text-[#857467] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Products */}
              <h2 className="font-bold text-[#1b1c1a] mb-4">
                Crafts by {artisan.name.split(" ")[0]}
              </h2>
              {artisanProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-artisan p-8 text-center text-[#857467] text-sm mb-8">
                  No products listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {artisanProducts.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-artisan card-hover group"
                    >
                      <div className="overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images?.[0] || PLACEHOLDER_IMAGE}
                          alt={product.name}
                          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-semibold text-[#1b1c1a] leading-snug line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#1b1c1a]">
                            {formatPaise(product.pricePaise)}
                          </span>
                          {product.rating > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-[#857467]">
                              <Star size={10} className="fill-[#f4a460] text-[#f4a460]" />
                              {product.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-64 shrink-0 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h3 className="font-semibold text-[#1b1c1a] text-sm mb-3">Shop Stats</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: Package, label: "Products", value: `${artisan.totalProducts} listed` },
                    {
                      icon: Star,
                      label: "Rating",
                      value:
                        artisan.rating > 0
                          ? `${artisan.rating.toFixed(1)} / 5.0`
                          : "Not rated yet",
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#857467]">
                        <Icon size={14} />
                        {label}
                      </div>
                      <span className="text-sm font-semibold text-[#1b1c1a]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#8d4f11] rounded-2xl p-5 text-center">
                <p className="text-white font-semibold text-sm mb-1">Support this artisan</p>
                <p className="text-[#ffdcc3] text-xs mb-4">
                  Every purchase directly benefits {artisan.name.split(" ")[0]}&apos;s craft
                </p>
                <Link
                  href={`/marketplace?sellerId=${artisan.userId}`}
                  className="btn-press block w-full py-2.5 bg-white text-[#8d4f11] text-sm font-bold rounded-xl hover:bg-[#fbf9f5] transition-colors"
                >
                  Shop Their Crafts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
