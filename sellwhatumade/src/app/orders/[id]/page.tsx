import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin, Phone, BadgeCheck, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { label: "Order Placed", date: "Jun 5, 10:32 AM", done: true },
  { label: "Confirmed by Artisan", date: "Jun 5, 2:15 PM", done: true },
  { label: "In Transit", date: "Jun 6, 9:00 AM", done: true },
  { label: "Out for Delivery", date: "Jun 8, 8:45 AM", done: false, current: true },
  { label: "Delivered", date: "Expected by Jun 8", done: false },
];

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-[#857467] hover:text-[#534439] mb-6">
            <ArrowLeft size={15} />
            Back to Orders
          </Link>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Track Order</h1>
              <p className="text-sm text-[#857467] mt-1">Order #{id} · Placed Jun 5, 2024</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700">
              <Truck size={12} />
              Out for Delivery
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Timeline */}
            <div className="flex-1 bg-white rounded-2xl shadow-artisan p-6">
              <h2 className="font-bold text-[#1b1c1a] mb-6">Delivery Timeline</h2>

              <div className="relative flex flex-col gap-0">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.done
                          ? "bg-[#006d3d]"
                          : step.current
                          ? "bg-[#8d4f11] ring-4 ring-[#8d4f11]/20"
                          : "bg-[#e4e2de]"
                      }`}>
                        {step.done ? (
                          <CheckCircle size={18} className="text-white" />
                        ) : step.current ? (
                          <Truck size={18} className="text-white" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-[#d8c3b4]" />
                        )}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-12 ${step.done ? "bg-[#006d3d]" : "bg-[#e4e2de]"}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-8 flex-1">
                      <p className={`text-sm font-semibold ${
                        step.done || step.current ? "text-[#1b1c1a]" : "text-[#857467]"
                      }`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        step.done ? "text-[#006d3d]" : step.current ? "text-[#8d4f11]" : "text-[#857467]"
                      }`}>
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Courier info */}
              <div className="mt-2 bg-[#f7f4f0] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#857467] font-medium uppercase tracking-wide mb-1">Courier Partner</p>
                  <p className="text-sm font-bold text-[#1b1c1a]">BlueDart Express</p>
                  <p className="text-xs text-[#534439] mt-0.5">Tracking ID: BD928401263IN</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8d4f11] text-white text-xs font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                  <Phone size={12} />
                  Contact Courier
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-72 flex flex-col gap-4">
              {/* Delivery address */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} className="text-[#8d4f11]" />
                  <h3 className="font-semibold text-[#1b1c1a] text-sm">Delivery Address</h3>
                </div>
                <p className="text-sm text-[#534439] leading-relaxed">
                  Priya Deshmukh<br />
                  42, Craft Lane, Artisan District<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>

              {/* Artisan profile */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h3 className="font-semibold text-[#1b1c1a] text-sm mb-3">Packed by Artisan</h3>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80"
                    alt="Laxman Singh"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#f4a460]"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-[#1b1c1a]">Laxman Singh</p>
                      <BadgeCheck size={14} className="fill-[#006d3d] text-white" />
                    </div>
                    <p className="text-xs text-[#8d4f11]">Blue Pottery Master</p>
                    <p className="text-xs text-[#857467]">Jaipur, Rajasthan</p>
                  </div>
                </div>
                <Link
                  href="/artisan/3"
                  className="mt-3 w-full py-2 border border-[#d8c3b4] text-sm text-[#534439] font-medium rounded-xl hover:border-[#f4a460] transition-colors text-center block"
                >
                  View Artisan Profile
                </Link>
              </div>

              {/* Order item */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h3 className="font-semibold text-[#1b1c1a] text-sm mb-3">Order Item</h3>
                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=80&q=80"
                    alt="Vase"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#1b1c1a] leading-snug">Hand-Painted Blue Pottery Vase</p>
                    <p className="text-xs text-[#857467] mt-1">Qty: 1</p>
                    <p className="text-sm font-bold text-[#1b1c1a] mt-1">₹3,450</p>
                  </div>
                </div>
              </div>

              <button className="btn-press flex items-center justify-center gap-2 py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-xl hover:border-[#f4a460] transition-colors">
                <Package size={15} />
                Report an Issue
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
