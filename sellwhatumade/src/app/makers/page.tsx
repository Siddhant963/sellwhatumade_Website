import Link from "next/link";
import { BadgeCheck, Search, Star, Package, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { artisans } from "@/lib/data";

const allMakers = [
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
  {
    id: "5",
    name: "Balu Vitthal",
    craft: "Warli Tribal Artist",
    location: "Palghar, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    story: "Warli art is the language of my tribe. Each circle and triangle is a prayer for the harvest.",
    products: 11,
    rating: 4.7,
    certified: true,
    yearsActive: 9,
  },
  {
    id: "6",
    name: "Farida Khatun",
    craft: "Pashmina Weaver",
    location: "Srinagar, J&K",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    story: "Each shawl takes 3 weeks to weave. It holds the warmth of the Himalayas and the love of my hands.",
    products: 7,
    rating: 4.9,
    certified: true,
    yearsActive: 15,
  },
];

export default function MakersPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        {/* Hero */}
        <section className="bg-[#1b1c1a] py-16 px-6 text-center">
          <p className="text-sm text-[#f4a460] font-semibold uppercase tracking-widest mb-3">The Makers</p>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            The Hands Behind Every Piece
          </h1>
          <p className="text-[#857467] text-lg max-w-xl mx-auto leading-relaxed">
            Each maker on our platform is a verified artisan preserving a traditional craft. Their stories are as beautiful as their work.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
              <input
                type="text"
                placeholder="Search makers or craft..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Textiles", "Pottery", "Paintings", "Metal Craft", "Wood Craft"].map((cat) => (
                <button
                  key={cat}
                  className={`px-3.5 py-2 text-xs font-medium rounded-full border transition-colors ${
                    cat === "All"
                      ? "bg-[#8d4f11] text-white border-[#8d4f11]"
                      : "bg-white text-[#534439] border-[#d8c3b4] hover:border-[#f4a460]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Makers grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMakers.map((maker) => (
              <div key={maker.id} className="bg-white rounded-2xl overflow-hidden shadow-artisan card-hover">
                {/* Cover */}
                <div className="h-28 bg-gradient-to-br from-[#f4a460]/20 to-[#97f3b5]/10 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="relative">
                      <img
                        src={maker.avatar}
                        alt={maker.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-artisan"
                      />
                      {maker.certified && (
                        <BadgeCheck size={20} className="absolute -bottom-1 -right-1 fill-[#006d3d] text-white" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-14 px-5 pb-5 flex flex-col gap-4 text-center">
                  <div>
                    <h3 className="font-bold text-[#1b1c1a] text-base">{maker.name}</h3>
                    <p className="text-sm text-[#8d4f11] font-medium">{maker.craft}</p>
                    <p className="text-xs text-[#857467] flex items-center justify-center gap-1 mt-1">
                      <MapPin size={11} />
                      {maker.location}
                    </p>
                  </div>

                  <blockquote className="text-xs text-[#534439] italic leading-relaxed border-l-2 border-[#f4a460] text-left pl-3">
                    "{maker.story}"
                  </blockquote>

                  <div className="flex justify-center gap-6 text-xs">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-[#f4a460] text-[#f4a460]" />
                      <span className="font-bold text-[#534439]">{maker.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package size={12} className="text-[#857467]" />
                      <span className="text-[#857467]">{maker.products} crafts</span>
                    </div>
                    <span className="text-[#857467]">{maker.yearsActive}y exp</span>
                  </div>

                  <Link
                    href="/marketplace"
                    className="btn-press w-full py-2.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Shop Their Craft
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Become a seller CTA */}
          <div className="mt-16 bg-[#8d4f11] rounded-3xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Are You an Artisan?</h2>
            <p className="text-[#ffdcc3] mb-6 max-w-md mx-auto">
              Join our community of verified makers and share your craft with the world.
            </p>
            <Link
              href="/seller/dashboard"
              className="btn-press inline-block px-8 py-3.5 bg-white text-[#8d4f11] font-bold rounded-2xl hover:bg-[#fbf9f5] transition-colors"
            >
              Start Selling Free →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
