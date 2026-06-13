import Link from "next/link";
import { BadgeCheck, MapPin, Star, Package, Repeat2, ShoppingCart, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { artisans, products } from "@/lib/data";

const extendedArtisans = [
  ...artisans,
  {
    id: "4",
    name: "Raju Mistri",
    craft: "Dhokra Brass Caster",
    location: "Bastar, Chhattisgarh",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80",
    story: "Dhokra casting is 4,000 years old. I am a keeper of that flame, and my sons will carry it forward.",
    products: 18,
    rating: 4.8,
    certified: true,
    yearsActive: 22,
  },
];

const reviews = [
  {
    name: "Ananya P.",
    location: "Mumbai",
    rating: 5,
    text: "The blue pottery vase I received was absolutely stunning. The attention to detail and quality is beyond anything I could find locally.",
  },
  {
    name: "Rohan M.",
    location: "Bangalore",
    rating: 5,
    text: "Laxman's work is genuinely priceless. You can feel the love and craft in every piece. I've ordered from him three times now.",
  },
];

export default async function ArtisanStorefrontPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artisan = extendedArtisans.find((a) => a.id === id) || extendedArtisans[2];
  const artisanProducts = products.filter((p) => p.artisan === artisan.name || products.slice(0, 4));

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        {/* Hero banner */}
        <div className="h-48 bg-gradient-to-r from-[#8d4f11]/80 to-[#1b1c1a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=60"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 h-full flex items-end pb-0">
            <Link href="/makers" className="absolute top-5 left-6 flex items-center gap-1.5 text-white/80 text-sm hover:text-white">
              <ArrowLeft size={15} />
              All Artisans
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          {/* Profile header */}
          <div className="flex items-end gap-5 -mt-12 mb-8 relative">
            <div className="relative shrink-0">
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-artisan"
              />
              {artisan.certified && (
                <BadgeCheck size={22} className="absolute -bottom-1 -right-1 fill-[#006d3d] text-white" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-[#1b1c1a]">{artisan.name}</h1>
                {artisan.certified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#006d3d] bg-[#006d3d]/10 px-2.5 py-1 rounded-full">
                    <BadgeCheck size={11} />
                    Authentic Artisan Certified
                  </span>
                )}
              </div>
              <p className="text-[#8d4f11] font-semibold">{artisan.craft}</p>
              <p className="text-sm text-[#857467] flex items-center gap-1 mt-0.5">
                <MapPin size={12} />
                {artisan.location}
              </p>
            </div>
            <button className="shrink-0 px-5 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
              Contact Artisan
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 pb-16">
            <div className="flex-1">
              {/* About */}
              <div className="bg-white rounded-2xl shadow-artisan p-6 mb-5">
                <h2 className="font-bold text-[#1b1c1a] mb-3">About {artisan.name}</h2>
                <p className="text-sm text-[#534439] leading-relaxed">
                  {artisan.story} My family has been practicing this craft for generations, and I learned from my father at the age of 12. Today, I carry this tradition forward with pride, teaching younger artisans in my community to ensure this art form lives on.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Years Active", value: `${artisan.yearsActive}+` },
                  { label: "Products Sold", value: "1.2k+" },
                  { label: "Repeat Buyers", value: "24%" },
                  { label: "Avg Rating", value: artisan.rating.toString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl shadow-artisan p-4 text-center">
                    <p className="text-xl font-bold text-[#8d4f11]">{value}</p>
                    <p className="text-xs text-[#857467] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Products */}
              <h2 className="font-bold text-[#1b1c1a] mb-4">Crafts by {artisan.name.split(" ")[0]}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-artisan card-hover group">
                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-[#8d4f11] font-medium mb-0.5">{product.category}</p>
                      <h3 className="text-xs font-semibold text-[#1b1c1a] leading-snug line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1b1c1a]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <button className="w-7 h-7 rounded-lg bg-[#8d4f11]/10 hover:bg-[#8d4f11] flex items-center justify-center transition-colors group/btn">
                          <ShoppingCart size={12} className="text-[#8d4f11] group-hover/btn:text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <h2 className="font-bold text-[#1b1c1a] mb-4">Customer Reviews</h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#1b1c1a]">{artisan.rating}</p>
                  <div className="flex justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#f4a460] text-[#f4a460]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#857467] mt-0.5">127 reviews</p>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-[#857467] w-2">{star}</span>
                      <Star size={11} className="fill-[#f4a460] text-[#f4a460]" />
                      <div className="flex-1 bg-[#e4e2de] rounded-full h-1.5">
                        <div
                          className="bg-[#f4a460] h-1.5 rounded-full"
                          style={{ width: `${[75, 18, 5, 1, 1][5 - star]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {reviews.map((review, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-artisan p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#f4a460]/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#8d4f11]">{review.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1b1c1a]">{review.name}</p>
                          <p className="text-xs text-[#857467]">{review.location}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} size={12} className="fill-[#f4a460] text-[#f4a460]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#534439] leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-64 shrink-0 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h3 className="font-semibold text-[#1b1c1a] text-sm mb-3">Shop Stats</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: Package, label: "Products", value: `${artisan.products} listed` },
                    { icon: Star, label: "Rating", value: `${artisan.rating} / 5.0` },
                    { icon: Repeat2, label: "Repeat Buyers", value: "24%" },
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
                <p className="text-[#ffdcc3] text-xs mb-4">Every purchase directly benefits {artisan.name.split(" ")[0]}&apos;s family workshop</p>
                <Link
                  href="/marketplace"
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
