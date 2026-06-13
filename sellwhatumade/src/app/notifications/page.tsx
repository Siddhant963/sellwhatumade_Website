"use client";
import { useState } from "react";
import { Package, Tag, BookOpen, Settings, Bell, CheckCheck, Truck, Star, ShoppingBag, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  { key: "All", icon: Bell },
  { key: "Orders", icon: Package },
  { key: "Deals", icon: Tag },
  { key: "Maker Stories", icon: BookOpen },
  { key: "System", icon: Settings },
];

const notifications = [
  {
    id: 1,
    category: "Orders",
    icon: Truck,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Your order is out for delivery!",
    body: "Order #AD-9284 (Banarasi Silk Stole) is on its way. Expected by 6:00 PM today.",
    time: "Just now",
    unread: true,
    group: "Today",
  },
  {
    id: 2,
    category: "Deals",
    icon: Zap,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Flash Sale: 30% off Pottery",
    body: "Only 4 hours left! Handcrafted terracotta and blue pottery at 30% off. Shop before stocks run out.",
    time: "2h ago",
    unread: true,
    group: "Today",
  },
  {
    id: 3,
    category: "Orders",
    icon: Star,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Review your recent purchase",
    body: "You received the Dhokra Brass Elephant Figurine. Share your experience and help other buyers.",
    time: "5h ago",
    unread: false,
    group: "Today",
  },
  {
    id: 4,
    category: "Maker Stories",
    icon: BookOpen,
    iconBg: "bg-green-100",
    iconColor: "text-[#006d3d]",
    title: "New story from Kamala Devi",
    body: "\"The monsoon brings the best indigo harvest…\" Kamala shares the story behind her latest collection.",
    time: "Yesterday",
    unread: true,
    group: "Yesterday",
  },
  {
    id: 5,
    category: "Orders",
    icon: Package,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Order confirmed",
    body: "Order #AD-9271 has been confirmed by Raju Mistri. He will start crafting your item today.",
    time: "Yesterday",
    unread: false,
    group: "Yesterday",
  },
  {
    id: 6,
    category: "Deals",
    icon: Tag,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "New arrivals in Tribal Jewelry",
    body: "18 new pieces added by artisans from Odisha and Jharkhand. First 50 buyers get free shipping.",
    time: "3 days ago",
    unread: false,
    group: "This Week",
  },
  {
    id: 7,
    category: "System",
    icon: Settings,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    title: "Profile verification complete",
    body: "Your email and phone have been verified. You now have access to all buyer features.",
    time: "5 days ago",
    unread: false,
    group: "This Week",
  },
  {
    id: 8,
    category: "Orders",
    icon: ShoppingBag,
    iconBg: "bg-[#8d4f11]/10",
    iconColor: "text-[#8d4f11]",
    title: "Item back in stock!",
    body: "The Pashmina Shawl – Natural Ivory you wishlisted is back in stock. Only 2 pieces left!",
    time: "1 week ago",
    unread: false,
    group: "This Week",
  },
];

const groups = ["Today", "Yesterday", "This Week"];

export default function NotificationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState(notifications);

  const filtered = activeCategory === "All" ? items : items.filter((n) => n.category === activeCategory);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1a]">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[#857467] mt-1">{unreadCount} unread notifications</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-sm text-[#8d4f11] font-semibold hover:underline"
              >
                <CheckCheck size={15} />
                Mark all read
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-48 shrink-0">
              <div className="bg-white rounded-2xl shadow-artisan p-3 flex flex-row lg:flex-col gap-1">
                {categories.map(({ key, icon: Icon }) => {
                  const cnt = key === "All" ? unreadCount : items.filter((n) => n.category === key && n.unread).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                        activeCategory === key
                          ? "bg-[#8d4f11]/10 text-[#8d4f11]"
                          : "text-[#534439] hover:bg-[#f7f4f0]"
                      }`}
                    >
                      <Icon size={15} />
                      <span className="flex-1">{key}</span>
                      {cnt > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#8d4f11] text-white text-xs flex items-center justify-center">
                          {cnt}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feed */}
            <div className="flex-1 flex flex-col gap-6">
              {groups.map((group) => {
                const groupItems = filtered.filter((n) => n.group === group);
                if (groupItems.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="text-xs font-bold text-[#857467] uppercase tracking-widest mb-3">{group}</p>
                    <div className="flex flex-col gap-2">
                      {groupItems.map((notif) => {
                        const Icon = notif.icon;
                        return (
                          <div
                            key={notif.id}
                            className={`flex items-start gap-4 bg-white rounded-2xl p-4 shadow-artisan transition-colors cursor-pointer hover:shadow-md ${
                              notif.unread ? "border-l-4 border-[#8d4f11]" : ""
                            }`}
                            onClick={() =>
                              setItems((prev) =>
                                prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
                              )
                            }
                          >
                            <div className={`w-10 h-10 rounded-xl ${notif.iconBg} flex items-center justify-center shrink-0`}>
                              <Icon size={18} className={notif.iconColor} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-semibold ${notif.unread ? "text-[#1b1c1a]" : "text-[#534439]"}`}>
                                  {notif.title}
                                </p>
                                <span className="text-xs text-[#857467] shrink-0">{notif.time}</span>
                              </div>
                              <p className="text-xs text-[#857467] mt-0.5 leading-relaxed">{notif.body}</p>
                            </div>
                            {notif.unread && (
                              <div className="w-2 h-2 rounded-full bg-[#8d4f11] shrink-0 mt-1.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
