"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, BadgeCheck, Truck, RotateCcw, ShieldCheck, CreditCard, Smartphone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cartItems = [
  {
    id: "1",
    name: "Hand-Painted Blue Pottery Vase",
    artisan: "Laxman Singh",
    price: 3450,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=120&q=80",
  },
  {
    id: "2",
    name: "Banarasi Silk Stole – Sunset Bloom",
    artisan: "Kamala Devi",
    price: 5800,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=120&q=80",
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (step === "confirmation") {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="max-w-md w-full text-center flex flex-col gap-6">
            <div className="w-20 h-20 rounded-full bg-[#97f3b5]/30 border-2 border-[#97f3b5] flex items-center justify-center mx-auto">
              <BadgeCheck size={36} className="text-[#006d3d]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Order Placed!</h1>
              <p className="text-[#534439]">
                Your order <span className="font-bold text-[#8d4f11]">#AD-9285</span> has been confirmed. The artisan will begin crafting your piece shortly.
              </p>
            </div>
            <div className="bg-[#f5f3ef] rounded-2xl p-5 text-left flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#857467]">Order total</span>
                <span className="font-bold text-[#1b1c1a]">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#857467]">Estimated delivery</span>
                <span className="font-medium text-[#1b1c1a]">5–7 business days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#857467]">Artisans supported</span>
                <span className="font-medium text-[#006d3d]">{cartItems.length} makers</span>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="btn-press py-4 bg-[#8d4f11] text-white font-bold rounded-2xl hover:bg-[#6e3900] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-[#857467] mb-8">
            <Link href="/" className="hover:text-[#8d4f11]">Home</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace" className="hover:text-[#8d4f11]">Marketplace</Link>
            <ChevronRight size={14} />
            <span className="text-[#534439] font-medium">Checkout</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                {(["shipping", "payment"] as const).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    {i > 0 && <div className="w-8 h-px bg-[#d8c3b4]" />}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      step === s ? "bg-[#8d4f11] text-white" : "bg-[#efeeea] text-[#857467]"
                    }`}>
                      <span>{i + 1}</span>
                      <span className="capitalize">{s}</span>
                    </div>
                  </div>
                ))}
              </div>

              {step === "shipping" ? (
                <div className="bg-white rounded-2xl p-6 shadow-artisan flex flex-col gap-5">
                  <h2 className="text-lg font-bold text-[#1b1c1a]">Delivery Address</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "First Name", placeholder: "Arjun" },
                      { label: "Last Name", placeholder: "Sharma" },
                    ].map(({ label, placeholder }) => (
                      <div key={label} className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">{label}</label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          className="w-full px-4 py-3 bg-[#f5f3ef] border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] focus:ring-2 focus:ring-[#f4a460]/20 text-sm placeholder:text-[#857467]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      placeholder="arjun@example.com"
                      className="w-full px-4 py-3 bg-[#f5f3ef] border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#f5f3ef] border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">Address</label>
                    <input
                      type="text"
                      placeholder="Flat 4B, Serenity Apartments, MG Road"
                      className="w-full px-4 py-3 bg-[#f5f3ef] border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: "City", placeholder: "Mumbai" },
                      { label: "State", placeholder: "Maharashtra" },
                      { label: "PIN Code", placeholder: "400001" },
                    ].map(({ label, placeholder }) => (
                      <div key={label} className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">{label}</label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          className="w-full px-4 py-3 bg-[#f5f3ef] border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep("payment")}
                    className="btn-press w-full py-4 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors"
                  >
                    Continue to Payment →
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-artisan flex flex-col gap-5">
                  <h2 className="text-lg font-bold text-[#1b1c1a]">Payment Method</h2>

                  <div className="flex flex-col gap-3">
                    {[
                      { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                      { id: "upi", icon: Smartphone, label: "UPI", sub: "GPay, PhonePe, Paytm" },
                    ].map(({ id, icon: Icon, label, sub }) => (
                      <label
                        key={id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          paymentMethod === id ? "border-[#8d4f11] bg-[#f4a460]/5" : "border-[#e4e2de] hover:border-[#d8c3b4]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={() => setPaymentMethod(id)}
                          className="accent-[#8d4f11] w-4 h-4"
                        />
                        <Icon size={20} className="text-[#8d4f11]" />
                        <div>
                          <p className="text-sm font-semibold text-[#1b1c1a]">{label}</p>
                          <p className="text-xs text-[#857467]">{sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="flex flex-col gap-4 p-4 bg-[#f5f3ef] rounded-xl">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">Card Number</label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-4 py-3 bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full px-4 py-3 bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">CVV</label>
                          <input
                            type="text"
                            placeholder="•••"
                            className="w-full px-4 py-3 bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="p-4 bg-[#f5f3ef] rounded-xl flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#534439] uppercase tracking-wide">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 bg-white border border-[#d8c3b4] rounded-xl focus:outline-none focus:border-[#f4a460] text-sm placeholder:text-[#857467]"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("shipping")}
                      className="px-6 py-4 border border-[#d8c3b4] text-[#534439] font-semibold rounded-2xl hover:bg-[#efeeea] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep("confirmation")}
                      className="btn-press flex-1 py-4 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors"
                    >
                      Pay ₹{total.toLocaleString("en-IN")} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-artisan">
                <h2 className="text-base font-bold text-[#1b1c1a] mb-4">Order Summary ({cartItems.length} items)</h2>

                <div className="flex flex-col gap-3 mb-5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#efeeea]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1b1c1a] line-clamp-2">{item.name}</p>
                        <p className="text-xs text-[#857467] mt-0.5">{item.artisan} · Qty {item.quantity}</p>
                        <p className="text-sm font-bold text-[#8d4f11] mt-1">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 py-4 border-t border-[#efeeea] text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#857467]">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#857467]">Shipping</span>
                    <span className="font-medium text-[#006d3d]">Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#efeeea] text-base font-bold">
                    <span className="text-[#1b1c1a]">Total</span>
                    <span className="text-[#8d4f11]">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="flex flex-col gap-3 p-4 bg-[#f5f3ef] rounded-2xl">
                {[
                  { icon: ShieldCheck, text: "Secure 256-bit SSL Encryption" },
                  { icon: Truck, text: "Free delivery on all orders" },
                  { icon: RotateCcw, text: "7-day hassle-free returns" },
                  { icon: BadgeCheck, text: "All artisans authenticity verified" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-[#534439]">
                    <Icon size={14} className="text-[#006d3d] shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
