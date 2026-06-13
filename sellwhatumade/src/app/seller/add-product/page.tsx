"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf, Upload, Plus, Lightbulb, CheckCircle, ChevronDown, LayoutDashboard, Package, ShoppingBag, BarChart2, Settings } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Products", href: "/seller/add-product", active: true },
  { icon: ShoppingBag, label: "Orders", href: "/seller/orders" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AddProductPage() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    material: "",
    technique: "",
    region: "",
    timeTomake: "",
    price: "",
    stock: "",
    sku: "",
    tags: "",
  });

  const completedFields = Object.values(form).filter(Boolean).length;
  const totalFields = Object.keys(form).length + 2; // + photos + desc

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1b1c1a] fixed top-0 left-0 h-full flex flex-col py-6 px-3 z-20">
        <Link href="/" className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">Maker Studio</span>
        </Link>
        <div className="flex items-center gap-2 px-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-[#f4a460]/20 flex items-center justify-center">
            <span className="text-xs font-bold text-[#f4a460]">LK</span>
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Laxman Kumar</p>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#97f3b5]" />
              <span className="text-[10px] text-[#97f3b5]">Verified Artisan</span>
            </span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active ? "bg-[#8d4f11] text-white" : "text-[#857467] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Add New Product</h1>
            <p className="text-sm text-[#857467] mt-1">List a new handmade item on your Maker Studio storefront</p>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Form */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Photo upload */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h2 className="font-semibold text-[#1b1c1a] mb-4">Product Gallery</h2>
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2 aspect-square border-2 border-dashed border-[#d8c3b4] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#f4a460] transition-colors">
                    <Upload size={22} className="text-[#d8c3b4]" />
                    <p className="text-xs text-[#857467] text-center leading-tight px-2">Click to upload primary high-res photo</p>
                  </div>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square border-2 border-dashed border-[#e4e2de] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#f4a460] transition-colors">
                      <Plus size={18} className="text-[#d8c3b4]" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#857467] mt-3">Supports up to 6 photos · PNG, JPG · Max 10MB each</p>
              </div>

              {/* Basic info */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h2 className="font-semibold text-[#1b1c1a] mb-4">Basic Information</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Product Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Indigo Terracotta Vase"
                      className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#534439]">Category</label>
                      <div className="relative">
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] appearance-none"
                        >
                          <option value="">Select category</option>
                          {["Home Decor", "Apparel", "Kitchenware", "Jewelry", "Paintings", "Sculpture"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857467] pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#534439]">Tags</label>
                      <input
                        type="text"
                        placeholder="e.g. handmade, clay, blue"
                        className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your product — the materials, technique, and story behind it..."
                      className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Craft details */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h2 className="font-semibold text-[#1b1c1a] mb-4">Craft Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "material", label: "Primary Material", placeholder: "e.g. Quartz & Glass" },
                    { key: "technique", label: "Technique Used", placeholder: "e.g. Hand-thrown" },
                    { key: "region", label: "Origin Region", placeholder: "e.g. Jaipur, Rajasthan" },
                    { key: "timeTomake", label: "Time to Make (Days)", placeholder: "e.g. 5" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#534439]">{label}</label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h2 className="font-semibold text-[#1b1c1a] mb-4">Pricing &amp; Inventory</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#534439]">₹</span>
                      <input
                        type="number"
                        placeholder="2499"
                        className="w-full pl-7 pr-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Current Stock</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">SKU (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. POT-001"
                      className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar panel */}
            <div className="xl:w-64 shrink-0 flex flex-col gap-4">
              {/* Tip */}
              <div className="bg-[#f4a460]/10 border border-[#f4a460]/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={15} className="text-[#8d4f11]" />
                  <span className="text-xs font-bold text-[#8d4f11]">Selling Tip</span>
                </div>
                <p className="text-xs text-[#534439] leading-relaxed">
                  Customers value the <strong>story</strong> behind the craft. Add a personal description to increase sales by up to 40%.
                </p>
              </div>

              {/* Progress */}
              <div className="bg-white rounded-2xl shadow-artisan p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#534439]">Ready for review</span>
                  <span className="text-xs font-bold text-[#8d4f11]">{completedFields}/{totalFields} fields</span>
                </div>
                <div className="w-full bg-[#e4e2de] rounded-full h-2">
                  <div
                    className="bg-[#8d4f11] h-2 rounded-full transition-all"
                    style={{ width: `${(completedFields / totalFields) * 100}%` }}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-2xl shadow-artisan p-4">
                <h3 className="text-xs font-bold text-[#534439] mb-3">Live Preview</h3>
                <div className="bg-[#f7f4f0] rounded-xl p-3">
                  <div className="w-full h-24 bg-[#e4e2de] rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-xs text-[#857467]">Photo preview</span>
                  </div>
                  <p className="text-xs font-bold text-[#1b1c1a]">{form.title || "Indigo Terracotta Vase"}</p>
                  <p className="text-xs text-[#8d4f11] mt-0.5">₹{form.price || "2,499"}</p>
                  <p className="text-xs text-[#857467]">from {form.region || "Gujarat"}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button className="btn-press w-full py-3 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-bold rounded-2xl transition-colors flex items-center justify-center gap-2">
                  <CheckCircle size={15} />
                  Submit for Review
                </button>
                <button className="w-full py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-2xl hover:border-[#f4a460] transition-colors">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
