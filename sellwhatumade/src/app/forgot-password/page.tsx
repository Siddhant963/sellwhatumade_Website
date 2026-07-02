"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      // Backend intentionally returns success regardless; treat as sent.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Image src="/website_logo.png" alt="SellWhatUMade" width={160} height={40} className="object-contain h-10 w-auto" />
        </Link>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#006d3d]/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-[#006d3d]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1b1c1a] mb-3">Check your inbox</h1>
            <p className="text-[#857467] leading-relaxed mb-8">
              We&apos;ve sent a password reset link to <strong className="text-[#534439]">{email}</strong>.
              It should arrive within a few minutes.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-[#8d4f11] font-semibold hover:underline"
            >
              Try a different email
            </button>
            <div className="mt-6">
              <Link
                href="/login"
                className="btn-press inline-flex items-center gap-2 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl hover:bg-[#6e3900] transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#857467] hover:text-[#534439] mb-8">
              <ArrowLeft size={15} />
              Back to sign in
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1b1c1a] mb-2">Forgot your password?</h1>
              <p className="text-[#857467] leading-relaxed">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#534439]">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-press w-full py-3.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white font-bold rounded-2xl transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                {submitting ? "Sending…" : "Send Reset Link"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#857467]">
              Remember your password?{" "}
              <Link href="/login" className="text-[#8d4f11] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
