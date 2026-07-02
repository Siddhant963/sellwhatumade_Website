"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Lock, CheckCircle, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

const PASSWORD_HINT = "8+ characters with upper, lower, digit and special character.";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset password. The link may have expired.");
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

        {!token ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1b1c1a] mb-3">Invalid reset link</h1>
            <p className="text-[#857467] leading-relaxed mb-8">
              This link is missing its reset token. Please request a new password reset email.
            </p>
            <Link
              href="/forgot-password"
              className="btn-press inline-flex items-center gap-2 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl hover:bg-[#6e3900] transition-colors"
            >
              Request New Link
            </Link>
          </div>
        ) : done ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#006d3d]/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-[#006d3d]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1b1c1a] mb-3">Password updated</h1>
            <p className="text-[#857467] leading-relaxed mb-8">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="btn-press inline-flex items-center gap-2 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl hover:bg-[#6e3900] transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1b1c1a] mb-2">Set a new password</h1>
              <p className="text-[#857467] leading-relaxed">{PASSWORD_HINT}</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#534439]">New password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#857467]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#534439]">Confirm password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857467]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
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
                {submitting ? "Updating…" : "Update Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf9f5]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
