import type { Metadata } from "next";
import { Package, CreditCard, ShieldCheck, Truck, User, MessageCircle, MessageSquare, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HelpSearchBox from "@/components/HelpSearchBox";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE_URL } from "@/lib/seo";

const topics = [
  { icon: Package, label: "Orders", desc: "Tracking, cancellations, and order history" },
  { icon: CreditCard, label: "Payments", desc: "Payment methods, refunds, and billing issues" },
  { icon: ShieldCheck, label: "Authenticity", desc: "Artisan Certification and craft verification" },
  { icon: Truck, label: "Shipping", desc: "Delivery timelines, rates, and partners" },
  { icon: User, label: "Account", desc: "Settings, security, and notification preferences" },
  { icon: MessageCircle, label: "Contact", desc: "Direct channels to makers and our support team" },
];

const faqs = [
  {
    q: "How do I know a product is genuinely handmade?",
    a: "Every product on SellWhatUMade comes with a digital authenticity certificate verified by our team. You can scan the QR code on your packaging to see the artisan's profile, video of the craft process, and the official certificate.",
  },
  {
    q: "What happens if my item arrives damaged?",
    a: "Submit a damage claim through your order history within 48 hours of delivery. Upload photos of the damaged item and we'll process either a replacement or full refund within 3-5 business days after our quality check.",
  },
  {
    q: "How long does delivery take to rural areas?",
    a: "Most urban deliveries take 3-5 business days. Rural and remote areas typically require 7-12 business days. You'll receive SMS tracking updates throughout the journey, including when your package reaches the nearest hub.",
  },
  {
    q: "Can I return a handcrafted item?",
    a: "Yes. We offer a 7-day return policy on all items. Since these are handcrafted pieces, we ask that items be returned in original condition. Visit our Returns page for the full process.",
  },
  {
    q: "How do I contact a specific artisan?",
    a: "Visit the artisan's storefront page and use the 'Contact Artisan' button. You can send them a message directly. Most artisans respond within 24 hours.",
  },
];

const title = "Help Center — Orders, Shipping, Returns & Artisan Authenticity";
const description =
  "Answers to common questions about ordering handmade crafts, delivery to rural and urban India, returns, and how we verify artisan authenticity on SellWhatUMade.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/help` },
  openGraph: { title, description, url: `${SITE_URL}/help` },
  twitter: { title, description },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HelpPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        {/* Hero */}
        <section className="bg-[#1b1c1a] py-16 px-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">How can we help you?</h1>
          <HelpSearchBox />
        </section>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Topics */}
          <h2 className="text-xl font-bold text-[#1b1c1a] mb-5">Browse by Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {topics.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                className="bg-white rounded-2xl shadow-artisan p-5 text-left card-hover hover:border-[#f4a460] border border-transparent transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8d4f11]/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#8d4f11]" />
                </div>
                <h3 className="font-semibold text-[#1b1c1a] text-sm mb-1">{label}</h3>
                <p className="text-xs text-[#857467] leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="text-xl font-bold text-[#1b1c1a] mb-5">Frequently Asked Questions</h2>
          <FaqAccordion faqs={faqs} />

          {/* Contact options */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: MessageSquare,
                title: "Live Chat",
                desc: "Talk to our support team in real-time",
                meta: "Wait time: Less than 2 mins",
                cta: "Start Chat",
                bg: "bg-[#8d4f11]",
              },
              {
                icon: Mail,
                title: "Email Support",
                desc: "Get a detailed response via email",
                meta: "Average response: 24 hours",
                cta: "Send Email",
                bg: "bg-[#006d3d]",
              },
            ].map(({ icon: Icon, title, desc, meta, cta, bg }) => (
              <div key={title} className="bg-white rounded-2xl shadow-artisan p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1b1c1a]">{title}</h3>
                  <p className="text-sm text-[#857467]">{desc}</p>
                  <p className="text-xs text-[#006d3d] font-medium mt-0.5">{meta}</p>
                </div>
                <button className={`px-4 py-2 ${bg} text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity shrink-0`}>
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
