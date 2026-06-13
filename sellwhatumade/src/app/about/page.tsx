import Link from "next/link";
import { Users, Globe, TrendingUp, Heart, ShieldCheck, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  {
    name: "Arjun Sharma",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
  },
  {
    name: "Priya Iyer",
    role: "Head of Artisan Relations",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
  },
  {
    name: "Karthik Raj",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Sana Khan",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
];

const press = ["The Economic Times", "VOGUE", "YourStory", "Better India", "Forbes"];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        {/* Hero */}
        <section className="bg-[#1b1c1a] py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-[#f4a460]" />
            <div className="absolute bottom-0 right-20 w-48 h-48 rounded-full bg-[#006d3d]" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-[#f4a460] uppercase tracking-widest mb-3">Our Story</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              We Believe Every Craft Deserves a Stage
            </h1>
            <p className="text-lg text-[#857467] leading-relaxed">
              SellWhatUMade connects India&apos;s rural artisans with global urban markets through authentic, sustainable, and fair commerce.
            </p>
          </div>
        </section>

        {/* Origin story */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-[#8d4f11] uppercase tracking-widest mb-3">Origin</p>
              <h2 className="text-3xl font-bold text-[#1b1c1a] mb-5 leading-tight">
                A Journey to the Ghats of Varanasi
              </h2>
              <div className="flex flex-col gap-4 text-[#534439] leading-relaxed">
                <p>
                  In 2018, our founder Arjun Sharma visited Varanasi to observe the renowned silk weavers of the city. He was struck by a painful paradox: artisans who spent weeks crafting intricate Banarasi sarees earned just ₹500, while the same pieces retailed for ₹25,000 in Delhi showrooms.
                </p>
                <p>
                  The middlemen took everything. The artisans, the creators of true value, were left with almost nothing. That single observation became the founding idea: remove the middlemen, give artisans a direct digital storefront, and let them earn what their craft deserves.
                </p>
                <p>
                  Today, SellWhatUMade empowers 1,240+ artisans across 28 states, ensuring they receive at least 85% of every sale.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80"
                alt="Varanasi loom"
                className="w-full h-80 object-cover rounded-3xl shadow-artisan"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-artisan p-4">
                <p className="text-2xl font-bold text-[#8d4f11]">₹4.2 Cr</p>
                <p className="text-xs text-[#857467]">Artisan earnings to date</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact stats */}
        <section className="bg-[#1b1c1a] py-14 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm font-semibold text-[#f4a460] uppercase tracking-widest mb-2">Impact</p>
            <h2 className="text-3xl font-bold text-white text-center mb-3">Empowerment Beyond Economics</h2>
            <p className="text-center text-[#857467] max-w-xl mx-auto mb-10 leading-relaxed">
              We measure success not just in revenue, but in techniques revived, communities educated, and cultural pride renewed.
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: "1,240+", label: "Artisans Empowered" },
                { value: "28", label: "States Represented" },
                { value: "₹4.2 Cr", label: "Artisan Earnings" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-4xl font-bold text-[#f4a460]">{value}</p>
                  <p className="text-[#857467] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-center text-sm font-semibold text-[#8d4f11] uppercase tracking-widest mb-2">Our Principles</p>
          <h2 className="text-3xl font-bold text-[#1b1c1a] text-center mb-10">The Pillars of Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Authenticity",
                desc: "Every product is vetted for its origin and handmade nature. No factory replicas, no mass-produced counterfeits.",
                color: "bg-[#8d4f11]/10 text-[#8d4f11]",
              },
              {
                icon: Heart,
                title: "Fair Pay",
                desc: "Artisans receive at least 85% of every sale — compared to the 20-30% they earn through traditional retail channels.",
                color: "bg-[#006d3d]/10 text-[#006d3d]",
              },
              {
                icon: Leaf,
                title: "Preservation",
                desc: "Commercial viability is the only sustainable path to intergenerational craft continuity. We make it possible.",
                color: "bg-amber-50 text-amber-700",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl shadow-artisan p-6">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-[#1b1c1a] mb-2">{title}</h3>
                <p className="text-sm text-[#534439] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-[#f0ede9] py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm font-semibold text-[#8d4f11] uppercase tracking-widest mb-2">Team</p>
            <h2 className="text-3xl font-bold text-[#1b1c1a] text-center mb-10">The People Behind the Platform</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {team.map(({ name, role, image }) => (
                <div key={name} className="bg-white rounded-2xl shadow-artisan overflow-hidden text-center">
                  <img src={image} alt={name} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <p className="font-bold text-[#1b1c1a] text-sm">{name}</p>
                    <p className="text-xs text-[#8d4f11] mt-0.5">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press */}
        <section className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#857467] uppercase tracking-widest mb-6">As Seen In</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {press.map((name) => (
              <div key={name} className="px-5 py-2 bg-white border border-[#e4e2de] rounded-xl shadow-sm">
                <span className="text-sm font-bold text-[#534439]">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#8d4f11] py-16 px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Be Part of the Story?</h2>
          <p className="text-[#ffdcc3] mb-8 max-w-md mx-auto">
            Whether you create beautiful things or love collecting them — there&apos;s a place for you here.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/seller/onboarding"
              className="btn-press px-7 py-3.5 bg-white text-[#8d4f11] font-bold rounded-2xl hover:bg-[#fbf9f5] transition-colors"
            >
              Sell with us
            </Link>
            <Link
              href="/marketplace"
              className="btn-press px-7 py-3.5 bg-[#6e3900] text-white font-bold rounded-2xl hover:bg-[#5a2e00] border border-[#f4a460]/30 transition-colors"
            >
              Start exploring
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
