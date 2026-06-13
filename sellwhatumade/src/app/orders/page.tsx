"use client";
import { useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, Star, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allOrders = [
  {
    id: "AD-9301",
    product: "Hand-Painted Blue Pottery Vase",
    artisan: "Laxman Singh",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=160&q=80",
    price: 3450,
    quantity: 1,
    status: "Delivered",
    date: "2024-06-01",
    deliveredDate: "2024-06-06",
  },
  {
    id: "AD-9284",
    product: "Banarasi Silk Stole – Sunset Bloom",
    artisan: "Kamala Devi",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=160&q=80",
    price: 5800,
    quantity: 1,
    status: "Shipped",
    date: "2024-06-05",
    deliveredDate: null,
  },
  {
    id: "AD-9271",
    product: "Dhokra Brass Elephant Figurine",
    artisan: "Raju Mistri",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=160&q=80",
    price: 2100,
    quantity: 2,
    status: "Processing",
    date: "2024-06-07",
    deliveredDate: null,
  },
  {
    id: "AD-9265",
    product: "Madhubani Painting – Peacock Dance",
    artisan: "Sunita Devi",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=160&q=80",
    price: 6200,
    quantity: 1,
    status: "Pending",
    date: "2024-06-08",
    deliveredDate: null,
  },
  {
    id: "AD-9200",
    product: "Terracotta Wind Chime",
    artisan: "Priya Kumari",
    image: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=160&q=80",
    price: 890,
    quantity: 3,
    status: "Cancelled",
    date: "2024-05-28",
    deliveredDate: null,
  },
];

const tabs = [
  { key: "All", count: 12 },
  { key: "Pending", count: 2 },
  { key: "Processing", count: 1 },
  { key: "Shipped", count: 3 },
  { key: "Delivered", count: 5 },
  { key: "Cancelled", count: 1 },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ComponentType<{ size: number; className?: string }> }> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  Processing: { color: "text-blue-700", bg: "bg-blue-50", icon: Package },
  Shipped: { color: "text-purple-700", bg: "bg-purple-50", icon: Truck },
  Delivered: { color: "text-[#006d3d]", bg: "bg-[#006d3d]/10", icon: CheckCircle },
  Cancelled: { color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? allOrders : allOrders.filter((o) => o.status === activeTab);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">My Orders</h1>
            <p className="text-sm text-[#857467] mt-1">Track and manage your craft purchases</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 mb-6 no-scrollbar">
            {tabs.map(({ key, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === key
                    ? "bg-[#8d4f11] text-white"
                    : "bg-white text-[#534439] border border-[#e4e2de] hover:border-[#f4a460]"
                }`}
              >
                {key}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === key ? "bg-white/20 text-white" : "bg-[#efeeea] text-[#857467]"
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Orders */}
          <div className="flex flex-col gap-4">
            {filtered.map((order) => {
              const cfg = statusConfig[order.status];
              const Icon = cfg.icon;
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-artisan overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0ede9]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#534439]">Order #{order.id}</span>
                      <span className="text-xs text-[#857467]">{order.date}</span>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}>
                      <Icon size={12} className={cfg.color} />
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 p-5">
                    <img
                      src={order.image}
                      alt={order.product}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1b1c1a] text-sm leading-snug line-clamp-1">
                        {order.product}
                      </h3>
                      <p className="text-xs text-[#8d4f11] font-medium mt-0.5">By {order.artisan}</p>
                      <p className="text-xs text-[#857467] mt-1">
                        Qty: {order.quantity} · ₹{(order.price * order.quantity).toLocaleString("en-IN")}
                      </p>
                      {order.deliveredDate && (
                        <p className="text-xs text-[#006d3d] mt-1">Delivered on {order.deliveredDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 px-5 pb-4">
                    {order.status === "Shipped" && (
                      <Link
                        href={`/orders/${order.id}/tracking`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#8d4f11] text-white text-xs font-semibold rounded-xl hover:bg-[#6e3900] transition-colors"
                      >
                        <Truck size={13} />
                        Track Order
                      </Link>
                    )}
                    {order.status === "Delivered" && (
                      <>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8d4f11] text-white text-xs font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                          <Star size={13} />
                          Write Review
                        </button>
                        <Link
                          href="/returns"
                          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#d8c3b4] text-[#534439] text-xs font-semibold rounded-xl hover:border-[#f4a460] transition-colors"
                        >
                          <RotateCcw size={13} />
                          Return
                        </Link>
                      </>
                    )}
                    {(order.status === "Pending" || order.status === "Processing") && (
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#d8c3b4] text-[#534439] text-xs font-semibold rounded-xl hover:border-red-300 transition-colors">
                        <XCircle size={13} />
                        Cancel Order
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#d8c3b4] text-[#534439] text-xs font-semibold rounded-xl hover:border-[#f4a460] transition-colors ml-auto">
                      Details
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
