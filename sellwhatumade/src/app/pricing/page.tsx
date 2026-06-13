import Link from "next/link";
import { Check, X, BadgeCheck, Star, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Free",
    tagline: "Start Small",
    price: 0,
    period: "/mo",
    description: "Perfect for artisans just starting out.",
    cta: "Get Started Free",
    ctaHref: "/seller/dashboard",
    highlight: false,
    features: [
      { label: "Commission", value: "10%" },
      { label: "Listings", value: "5 products" },
      { label: "Analytics", value: "Basic" },
      { label: "Featured Boosts", value: false },
      { label: "Mobile App", value: true },
      { label: "SEO Tools", value: false },
      { label: "Support", value: "Community" },
    ],
  },
  {
    name: "Basic",
    tagline: "Growth Phase",
    price: 499,
    period: "/mo",
    description: "For artisans ready to grow their customer base.",
    cta: "Upgrade Plan",
    ctaHref: "/seller/dashboard",
    highlight: true,
    badge: "Recommended",
    features: [
      { label: "Commission", value: "5%" },
      { label: "Listings", value: "50 products" },
      { label: "Analytics", value: "Standard" },
      { label: "Featured Boosts", value: "2/mo" },
      { label: "Mobile App", value: true },
      { label: "SEO Tools", value: true },
      { label: "Support", value: "Priority Email" },
    ],
  },
  {
    name: "Premium",
    tagline: "Global Reach",
    price: 999,
    period: "/mo",
    description: "For established artisans with global ambitions.",
    cta: "Go Premium",
    ctaHref: "/seller/dashboard",
    highlight: false,
    features: [
      { label: "Commission", value: "2%" },
      { label: "Listings", value: "Unlimited" },
      { label: "Analytics", value: "Advanced" },
      { label: "Featured Boosts", value: "Unlimited" },
      { label: "Mobile App", value: true },
      { label: "SEO Tools", value: true },
      { label: "Support", value: "24/7 Dedicated" },
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BadgeCheck size={16} className="text-[#006d3d]" />
            <span className="text-sm font-semibold text-[#006d3d]">Authentic Artisan Certified</span>
          </div>
          <h1 className="text-4xl font-bold text-[#1b1c1a] mb-4 leading-tight">
            Empower Your Craft
          </h1>
          <p className="text-lg text-[#534439] leading-relaxed">
            Choose a plan that fits where you are today. Upgrade anytime as your craft reaches more buyers.
          </p>
        </section>

        {/* Plans */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-6 flex flex-col gap-6 ${
                  plan.highlight
                    ? "bg-[#8d4f11] text-white shadow-artisan-lg ring-2 ring-[#f4a460]"
                    : "bg-white shadow-artisan border border-[#e4e2de]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-[#f4a460] text-white text-xs font-bold rounded-full shadow-sm">
                      <Zap size={11} fill="white" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${plan.highlight ? "text-[#ffdcc3]" : "text-[#857467]"}`}>
                    {plan.tagline}
                  </p>
                  <h2 className={`text-2xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-[#1b1c1a]"}`}>
                    {plan.name}
                  </h2>
                  <p className={`text-sm leading-relaxed ${plan.highlight ? "text-[#ffdcc3]" : "text-[#534439]"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-[#1b1c1a]"}`}>
                    {plan.price === 0 ? "₹0" : `₹${plan.price.toLocaleString("en-IN")}`}
                  </span>
                  <span className={`text-sm mb-1 ${plan.highlight ? "text-[#ffdcc3]" : "text-[#857467]"}`}>
                    {plan.period}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`btn-press w-full py-3.5 text-sm font-bold rounded-2xl text-center transition-colors ${
                    plan.highlight
                      ? "bg-white text-[#8d4f11] hover:bg-[#fbf9f5]"
                      : "bg-[#8d4f11] text-white hover:bg-[#6e3900]"
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map(({ label, value }) => (
                    <li key={label} className="flex items-center justify-between gap-2">
                      <span className={`text-sm ${plan.highlight ? "text-[#ffdcc3]" : "text-[#534439]"}`}>{label}</span>
                      <span className={`text-sm font-semibold flex items-center ${plan.highlight ? "text-white" : "text-[#1b1c1a]"}`}>
                        {value === true ? (
                          <Check size={15} className={plan.highlight ? "text-[#97f3b5]" : "text-[#006d3d]"} />
                        ) : value === false ? (
                          <X size={15} className={plan.highlight ? "text-[#f4a460]" : "text-[#d8c3b4]"} />
                        ) : (
                          value
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-artisan text-center flex flex-col items-center gap-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-[#f4a460] text-[#f4a460]" />
              ))}
            </div>
            <blockquote className="text-[#534439] text-base italic max-w-lg leading-relaxed">
              "Upgrading to Basic was the best decision for my pottery shop. My sales tripled in 2 months. The featured boosts gave me visibility I never expected."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#efeeea]">
                <img
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=80&q=80"
                  alt="Meera Kapoor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#1b1c1a]">Meera Kapoor</p>
                <p className="text-xs text-[#857467]">Traditional Potter · Jaipur</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#1b1c1a] text-center mb-8">Common Questions</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  q: "Can I switch plans anytime?",
                  a: "Yes. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
                },
                {
                  q: "What counts as a successful sale?",
                  a: "A sale is counted when a buyer completes payment and the order is confirmed. Commission is deducted from that amount.",
                },
                {
                  q: "Is there a setup fee?",
                  a: "No. All plans have zero setup fees. You only pay the monthly subscription and the commission on sales.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major cards, UPI, net banking, and wallets. Payouts are made to your registered bank account.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl p-5 shadow-artisan">
                  <h3 className="font-semibold text-[#1b1c1a] text-sm mb-2">{q}</h3>
                  <p className="text-sm text-[#534439] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
