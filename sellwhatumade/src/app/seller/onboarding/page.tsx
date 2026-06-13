"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf, Check, Upload, ChevronRight, ChevronLeft, User, Palette, BookOpen, CreditCard, Eye } from "lucide-react";

const steps = [
  { icon: User, label: "Identity" },
  { icon: Palette, label: "Craft" },
  { icon: BookOpen, label: "Story" },
  { icon: CreditCard, label: "Payment" },
  { icon: Eye, label: "Review" },
];

const craftCategories = [
  { id: "textiles", label: "Textiles & Weaving", emoji: "🧵" },
  { id: "pottery", label: "Pottery & Ceramics", emoji: "🏺" },
  { id: "paintings", label: "Folk Paintings", emoji: "🎨" },
  { id: "metal", label: "Metal Craft", emoji: "⚱️" },
  { id: "wood", label: "Wood Craft", emoji: "🪵" },
  { id: "jewelry", label: "Tribal Jewelry", emoji: "💎" },
  { id: "leather", label: "Leather Craft", emoji: "👜" },
  { id: "bamboo", label: "Bamboo & Cane", emoji: "🎍" },
];

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCraft, setSelectedCraft] = useState("");
  const [experience, setExperience] = useState(5);

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#e4e2de] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#1b1c1a] tracking-tight">SellWhatUMade</span>
        </Link>
        <span className="text-sm text-[#857467]">Seller Onboarding</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#e4e2de] -z-10" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all bg-white ${
                  done ? "border-[#006d3d] bg-[#006d3d]" : active ? "border-[#8d4f11]" : "border-[#d8c3b4]"
                }`}>
                  {done ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <Icon size={16} className={active ? "text-[#8d4f11]" : "text-[#d8c3b4]"} />
                  )}
                </div>
                <span className={`text-xs font-medium ${active ? "text-[#8d4f11]" : done ? "text-[#006d3d]" : "text-[#857467]"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-artisan p-7">
          {currentStep === 0 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-1">Tell us about yourself</h2>
                <p className="text-sm text-[#857467]">Basic identity information to set up your seller account</p>
              </div>
              {[
                { label: "Full Name", placeholder: "Your legal full name", type: "text" },
                { label: "Email Address", placeholder: "your@email.com", type: "email" },
                { label: "Phone Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
                { label: "State / Region", placeholder: "e.g. Rajasthan", type: "text" },
              ].map(({ label, placeholder, type }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#534439]">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                  />
                </div>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-1">Your craft specialty</h2>
                <p className="text-sm text-[#857467]">Select the primary craft category you specialise in</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {craftCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCraft(cat.id)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all ${
                      selectedCraft === cat.id
                        ? "border-[#8d4f11] bg-[#8d4f11]/5"
                        : "border-[#e4e2de] bg-[#f7f4f0] hover:border-[#f4a460]"
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className={`text-xs font-medium text-center leading-tight ${
                      selectedCraft === cat.id ? "text-[#8d4f11]" : "text-[#534439]"
                    }`}>
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#534439]">
                  Years of Experience: <strong className="text-[#8d4f11]">{experience}</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full accent-[#8d4f11]"
                />
                <div className="flex justify-between text-xs text-[#857467]">
                  <span>1 year</span>
                  <span>50+ years</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-1">Your maker&apos;s story</h2>
                <p className="text-sm text-[#857467]">Share the story behind your craft — buyers love authentic stories</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#534439]">Bio / Story</label>
                <textarea
                  rows={5}
                  placeholder="Tell buyers about your craft journey, your village, your inspiration..."
                  className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467] resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#534439]">Showcase Photos (up to 5)</label>
                <div className="border-2 border-dashed border-[#d8c3b4] rounded-2xl p-8 text-center hover:border-[#f4a460] transition-colors cursor-pointer">
                  <Upload size={28} className="text-[#d8c3b4] mx-auto mb-2" />
                  <p className="text-sm text-[#857467]">Drag & drop or click to upload</p>
                  <p className="text-xs text-[#d8c3b4] mt-1">PNG, JPG up to 10MB each</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-1">Payment details</h2>
                <p className="text-sm text-[#857467]">We&apos;ll deposit your earnings every 15th of the month</p>
              </div>
              {[
                { label: "Bank Account Number", placeholder: "XXXX XXXX XXXX", type: "text" },
                { label: "IFSC Code", placeholder: "e.g. HDFC0001234", type: "text" },
                { label: "Account Holder Name", placeholder: "As per bank records", type: "text" },
              ].map(({ label, placeholder, type }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#534439]">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                  />
                </div>
              ))}
              <div className="bg-[#006d3d]/10 border border-[#006d3d]/20 rounded-xl p-4 text-sm text-[#006d3d]">
                Your banking details are encrypted and stored securely. Payouts are processed via NEFT/IMPS.
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#006d3d]/10 flex items-center justify-center">
                <Check size={30} className="text-[#006d3d]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">You&apos;re almost there!</h2>
                <p className="text-[#857467] leading-relaxed">
                  Review your details and submit for verification. Our team will verify your account within 24-48 hours.
                </p>
              </div>
              <div className="w-full bg-[#f7f4f0] rounded-xl p-4 text-left flex flex-col gap-2 text-sm text-[#534439]">
                {["Identity verified", "Craft category selected", "Story added", "Payment details saved"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-[#006d3d]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-2xl hover:border-[#f4a460] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={next}
              className="btn-press flex items-center gap-2 px-5 py-3 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-semibold rounded-2xl transition-colors"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <Link
              href="/seller/dashboard"
              className="btn-press flex items-center gap-2 px-5 py-3 bg-[#006d3d] hover:bg-[#005a30] text-white text-sm font-semibold rounded-2xl transition-colors"
            >
              Submit for Review
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
