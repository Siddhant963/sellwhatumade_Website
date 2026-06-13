"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, CheckCircle, ChevronDown, Loader2, Plus, X } from "lucide-react";
import SellerSidebar from "@/components/SellerSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { toPaise } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import type { Category, Product } from "@/lib/api/types";

export default function AddProductPage() {
  const { ready } = useRequireRole(["seller", "admin"]);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    material: "",
    region: "",
    deliveryDays: "5",
    price: "",
    mrp: "",
    stock: "",
    sku: "",
    tags: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    api.get<Category[]>("/api/v1/categories").then(setCategories).catch(() => setCategories([]));
  }, [ready]);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const addImage = () => {
    const url = imageInput.trim();
    if (url) {
      setImages((prev) => [...prev, url]);
      setImageInput("");
    }
  };

  const submit = async (activate: boolean) => {
    setError(null);
    if (!form.name || !form.categoryId || !form.description || !form.price || !form.stock || !form.sku) {
      setError("Please fill name, category, description, price, stock and SKU.");
      return;
    }
    if (images.length === 0) {
      setError("Add at least one product image URL.");
      return;
    }
    setSubmitting(true);
    try {
      const pricePaise = toPaise(form.price);
      const created = await api.post<Product>("/seller/v1/products", {
        name: form.name,
        description: form.description,
        categoryId: form.categoryId,
        pricePaise,
        mrpPaise: form.mrp ? toPaise(form.mrp) : pricePaise,
        stock: Number(form.stock),
        sku: form.sku,
        images,
        materials: form.material ? [form.material] : [],
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        deliveryDays: Number(form.deliveryDays) || 5,
      });
      if (activate && created?._id) {
        await api.patch(`/seller/v1/products/${created._id}/status`, { status: "active" });
      }
      router.push("/seller/inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <SellerSidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Add New Product</h1>
            <p className="text-sm text-[#857467] mt-1">List a new handmade item on your Maker Studio storefront</p>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-5">
              {/* Images */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h2 className="font-semibold text-[#1b1c1a] mb-4">Product Images</h2>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                    placeholder="Paste image URL (S3/CDN) and press Add"
                    className="flex-1 px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                  />
                  <button onClick={addImage} type="button" className="px-4 py-3 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl flex items-center gap-1">
                    <Plus size={15} /> Add
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#efeeea] group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img || PLACEHOLDER_IMAGE} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        type="button"
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#857467] mt-3">First image is used as the thumbnail.</p>
              </div>

              {/* Basic info */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h2 className="font-semibold text-[#1b1c1a] mb-4">Basic Information</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Product Title</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Indigo Terracotta Vase"
                      className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#534439]">Category</label>
                      <div className="relative">
                        <select
                          value={form.categoryId}
                          onChange={(e) => set("categoryId", e.target.value)}
                          className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] appearance-none"
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857467] pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#534439]">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={(e) => set("tags", e.target.value)}
                        placeholder="handmade, clay, blue"
                        className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Description</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
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
                  <Input label="Primary Material" value={form.material} onChange={(v) => set("material", v)} placeholder="e.g. Quartz & Glass" />
                  <Input label="Origin Region" value={form.region} onChange={(v) => set("region", v)} placeholder="e.g. Jaipur, Rajasthan" />
                  <Input label="Delivery Time (days)" value={form.deliveryDays} onChange={(v) => set("deliveryDays", v)} placeholder="5" type="number" />
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl shadow-artisan p-5">
                <h2 className="font-semibold text-[#1b1c1a] mb-4">Pricing &amp; Inventory</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="Price (₹)" value={form.price} onChange={(v) => set("price", v)} placeholder="2499" type="number" />
                  <Input label="MRP (₹)" value={form.mrp} onChange={(v) => set("mrp", v)} placeholder="2999" type="number" />
                  <Input label="Stock" value={form.stock} onChange={(v) => set("stock", v)} placeholder="10" type="number" />
                  <Input label="SKU" value={form.sku} onChange={(v) => set("sku", v)} placeholder="POT-001" />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
            </div>

            {/* Sidebar panel */}
            <div className="xl:w-64 shrink-0 flex flex-col gap-4">
              <div className="bg-[#f4a460]/10 border border-[#f4a460]/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={15} className="text-[#8d4f11]" />
                  <span className="text-xs font-bold text-[#8d4f11]">Selling Tip</span>
                </div>
                <p className="text-xs text-[#534439] leading-relaxed">
                  Customers value the <strong>story</strong> behind the craft. A rich description and clear photos boost sales.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-artisan p-4">
                <h3 className="text-xs font-bold text-[#534439] mb-3">Live Preview</h3>
                <div className="bg-[#f7f4f0] rounded-xl p-3">
                  <div className="w-full h-24 rounded-lg mb-2 overflow-hidden bg-[#e4e2de] flex items-center justify-center">
                    {images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images[0]} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-[#857467]">Photo preview</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#1b1c1a]">{form.name || "Product title"}</p>
                  <p className="text-xs text-[#8d4f11] mt-0.5">₹{form.price || "0"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => submit(true)}
                  disabled={submitting}
                  className="btn-press w-full py-3 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                  Publish Product
                </button>
                <button
                  onClick={() => submit(false)}
                  disabled={submitting}
                  className="w-full py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-2xl hover:border-[#f4a460] transition-colors disabled:opacity-60"
                >
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

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#534439]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
      />
    </div>
  );
}
