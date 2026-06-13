"use client";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShieldCheck, Truck, RotateCcw, Tag, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cartItems = [
  {
    id: "1",
    name: "Hand-Painted Blue Pottery Vase",
    artisan: "Laxman Singh",
    artisanLocation: "Jaipur, Rajasthan",
    price: 3450,
    originalPrice: 4200,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&q=80",
    inStock: true,
  },
  {
    id: "2",
    name: "Banarasi Silk Stole – Sunset Bloom",
    artisan: "Kamala Devi",
    artisanLocation: "Varanasi, UP",
    price: 1800,
    originalPrice: 1800,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=80",
    inStock: true,
  },
  {
    id: "3",
    name: "Dhokra Brass Elephant Figurine",
    artisan: "Raju Mistri",
    artisanLocation: "Bastar, Chhattisgarh",
    price: 1199,
    originalPrice: 1199,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80",
    inStock: true,
  },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [coupon, setCoupon] = useState("");

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 450;
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal - discount + shipping;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Shopping Cart</h1>
            <p className="text-sm text-[#857467] mt-1">{items.length} items from artisan workshops</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items */}
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 shadow-artisan flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-[#1b1c1a] text-sm leading-snug">{item.name}</h3>
                        <p className="text-xs text-[#8d4f11] font-medium mt-0.5">
                          {item.artisan} · {item.artisanLocation}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#857467] hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1b1c1a]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-[#857467] line-through">
                            ₹{item.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 bg-[#f7f4f0] rounded-xl px-1 py-1">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Minus size={13} className="text-[#534439]" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[#1b1c1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Plus size={13} className="text-[#534439]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { icon: ShieldCheck, text: "Authenticity Guaranteed" },
                  { icon: Truck, text: "Free shipping over ₹500" },
                  { icon: RotateCcw, text: "Easy 7-day returns" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm">
                    <Icon size={15} className="text-[#006d3d] shrink-0" />
                    <span className="text-xs text-[#534439] font-medium leading-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl shadow-artisan p-6 sticky top-24">
                <h2 className="font-bold text-[#1b1c1a] text-base mb-5">Order Summary</h2>

                {/* Coupon */}
                <div className="flex gap-2 mb-5">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-[#f7f4f0] border border-transparent rounded-xl focus:outline-none focus:border-[#f4a460]"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                    Apply
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-[#534439]">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[#006d3d]">
                    <span>Discount</span>
                    <span>−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[#534439]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-[#006d3d] font-medium" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="h-px bg-[#e4e2de] my-1" />
                  <div className="flex justify-between font-bold text-[#1b1c1a] text-base">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-press flex items-center justify-center gap-2 w-full py-4 mt-5 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors"
                >
                  Proceed to Checkout
                  <ChevronRight size={16} />
                </Link>

                <p className="text-center text-xs text-[#857467] mt-3">
                  Secure checkout · All payments encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
