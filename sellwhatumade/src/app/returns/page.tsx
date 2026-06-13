"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Upload, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const returnableItems = [
  {
    id: "1",
    name: "Hand-Thrown Terracotta Pitcher",
    price: 1250,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=80&q=80",
    color: "Terracotta",
    orderId: "#AD-9284",
  },
  {
    id: "2",
    name: "Indigo Handloom Cotton Throw",
    price: 2400,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=80",
    color: "Indigo Blue",
    orderId: "#AD-9284",
  },
];

const reasons = [
  "Item damaged during transit",
  "Quality not as expected",
  "Received wrong item",
  "Sizing / Fit issue",
  "Changed my mind",
  "Other",
];

export default function ReturnsPage() {
  const [step, setStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [condition, setCondition] = useState("");
  const [compensation, setCompensation] = useState("original");
  const [submitted, setSubmitted] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-[#fbf9f5] flex items-center justify-center py-20 px-6">
          <div className="bg-white rounded-3xl shadow-artisan p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#006d3d]/10 flex items-center justify-center mx-auto mb-5">
              <Check size={30} className="text-[#006d3d]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1b1c1a] mb-2">Return Request Logged</h2>
            <p className="text-[#534439] leading-relaxed mb-3">
              Your return request for Order <strong>#AD-9284</strong> has been successfully submitted.
            </p>
            <p className="text-sm text-[#857467] mb-6">
              Our courier partner will collect the items within 48 hours. Refund will be processed within 3-5 business days after quality check.
            </p>
            <div className="flex gap-3">
              <Link
                href="/orders"
                className="flex-1 py-3 bg-[#8d4f11] text-white text-sm font-bold rounded-2xl hover:bg-[#6e3900] transition-colors text-center"
              >
                Track Return
              </Link>
              <Link
                href="/orders"
                className="flex-1 py-3 border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-2xl hover:border-[#f4a460] transition-colors text-center"
              >
                View Orders
              </Link>
            </div>
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
        <div className="max-w-2xl mx-auto px-6 py-10">
          <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-[#857467] hover:text-[#534439] mb-6">
            <ArrowLeft size={15} />
            Back to Orders
          </Link>

          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-1">Return Request</h1>
          <p className="text-sm text-[#857467] mb-8">Order #AD-9284 · Placed Jun 1, 2024</p>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-8">
            {["Select Items", "Details", "Review"].map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    i < step ? "bg-[#006d3d] border-[#006d3d] text-white" :
                    i === step ? "border-[#8d4f11] text-[#8d4f11]" :
                    "border-[#d8c3b4] text-[#d8c3b4]"
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 ${i === step ? "text-[#8d4f11] font-semibold" : "text-[#857467]"}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-2 -mt-5 ${i < step ? "bg-[#006d3d]" : "bg-[#e4e2de]"}`} />}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-white rounded-2xl shadow-artisan p-6 mb-5">
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-[#1b1c1a]">Which items do you want to return?</h2>
                {returnableItems.map((item) => (
                  <label key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedItems.includes(item.id)
                      ? "border-[#8d4f11] bg-[#8d4f11]/5"
                      : "border-[#e4e2de] hover:border-[#f4a460]"
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="accent-[#8d4f11] w-4 h-4"
                    />
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1b1c1a]">{item.name}</p>
                      <p className="text-xs text-[#857467]">Color: {item.color}</p>
                    </div>
                    <span className="text-sm font-bold text-[#1b1c1a]">₹{item.price.toLocaleString("en-IN")}</span>
                  </label>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-semibold text-[#1b1c1a]">Tell us more about your return</h2>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#534439]">Reason for return</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                  >
                    <option value="">Select a reason</option>
                    {reasons.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#534439]">Item condition</label>
                  {["Unopened / Tags on", "Opened / Original Box"].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="condition"
                        value={opt}
                        checked={condition === opt}
                        onChange={() => setCondition(opt)}
                        className="accent-[#8d4f11]"
                      />
                      <span className="text-sm text-[#534439]">{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#534439]">
                    Upload photos{" "}
                    <span className="font-normal text-[#857467]">(optional · up to 3)</span>
                  </label>
                  <div className="border-2 border-dashed border-[#d8c3b4] rounded-2xl p-6 text-center hover:border-[#f4a460] cursor-pointer transition-colors">
                    <Upload size={22} className="text-[#d8c3b4] mx-auto mb-2" />
                    <p className="text-xs text-[#857467]">PNG, JPG up to 10MB each</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#534439]">Preferred compensation</label>
                  {[
                    { id: "original", label: "Original Payment Method" },
                    { id: "store-credit", label: "Store Credit (Instant)" },
                    { id: "bank", label: "Back to Bank / Card / Wallet" },
                  ].map(({ id, label }) => (
                    <label key={id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="compensation"
                        value={id}
                        checked={compensation === id}
                        onChange={() => setCompensation(id)}
                        className="accent-[#8d4f11]"
                      />
                      <span className="text-sm text-[#534439]">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="bg-[#006d3d]/10 border border-[#006d3d]/20 rounded-xl p-4 text-xs text-[#006d3d] leading-relaxed">
                  Once approved, our courier partner will collect the items within 48 hours. Refunds are processed within 3-5 business days after quality check.
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-[#1b1c1a]">Review your return request</h2>
                <div className="flex flex-col gap-3 text-sm">
                  {[
                    { label: "Items to return", value: `${selectedItems.length} item(s)` },
                    { label: "Reason", value: reason || "Not specified" },
                    { label: "Compensation", value: compensation === "original" ? "Original Payment Method" : compensation === "store-credit" ? "Store Credit" : "Bank Transfer" },
                    { label: "Pickup address", value: "42, Craft Lane, Artisan District, Mumbai" },
                    { label: "Est. refund amount", value: `₹${returnableItems.filter((i) => selectedItems.includes(i.id)).reduce((sum, i) => sum + i.price, 0).toLocaleString("en-IN")}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-[#f0ede9] pb-2.5">
                      <span className="text-[#857467]">{label}</span>
                      <span className="font-semibold text-[#1b1c1a]">{value}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer mt-2">
                  <input type="checkbox" className="accent-[#8d4f11] mt-0.5" />
                  <span className="text-xs text-[#534439] leading-relaxed">
                    I confirm that the items are in the stated condition and I understand the return policy.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-2xl hover:border-[#f4a460] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
              Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && selectedItems.length === 0}
                className="btn-press flex items-center gap-2 px-5 py-3 bg-[#8d4f11] hover:bg-[#6e3900] disabled:opacity-40 text-white text-sm font-semibold rounded-2xl transition-colors"
              >
                Continue
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                className="btn-press flex items-center gap-2 px-5 py-3 bg-[#006d3d] hover:bg-[#005a30] text-white text-sm font-semibold rounded-2xl transition-colors"
              >
                Submit Return Request
                <Check size={15} />
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
