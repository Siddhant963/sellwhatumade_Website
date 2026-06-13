import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, ShoppingCart, Heart, BadgeCheck, ChevronRight,
  Truck, RotateCcw, ShieldCheck, Minus, Plus, Share2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.id !== id).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-[#857467] mb-8">
            <Link href="/" className="hover:text-[#8d4f11] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace" className="hover:text-[#8d4f11] transition-colors">Marketplace</Link>
            <ChevronRight size={14} />
            <Link href={`/marketplace?category=${product.category.toLowerCase()}`} className="hover:text-[#8d4f11] transition-colors">
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#534439] font-medium truncate max-w-48">{product.name}</span>
          </nav>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-[#efeeea] shadow-artisan-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[product.image, ...Array(3).fill(product.image)].map((img, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                      i === 0 ? "border-[#f4a460]" : "border-transparent hover:border-[#d8c3b4]"
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              {/* Artisan */}
              <div className="flex items-center gap-2">
                <BadgeCheck size={15} className="text-[#006d3d]" />
                <span className="text-sm font-semibold text-[#534439]">{product.artisan}</span>
                <span className="text-sm text-[#857467]">· {product.artisanLocation}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-[#1b1c1a] leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(product.rating) ? "fill-[#f4a460] text-[#f4a460]" : "fill-[#e4e2de] text-[#e4e2de]"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#534439]">{product.rating}</span>
                <span className="text-sm text-[#857467]">({product.reviews} reviews)</span>
              </div>

              {/* Badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#97f3b5]/20 border border-[#97f3b5]/50 rounded-xl w-fit">
                <BadgeCheck size={14} className="text-[#006d3d]" />
                <span className="text-xs font-semibold text-[#006d3d]">Verified Authentic Artisan Certified</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#534439] leading-relaxed">{product.description}</p>

              {/* Material */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-[#1b1c1a]">Material:</span>
                <span className="px-3 py-1 bg-[#f4a460]/15 text-[#6e3900] rounded-full font-medium">{product.material}</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 py-4 border-t border-b border-[#efeeea]">
                <span className="text-4xl font-bold text-[#1b1c1a]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-[#857467] line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-bold text-[#006d3d] bg-[#97f3b5]/20 px-2.5 py-1 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              {/* Quantity + Stock */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#534439]">Quantity</span>
                <div className="flex items-center gap-2 bg-[#efeeea] rounded-xl p-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">1</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                {product.stock <= 5 && (
                  <span className="text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6] px-2.5 py-1 rounded-full">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <Link
                  href="/checkout"
                  className="btn-press flex-1 py-4 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  Buy It Now
                </Link>
                <button className="btn-press flex-1 py-4 border-2 border-[#006d3d] text-[#006d3d] hover:bg-[#97f3b5]/10 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button className="w-14 h-14 border border-[#d8c3b4] rounded-2xl flex items-center justify-center text-[#534439] hover:border-[#ba1a1a] hover:text-[#ba1a1a] transition-colors shrink-0">
                  <Heart size={18} />
                </button>
                <button className="w-14 h-14 border border-[#d8c3b4] rounded-2xl flex items-center justify-center text-[#534439] hover:border-[#8d4f11] hover:text-[#8d4f11] transition-colors shrink-0">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: "Secure Payment" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: RotateCcw, label: "7-Day Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-[#f5f3ef] rounded-xl text-center">
                    <Icon size={18} className="text-[#006d3d]" />
                    <span className="text-xs font-medium text-[#534439]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Artisan Story Section */}
          <div className="bg-white rounded-3xl p-8 shadow-artisan mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full bg-[#efeeea] overflow-hidden border-2 border-[#f4a460]">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"
                      alt={product.artisan}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <BadgeCheck size={20} className="absolute -bottom-1 -right-1 fill-[#006d3d] text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1b1c1a] text-lg">{product.artisan}</h3>
                  <p className="text-sm text-[#8d4f11] font-medium">{product.artisanLocation}</p>
                  <p className="text-xs text-[#857467] mt-1">{product.badge}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-sm font-bold text-[#8d4f11] uppercase tracking-wide mb-2">Story of the Craft</h4>
                <p className="text-sm text-[#534439] leading-relaxed">
                  With over 40 years of mastery, {product.artisan} has dedicated their life to preserving the ancient techniques of {product.category}. Each piece is made entirely by hand using methods passed down through generations, using only natural materials sourced from the local region.
                </p>
                <div className="flex gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8d4f11]">40+</div>
                    <div className="text-xs text-[#857467]">Years active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8d4f11]">500+</div>
                    <div className="text-xs text-[#857467]">Pieces sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8d4f11]">4.9★</div>
                    <div className="text-xs text-[#857467]">Avg rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#1b1c1a] mb-6">Customer Love</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { name: "Ananya P.", text: "Absolutely stunning piece. The craftsmanship is unparalleled.", rating: 5 },
                { name: "Vikram S.", text: "Arrived beautifully packed. Exactly as described.", rating: 5 },
                { name: "Meera R.", text: "Bought as a gift — everyone was amazed at the quality.", rating: 4 },
              ].map((review, i) => (
                <div key={i} className="bg-[#f5f3ef] rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} className={j < review.rating ? "fill-[#f4a460] text-[#f4a460]" : "fill-[#e4e2de] text-[#e4e2de]"} />
                    ))}
                  </div>
                  <p className="text-sm text-[#534439] italic">"{review.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#efeeea] flex items-center justify-center text-xs font-bold text-[#8d4f11]">
                      {review.name[0]}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-[#1b1c1a]">{review.name}</span>
                      <BadgeCheck size={12} className="fill-[#006d3d] text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1b1c1a] mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
