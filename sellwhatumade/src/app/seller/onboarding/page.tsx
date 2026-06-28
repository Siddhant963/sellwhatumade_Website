"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Check, ChevronRight, ChevronLeft, User, Palette, BookOpen, CreditCard, Eye, Loader2 } from "lucide-react";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRequireRole } from "@/lib/auth/useRequireRole";

const steps = [
  { icon: User, label: "Shop" },
  { icon: Palette, label: "Craft" },
  { icon: BookOpen, label: "Story" },
  { icon: CreditCard, label: "Payment" },
  { icon: Eye, label: "Review" },
];

const craftCategories = [
  { id: "Textiles & Weaving", emoji: "🧵" },
  { id: "Pottery & Ceramics", emoji: "🏺" },
  { id: "Folk Paintings", emoji: "🎨" },
  { id: "Metal Craft", emoji: "⚱️" },
  { id: "Wood Craft", emoji: "🪵" },
  { id: "Tribal Jewelry", emoji: "💎" },
  { id: "Leather Craft", emoji: "👜" },
  { id: "Bamboo & Cane", emoji: "🎍" },
];

export default function SellerOnboardingPage() {
  const { ready } = useRequireRole(["seller"]);
  const { refresh } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    shopName: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    craft: "",
    experience: 5,
    bio: "",
    bankAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setError(null);
    if (!form.shopName || !form.line1 || !form.city || !form.state || !form.pincode) {
      setError("Please complete your shop name and address (step 1).");
      setCurrentStep(0);
      return;
    }
    if (!form.bankAccountNumber || !form.ifscCode || !form.accountHolderName) {
      setError("Please complete your payment details (step 4).");
      setCurrentStep(3);
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/seller/v1/onboarding/profile", {
        shopName: form.shopName,
        shopDescription: form.bio || undefined,
        specialization: form.craft || undefined,
        yearsExperience: form.experience,
        address: {
          line1: form.line1,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: "India",
        },
      });
      await api.post("/seller/v1/onboarding/kyc", {
        bankAccountNumber: form.bankAccountNumber,
        ifscCode: form.ifscCode.toUpperCase(),
        accountHolderName: form.accountHolderName,
      });
      await refresh();
      router.push("/seller/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit onboarding.");
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
    <div className="min-h-screen bg-[#fbf9f5]">
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
                  {done ? <Check size={16} className="text-white" /> : <Icon size={16} className={active ? "text-[#8d4f11]" : "text-[#d8c3b4]"} />}
                </div>
                <span className={`text-xs font-medium ${active ? "text-[#8d4f11]" : done ? "text-[#006d3d]" : "text-[#857467]"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-artisan p-7">
          {currentStep === 0 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-1">Set up your shop</h2>
                <p className="text-sm text-[#857467]">Your shop name and pickup address</p>
              </div>
              <Field label="Shop Name" value={form.shopName} onChange={(v) => set("shopName", v)} placeholder="e.g. Laxman's Blue Pottery" />
              <Field label="Address Line 1" value={form.line1} onChange={(v) => set("line1", v)} placeholder="Street, area" />
              <div className="grid grid-cols-3 gap-3">
                <Field label="City" value={form.city} onChange={(v) => set("city", v)} placeholder="Jaipur" />
                <Field label="State" value={form.state} onChange={(v) => set("state", v)} placeholder="Rajasthan" />
                <Field label="Pincode" value={form.pincode} onChange={(v) => set("pincode", v)} placeholder="302001" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-1">Your craft specialty</h2>
                <p className="text-sm text-[#857467]">Select the primary craft you specialise in</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {craftCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => set("craft", cat.id)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all ${
                      form.craft === cat.id ? "border-[#8d4f11] bg-[#8d4f11]/5" : "border-[#e4e2de] bg-[#f7f4f0] hover:border-[#f4a460]"
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className={`text-xs font-medium text-center leading-tight ${form.craft === cat.id ? "text-[#8d4f11]" : "text-[#534439]"}`}>
                      {cat.id}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#534439]">
                  Years of Experience: <strong className="text-[#8d4f11]">{form.experience}</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={form.experience}
                  onChange={(e) => set("experience", Number(e.target.value))}
                  className="w-full accent-[#8d4f11]"
                />
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
                <label className="text-sm font-medium text-[#534439]">Shop Description</label>
                <textarea
                  rows={6}
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Tell buyers about your craft journey, your village, your inspiration..."
                  className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467] resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1a] mb-1">Payment details (KYC)</h2>
                <p className="text-sm text-[#857467]">Where we deposit your earnings. Encrypted at rest.</p>
              </div>
              <Field label="Bank Account Number" value={form.bankAccountNumber} onChange={(v) => set("bankAccountNumber", v)} placeholder="XXXX XXXX XXXX" />
              <Field label="IFSC Code" value={form.ifscCode} onChange={(v) => set("ifscCode", v)} placeholder="HDFC0001234" />
              <Field label="Account Holder Name" value={form.accountHolderName} onChange={(v) => set("accountHolderName", v)} placeholder="As per bank records" />
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
                  Submit your shop and KYC for verification. Our team will review within 24–48 hours.
                </p>
              </div>
              <div className="w-full bg-[#f7f4f0] rounded-xl p-4 text-left flex flex-col gap-2 text-sm text-[#534439]">
                <Summary label="Shop" value={form.shopName} />
                <Summary label="Location" value={`${form.city}, ${form.state}`} />
                <Summary label="Craft" value={form.craft || "—"} />
                <Summary label="Bank" value={form.accountHolderName} />
              </div>
              {error && <p className="text-sm text-[#ba1a1a]">{error}</p>}
            </div>
          )}
        </div>

        {error && currentStep !== 4 && <p className="text-sm text-[#ba1a1a] mt-3">{error}</p>}

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
            <button
              onClick={submit}
              disabled={submitting}
              className="btn-press flex items-center gap-2 px-5 py-3 bg-[#006d3d] hover:bg-[#005a30] text-white text-sm font-semibold rounded-2xl transition-colors disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Submit for Review
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#534439]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
      />
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check size={14} className="text-[#006d3d]" />
      <span className="font-medium">{label}:</span> {value || "—"}
    </div>
  );
}
