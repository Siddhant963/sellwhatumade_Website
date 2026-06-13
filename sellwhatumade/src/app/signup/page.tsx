"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag, Store, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { BACKEND_URL } from "@/lib/api/config";

const crafts = [
  "Textiles & Weaving", "Pottery & Ceramics", "Paintings & Art", "Metal Craft",
  "Wood Craft", "Jewelry", "Leather Craft", "Bamboo & Cane", "Paper Craft", "Other",
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", craft: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await signup({
        fullName: form.name,
        email: form.email,
        phone: form.phone ? `+91${form.phone.replace(/\D/g, "")}` : undefined,
        password: form.password,
        role: role === "seller" ? "seller" : "user",
        craftCategory: role === "seller" ? form.craft || undefined : undefined,
      });
      if (user.role === "seller") router.push("/seller/onboarding");
      else router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#1b1c1a] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#f4a460]" />
          <div className="absolute bottom-10 left-5 w-52 h-52 rounded-full bg-[#006d3d]" />
        </div>
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">SellWhatUMade</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-5 leading-tight">
            Join India&apos;s finest craft marketplace
          </h2>
          <p className="text-[#857467] text-lg leading-relaxed mb-8">
            Whether you create or collect — there&apos;s a place for you here.
          </p>
          <div className="flex flex-col gap-4">
            {[
              "1,240+ verified artisans",
              "800+ craft categories",
              "Free to join as a buyer",
              "Earn 85% on every sale",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-[#d8c3b4]">
                <div className="w-5 h-5 rounded-full bg-[#006d3d]/40 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#97f3b5]" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#534439] text-xs relative z-10">
          © 2024 SellWhatUMade · Honoring Craftsmanship
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fbf9f5] overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#f4a460] flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#1b1c1a] text-lg tracking-tight">SellWhatUMade</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1b1c1a] mb-2">Create your account</h1>
            <p className="text-[#857467]">Join thousands of artisans and conscious buyers</p>
          </div>

          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["buyer", "seller"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-2.5 py-4 px-4 rounded-2xl border-2 transition-all ${
                  role === r
                    ? "border-[#8d4f11] bg-[#8d4f11]/5"
                    : "border-[#d8c3b4] bg-white hover:border-[#f4a460]"
                }`}
              >
                {r === "buyer" ? (
                  <ShoppingBag size={22} className={role === r ? "text-[#8d4f11]" : "text-[#857467]"} />
                ) : (
                  <Store size={22} className={role === r ? "text-[#8d4f11]" : "text-[#857467]"} />
                )}
                <div className="text-center">
                  <p className={`text-sm font-bold ${role === r ? "text-[#8d4f11]" : "text-[#1b1c1a]"}`}>
                    {r === "buyer" ? "I Want to Buy" : "I Want to Sell"}
                  </p>
                  <p className="text-xs text-[#857467]">
                    {r === "buyer" ? "Shop artisan crafts" : "Sell my handmade crafts"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `${BACKEND_URL}/auth/google`;
            }}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-[#d8c3b4] rounded-2xl text-sm font-semibold text-[#1b1c1a] hover:border-[#f4a460] transition-colors mb-5 shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#d8c3b4]" />
            <span className="text-xs text-[#857467] font-medium">or with email</span>
            <div className="flex-1 h-px bg-[#d8c3b4]" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#534439]">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#534439]">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#534439]">Phone number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm text-[#534439] font-medium shrink-0">
                  <span className="text-base">🇮🇳</span>
                  <span>+91</span>
                </div>
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="10-digit mobile"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                  />
                </div>
              </div>
            </div>

            {role === "seller" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#534439]">Primary Craft</label>
                <div className="relative">
                  <select
                    value={form.craft}
                    onChange={update("craft")}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm text-[#1b1c1a] focus:outline-none focus:border-[#f4a460] appearance-none"
                  >
                    <option value="">Select your craft</option>
                    {crafts.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#857467] pointer-events-none" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#534439]">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={update("password")}
                  placeholder="8+ chars, upper, lower, digit & symbol"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#857467]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#857467] leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-[#8d4f11] hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="#" className="text-[#8d4f11] hover:underline">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="btn-press w-full py-3.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#857467]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#8d4f11] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
