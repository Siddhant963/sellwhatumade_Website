"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Send, Paperclip, BadgeCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const conversations = [
  {
    id: 1,
    name: "Laxman Singh",
    role: "Blue Pottery Master",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80",
    lastMessage: "Thank you for your order! I'm starting on your vase today.",
    time: "2m ago",
    unread: 2,
    certified: true,
  },
  {
    id: 2,
    name: "Kamala Devi",
    role: "Indigo Weaver",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=80&q=80",
    lastMessage: "The silk stole is ready, shall I ship it?",
    time: "1h ago",
    unread: 1,
    certified: true,
  },
  {
    id: 3,
    name: "Sunita Devi",
    role: "Madhubani Painter",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80",
    lastMessage: "Your custom painting will take about 10 more days.",
    time: "Yesterday",
    unread: 0,
    certified: true,
  },
  {
    id: 4,
    name: "Support Team",
    role: "SellWhatUMade Support",
    avatar: "",
    lastMessage: "Your return request #AD-9284 has been approved.",
    time: "2 days ago",
    unread: 0,
    certified: false,
  },
];

const messages = [
  { id: 1, from: "artisan", text: "Namaste! I received your order for the Blue Pottery Vase. Thank you so much for your support!", time: "10:24 AM" },
  { id: 2, from: "me", text: "Hi Laxman! So excited to receive it. How long will it take to craft?", time: "10:26 AM" },
  { id: 3, from: "artisan", text: "I'll need about 5 days to hand-paint it with the special cobalt blue technique. Each piece is unique!", time: "10:28 AM" },
  { id: 4, from: "me", text: "That's wonderful! Can you share a photo of the work in progress?", time: "10:30 AM" },
  { id: 5, from: "artisan", text: "Of course! I'll send you a photo when it's half done. Thank you for your patience — I'm starting on your vase today.", time: "10:31 AM" },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(1);
  const [message, setMessage] = useState("");

  const activeConversation = conversations.find((c) => c.id === activeConv);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-5">Messages</h1>
          <div className="flex gap-4 h-[calc(100vh-220px)] min-h-96">
            {/* Conversation list */}
            <div className="w-72 shrink-0 bg-white rounded-2xl shadow-artisan flex flex-col overflow-hidden">
              <div className="p-4 border-b border-[#f0ede9]">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#857467]" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#f7f4f0] rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConv(conv.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-[#f7f4f0] text-left transition-colors ${
                      activeConv === conv.id ? "bg-[#8d4f11]/5 border-l-2 border-l-[#8d4f11]" : "hover:bg-[#fbf9f5]"
                    }`}
                  >
                    <div className="relative shrink-0">
                      {conv.avatar ? (
                        <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#8d4f11]/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#8d4f11]">S</span>
                        </div>
                      )}
                      {conv.unread > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#8d4f11] text-white text-xs flex items-center justify-center">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-[#1b1c1a]">{conv.name}</span>
                          {conv.certified && <BadgeCheck size={11} className="fill-[#006d3d] text-white shrink-0" />}
                        </div>
                        <span className="text-xs text-[#857467]">{conv.time}</span>
                      </div>
                      <p className="text-xs text-[#8d4f11]">{conv.role}</p>
                      <p className="text-xs text-[#857467] truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat area */}
            {activeConversation && (
              <div className="flex-1 bg-white rounded-2xl shadow-artisan flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0ede9]">
                  {activeConversation.avatar ? (
                    <img src={activeConversation.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#8d4f11]/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#8d4f11]">S</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-[#1b1c1a] text-sm">{activeConversation.name}</p>
                      {activeConversation.certified && <BadgeCheck size={13} className="fill-[#006d3d] text-white" />}
                    </div>
                    <p className="text-xs text-[#8d4f11]">{activeConversation.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "me"
                          ? "bg-[#8d4f11] text-white rounded-br-sm"
                          : "bg-[#f7f4f0] text-[#534439] rounded-bl-sm"
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.from === "me" ? "text-[#ffdcc3]" : "text-[#857467]"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-[#f0ede9] flex items-center gap-2">
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#857467] hover:text-[#534439] hover:bg-[#f7f4f0] transition-colors shrink-0">
                    <Paperclip size={16} />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 text-sm bg-[#f7f4f0] rounded-xl focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && setMessage("")}
                  />
                  <button
                    onClick={() => setMessage("")}
                    className="btn-press w-9 h-9 rounded-xl bg-[#8d4f11] hover:bg-[#6e3900] flex items-center justify-center transition-colors shrink-0"
                  >
                    <Send size={15} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
