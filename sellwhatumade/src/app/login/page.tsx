"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf, Eye, EyeOff, Mail, Lock, ShieldCheck, BadgeCheck, Truck } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1b1c1a] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#f4a460]" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[#006d3d]" />
        </div>
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#f4a460] flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">SellWhatUMade</span>
        </Link>

        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Welcome back to the craft marketplace
            </h2>
            <p className="text-[#857467] text-lg leading-relaxed">
              Thousands of artisans and buyers trust our platform every day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: ShieldCheck, text: "Authenticity Guaranteed", sub: "Every product is artisan verified" },
              { icon: BadgeCheck, text: "Secure Payments", sub: "UPI, cards & net banking accepted" },
              { icon: Truck, text: "Pan-India Delivery", sub: "From rural workshops to your door" },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-[#f4a460]/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#f4a460]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{text}</p>
                  <p className="text-[#857467] text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#534439] text-xs relative z-10">
          © 2024 SellWhatUMade · Honoring Craftsmanship
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fbf9f5]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#f4a460] flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#1b1c1a] text-lg tracking-tight">SellWhatUMade</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1b1c1a] mb-2">Welcome back</h1>
            <p className="text-[#857467]">Sign in to your account to continue</p>
          </div>

          {/* Google OAuth */}
          <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-[#d8c3b4] rounded-2xl text-sm font-semibold text-[#1b1c1a] hover:border-[#f4a460] transition-colors mb-6 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#d8c3b4]" />
            <span className="text-xs text-[#857467] font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-[#d8c3b4]" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#534439]">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm text-[#1b1c1a] focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#534439]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#8d4f11] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm text-[#1b1c1a] focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#857467] hover:text-[#534439]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-press w-full py-3.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#857467]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#8d4f11] font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
