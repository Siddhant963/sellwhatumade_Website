"use client";
import { useEffect, useRef, useState } from "react";
import { Store, Link2, User, Check, AlertTriangle, Loader2, Quote } from "lucide-react";
import SellerSidebar from "@/components/SellerSidebar";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { SellerProfile } from "@/lib/api/types";

const TABS = [
  { key: "profile", icon: Store, label: "Shop Profile" },
  { key: "social", icon: Link2, label: "Social Links" },
  { key: "account", icon: User, label: "My Account" },
];

const STORY_MAX = 1000;

function Toast({ kind, text }: { kind: "ok" | "err"; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
        kind === "ok"
          ? "bg-[#97f3b5]/20 border border-[#97f3b5]/50 text-[#006d3d]"
          : "bg-red-50 border border-red-200 text-red-700"
      }`}
    >
      {kind === "ok" ? <Check size={15} /> : <AlertTriangle size={15} />}
      {text}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#a89c90]";

function Labeled({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#534439]">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#857467]">{hint}</p>}
    </div>
  );
}

// ── Shop Profile Tab ───────────────────────────────────────────────────────────
function ShopProfileTab({ profile }: { profile: SellerProfile | null }) {
  const [form, setForm] = useState({
    shopName: profile?.shopName ?? "",
    specialization: profile?.specialization ?? "",
    yearsExperience: profile?.yearsExperience ?? 0,
    story: profile?.shopDescription ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const storyRef = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setToast(null);
    setSaving(true);
    try {
      await api.put("/seller/v1/onboarding/profile", {
        shopName: form.shopName || undefined,
        specialization: form.specialization || undefined,
        yearsExperience: form.yearsExperience,
        shopDescription: form.story || undefined,
      });
      setToast({ kind: "ok", text: "Profile updated successfully." });
    } catch (err) {
      setToast({
        kind: "err",
        text: err instanceof ApiError ? err.message : "Could not save changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  const storyLen = form.story.length;
  const storyNearLimit = storyLen > STORY_MAX * 0.85;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-bold text-[#1b1c1a]">Shop Profile</h2>
        <p className="text-sm text-[#857467] mt-1">
          This information appears on your public artisan page and in the Makers directory.
        </p>
      </div>

      {toast && <Toast kind={toast.kind} text={toast.text} />}

      <Labeled label="Shop Name">
        <input
          value={form.shopName}
          onChange={(e) => set("shopName", e.target.value)}
          maxLength={120}
          placeholder="e.g. Kamala Weavers"
          className={inputCls}
        />
      </Labeled>

      <Labeled label="Craft Specialization" hint="Helps buyers discover you. e.g. Madhubani Painting, Blue Pottery">
        <input
          value={form.specialization}
          onChange={(e) => set("specialization", e.target.value)}
          maxLength={200}
          placeholder="e.g. Indigo Weaving"
          className={inputCls}
        />
      </Labeled>

      <Labeled label="Years of Experience">
        <input
          type="number"
          value={form.yearsExperience}
          onChange={(e) => set("yearsExperience", Math.max(0, Math.min(100, Number(e.target.value))))}
          min={0}
          max={100}
          className={`${inputCls} max-w-32`}
        />
      </Labeled>

      {/* Story — the main feature */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#534439]">My Artisan Story</label>
          <span
            className={`text-xs tabular-nums ${
              storyNearLimit ? "text-[#8d4f11] font-semibold" : "text-[#857467]"
            }`}
          >
            {storyLen}/{STORY_MAX}
          </span>
        </div>
        <textarea
          ref={storyRef}
          value={form.story}
          onChange={(e) => set("story", e.target.value.slice(0, STORY_MAX))}
          rows={6}
          placeholder="Share your craft journey… When did you start? What inspires you? What makes your work unique?"
          className={`${inputCls} resize-y leading-relaxed`}
        />
        <p className="text-xs text-[#857467]">
          Displayed as a quote on the Makers page and on your artisan profile.
        </p>

        {/* Live preview */}
        {form.story.trim() && (
          <div className="mt-2 rounded-xl border border-[#f4a460]/40 bg-[#fffaf5] p-4">
            <p className="text-xs font-semibold text-[#8d4f11] mb-2 flex items-center gap-1.5">
              <Quote size={11} />
              Preview — how it looks on the Makers page
            </p>
            <blockquote className="text-sm text-[#534439] italic leading-relaxed border-l-2 border-[#f4a460] pl-3 line-clamp-3">
              &ldquo;{form.story}&rdquo;
            </blockquote>
          </div>
        )}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="btn-press self-start px-6 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors flex items-center gap-2 disabled:opacity-60"
      >
        {saving && <Loader2 size={15} className="animate-spin" />}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

// ── Social Links Tab ────────────────────────────────────────────────────────────
function SocialLinksTab({ profile }: { profile: SellerProfile | null }) {
  const [form, setForm] = useState({
    whatsappNumber: profile?.whatsappNumber ?? "",
    instagramHandle: profile?.instagramHandle ?? "",
    websiteUrl: profile?.websiteUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setToast(null);
    setSaving(true);
    try {
      await api.put("/seller/v1/onboarding/profile", {
        whatsappNumber: form.whatsappNumber || undefined,
        instagramHandle: form.instagramHandle || undefined,
        websiteUrl: form.websiteUrl || undefined,
      });
      setToast({ kind: "ok", text: "Social links saved." });
    } catch (err) {
      setToast({
        kind: "err",
        text: err instanceof ApiError ? err.message : "Could not save.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-bold text-[#1b1c1a]">Social Links</h2>
        <p className="text-sm text-[#857467] mt-1">Help buyers connect with you directly.</p>
      </div>

      {toast && <Toast kind={toast.kind} text={toast.text} />}

      <Labeled label="WhatsApp Number" hint="10-digit mobile number, no country code">
        <input
          value={form.whatsappNumber}
          onChange={(e) => set("whatsappNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="9876543210"
          className={inputCls}
        />
      </Labeled>

      <Labeled label="Instagram Handle" hint="Without the @ symbol">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#857467]">@</span>
          <input
            value={form.instagramHandle}
            onChange={(e) => set("instagramHandle", e.target.value)}
            maxLength={100}
            placeholder="yourhandle"
            className={`${inputCls} pl-8`}
          />
        </div>
      </Labeled>

      <Labeled label="Website URL">
        <input
          value={form.websiteUrl}
          onChange={(e) => set("websiteUrl", e.target.value)}
          maxLength={300}
          placeholder="https://yourshop.com"
          className={inputCls}
        />
      </Labeled>

      <button
        onClick={save}
        disabled={saving}
        className="btn-press self-start px-6 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors flex items-center gap-2 disabled:opacity-60"
      >
        {saving && <Loader2 size={15} className="animate-spin" />}
        {saving ? "Saving…" : "Save Links"}
      </button>
    </div>
  );
}

// ── Account Tab (redirect to global settings) ──────────────────────────────────
function AccountTab() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-bold text-[#1b1c1a]">My Account</h2>
        <p className="text-sm text-[#857467] mt-1">
          Name, email, password, and notifications are managed in Account Settings.
        </p>
      </div>
      <a
        href="/settings"
        className="self-start px-6 py-2.5 bg-[#1b1c1a] text-white text-sm font-semibold rounded-xl hover:bg-[#333] transition-colors"
      >
        Go to Account Settings →
      </a>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function SellerSettingsPage() {
  const { ready } = useRequireRole(["seller", "admin"]);
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    api
      .get<SellerProfile>("/seller/v1/onboarding/profile")
      .then(setProfile)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [ready]);

  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      <SellerSidebar />
      <main className="flex-1 pt-14 lg:pt-0 lg:pl-56">
        <div className="max-w-3xl mx-auto px-8 py-10">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-1">Settings</h1>
          <p className="text-sm text-[#857467] mb-8">Manage your shop and account preferences.</p>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tab nav */}
            <div className="lg:w-44 shrink-0">
              <div className="bg-white rounded-2xl shadow-artisan p-2">
                {TABS.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      tab === key
                        ? "bg-[#8d4f11]/10 text-[#8d4f11]"
                        : "text-[#534439] hover:bg-[#f7f4f0]"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 bg-white rounded-2xl shadow-artisan p-6 min-h-80">
              {loading ? (
                <div className="flex items-center justify-center py-20 text-[#857467]">
                  <Loader2 className="animate-spin mr-2" /> Loading…
                </div>
              ) : (
                <>
                  {tab === "profile" && <ShopProfileTab profile={profile} />}
                  {tab === "social" && <SocialLinksTab profile={profile} />}
                  {tab === "account" && <AccountTab />}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
