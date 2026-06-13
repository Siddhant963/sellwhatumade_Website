"use client";
import { useState } from "react";
import { User, Bell, Shield, Globe, CreditCard, Trash2, Eye, EyeOff, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Security" },
  { icon: Globe, label: "Language & Region" },
  { icon: CreditCard, label: "Payment Methods" },
];

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা", "मराठी", "ગુજરાતી"];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-6">Account Settings</h1>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-52 shrink-0">
              <div className="bg-white rounded-2xl shadow-artisan p-2">
                {sections.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => setActiveSection(label)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      activeSection === label
                        ? "bg-[#8d4f11]/10 text-[#8d4f11]"
                        : "text-[#534439] hover:bg-[#f7f4f0]"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-[#f0ede9]">
                  <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-artisan p-6">
              {activeSection === "Profile" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-bold text-[#1b1c1a]">Profile Information</h2>
                  <div className="flex items-center gap-4 pb-5 border-b border-[#f0ede9]">
                    <div className="w-16 h-16 rounded-full bg-[#f4a460]/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#8d4f11]">P</span>
                    </div>
                    <button className="px-4 py-2 border border-[#d8c3b4] text-sm text-[#534439] font-medium rounded-xl hover:border-[#f4a460] transition-colors">
                      Change Photo
                    </button>
                  </div>
                  {[
                    { label: "Full Name", value: "Priya Deshmukh" },
                    { label: "Email Address", value: "priya@email.com" },
                    { label: "Phone Number", value: "+91 98765 43210" },
                    { label: "Location", value: "Mumbai, Maharashtra" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#534439]">{label}</label>
                      <input
                        defaultValue={value}
                        className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                      />
                    </div>
                  ))}
                  <button className="btn-press self-start px-6 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                    Save Changes
                  </button>
                </div>
              )}

              {activeSection === "Notifications" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-bold text-[#1b1c1a]">Notification Preferences</h2>
                  {[
                    { label: "Order updates", desc: "Shipping, delivery, and status changes" },
                    { label: "Deals & offers", desc: "Flash sales and exclusive discounts" },
                    { label: "Maker stories", desc: "New stories from artisans you follow" },
                    { label: "Back in stock alerts", desc: "When wishlisted items are available" },
                    { label: "System notifications", desc: "Account security and platform updates" },
                  ].map(({ label, desc }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-[#f7f4f0]">
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1a]">{label}</p>
                        <p className="text-xs text-[#857467]">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-[#e4e2de] rounded-full peer peer-checked:bg-[#8d4f11] transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow" />
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === "Security" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-bold text-[#1b1c1a]">Security Settings</h2>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] pr-10"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857467]"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">New Password</label>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                    />
                  </div>
                  <button className="btn-press self-start px-6 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                    Update Password
                  </button>
                  <div className="pt-4 border-t border-[#f0ede9]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1a]">Two-Factor Authentication</p>
                        <p className="text-xs text-[#857467]">Add an extra layer of security</p>
                      </div>
                      <button className="flex items-center gap-1.5 px-4 py-2 border border-[#d8c3b4] text-sm text-[#534439] font-medium rounded-xl hover:border-[#f4a460] transition-colors">
                        Enable <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Language & Region" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-bold text-[#1b1c1a]">Language &amp; Region</h2>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#534439]">Display Language</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`px-4 py-2.5 rounded-xl text-sm border-2 font-medium transition-all ${
                            language === lang
                              ? "border-[#8d4f11] bg-[#8d4f11]/5 text-[#8d4f11]"
                              : "border-[#e4e2de] text-[#534439] hover:border-[#f4a460]"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Currency</label>
                    <select className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]">
                      <option>₹ Indian Rupee (INR)</option>
                    </select>
                  </div>
                  <button className="btn-press self-start px-6 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
                    Save Preferences
                  </button>
                </div>
              )}

              {activeSection === "Payment Methods" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-bold text-[#1b1c1a]">Saved Payment Methods</h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "HDFC Bank •••• 4521", sub: "Expires 09/26", default: true },
                      { label: "UPI - priya@okhdfc", sub: "Linked · Active", default: false },
                    ].map(({ label, sub, default: isDefault }) => (
                      <div key={label} className="flex items-center justify-between p-4 border border-[#e4e2de] rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 bg-[#1b1c1a] rounded-lg flex items-center justify-center">
                            <CreditCard size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1b1c1a]">{label}</p>
                            <p className="text-xs text-[#857467]">{sub}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isDefault && (
                            <span className="text-xs font-semibold text-[#006d3d] bg-[#006d3d]/10 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                          <button className="text-xs text-red-500 hover:underline">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-5 py-3 border-2 border-dashed border-[#d8c3b4] text-sm text-[#534439] font-medium rounded-2xl hover:border-[#f4a460] transition-colors w-fit">
                    + Add Payment Method
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
