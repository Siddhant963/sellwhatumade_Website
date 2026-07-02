"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Bell, Shield, Globe, CreditCard, Trash2, Eye, EyeOff, Loader2, Check, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth/AuthContext";
import { api, apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type {
  AuthUser,
  AvatarPresignResponse,
  EditableNotificationPrefs,
  NotificationPreferences,
} from "@/lib/api/types";

const sections = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Security" },
  { icon: Globe, label: "Language & Region" },
  { icon: CreditCard, label: "Payment Methods" },
];

const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
];

const NOTIF_ROWS: { key: keyof EditableNotificationPrefs; label: string; desc: string }[] = [
  { key: "orderUpdates", label: "Order updates", desc: "Shipping, delivery, and status changes" },
  { key: "dealsOffers", label: "Deals & offers", desc: "Flash sales and exclusive discounts" },
  { key: "makerStories", label: "Maker stories", desc: "New stories from artisans you follow" },
  { key: "backInStock", label: "Back in stock alerts", desc: "When wishlisted items are available" },
];

function Toast({ kind, text }: { kind: "ok" | "err"; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
        kind === "ok" ? "bg-[#97f3b5]/20 border border-[#97f3b5]/50 text-[#006d3d]" : "bg-red-50 border border-red-200 text-red-700"
      }`}
    >
      {kind === "ok" ? <Check size={15} /> : <AlertTriangle size={15} />}
      {text}
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Profile");

  if (!authLoading && !user) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-2">Sign in to manage your account</h1>
          <Link href="/login?next=/settings" className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            Sign in
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-6">Account Settings</h1>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-52 shrink-0">
              <div className="bg-white rounded-2xl shadow-artisan p-2">
                {sections.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => setActiveSection(label)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      activeSection === label ? "bg-[#8d4f11]/10 text-[#8d4f11]" : "text-[#534439] hover:bg-[#f7f4f0]"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-[#f0ede9]">
                  <button
                    onClick={() => setActiveSection("Delete")}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === "Delete" ? "bg-red-50 text-red-600" : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 size={15} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-artisan p-6">
              {authLoading || !user ? (
                <div className="flex items-center justify-center py-20 text-[#857467]">
                  <Loader2 className="animate-spin mr-2" /> Loading…
                </div>
              ) : (
                <>
                  {activeSection === "Profile" && <ProfileSection user={user} refresh={refresh} />}
                  {activeSection === "Notifications" && <NotificationsSection />}
                  {activeSection === "Security" && <SecuritySection />}
                  {activeSection === "Language & Region" && <LanguageSection user={user} refresh={refresh} />}
                  {activeSection === "Payment Methods" && <PaymentSection />}
                  {activeSection === "Delete" && <DeleteSection onDeleted={() => router.push("/")} />}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── Profile ────────────────────────────────────────────────────────────────────
function ProfileSection({ user, refresh }: { user: AuthUser; refresh: () => Promise<AuthUser | null> }) {
  const [form, setForm] = useState({
    fullName: user.fullName ?? "",
    phone: user.phone ?? "",
    location: user.location ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setToast(null);
    setSaving(true);
    try {
      await api.patch("/auth/me", {
        fullName: form.fullName || undefined,
        phone: form.phone || undefined,
        location: form.location || undefined,
      });
      await refresh();
      setToast({ kind: "ok", text: "Profile updated." });
    } catch (err) {
      const msg = err instanceof ApiError && err.status === 409 ? "That phone number is already in use." : err instanceof Error ? err.message : "Could not save.";
      setToast({ kind: "err", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setToast(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setToast({ kind: "err", text: "Use a JPEG, PNG, or WebP image." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast({ kind: "err", text: "Image must be 5 MB or smaller." });
      return;
    }
    setUploading(true);
    try {
      const presign = await api.post<AvatarPresignResponse>("/auth/me/avatar/presign", {
        contentType: file.type,
        fileSize: file.size,
      });
      // Cloudinary signed uploads require multipart/form-data POST with the
      // signed fields below — not a raw PUT of the file bytes.
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", presign.apiKey);
      fd.append("timestamp", String(presign.timestamp));
      fd.append("signature", presign.signature);
      fd.append("folder", presign.folder);
      fd.append("public_id", presign.publicId);

      const put = await fetch(presign.uploadUrl, { method: "POST", body: fd });
      if (!put.ok) throw new Error("Upload failed. Check your connection and try again.");
      const uploaded = (await put.json()) as { secure_url: string };
      await api.patch("/auth/me", { avatar: uploaded.secure_url ?? presign.publicUrl });
      await refresh();
      setToast({ kind: "ok", text: "Photo updated." });
    } catch (err) {
      setToast({ kind: "err", text: err instanceof Error ? err.message : "Could not upload photo." });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const initial = (user.fullName || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-[#1b1c1a]">Profile Information</h2>
      {toast && <Toast kind={toast.kind} text={toast.text} />}

      <div className="flex items-center gap-4 pb-5 border-b border-[#f0ede9]">
        <div className="w-16 h-16 rounded-full bg-[#f4a460]/20 flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-[#8d4f11]">{initial}</span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onPickFile} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 border border-[#d8c3b4] text-sm text-[#534439] font-medium rounded-xl hover:border-[#f4a460] transition-colors disabled:opacity-60"
        >
          {uploading && <Loader2 size={14} className="animate-spin" />}
          {uploading ? "Uploading…" : "Change Photo"}
        </button>
      </div>

      <Labeled label="Full Name">
        <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" className={inputCls} />
      </Labeled>
      <Labeled label="Email Address">
        <input value={user.email ?? ""} readOnly placeholder="—" className={`${inputCls} bg-[#f7f4f0] cursor-not-allowed text-[#857467]`} />
        <p className="text-xs text-[#857467] mt-1">Email can&apos;t be changed here.</p>
      </Labeled>
      <Labeled label="Phone Number">
        <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
      </Labeled>
      <Labeled label="Location">
        <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, State" className={inputCls} />
      </Labeled>

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

// ── Notifications ───────────────────────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<NotificationPreferences>("/auth/me/notification-preferences")
      .then((p) => active && setPrefs(p))
      .catch(() => active && setToast({ kind: "err", text: "Could not load preferences." }))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const toggle = async (key: keyof EditableNotificationPrefs) => {
    if (!prefs) return;
    const next = !prefs[key];
    setPrefs({ ...prefs, [key]: next }); // optimistic
    setSaving(key);
    setToast(null);
    try {
      const updated = await api.patch<NotificationPreferences>("/auth/me/notification-preferences", { [key]: next });
      setPrefs(updated);
    } catch (err) {
      setPrefs((p) => (p ? { ...p, [key]: !next } : p)); // revert
      setToast({ kind: "err", text: err instanceof Error ? err.message : "Could not update." });
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="py-10 text-center text-[#857467]"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-[#1b1c1a]">Notification Preferences</h2>
      {toast && <Toast kind={toast.kind} text={toast.text} />}
      {NOTIF_ROWS.map(({ key, label, desc }) => (
        <Row key={key} label={label} desc={desc} checked={!!prefs?.[key]} busy={saving === key} onChange={() => toggle(key)} />
      ))}
      {/* Non-disableable */}
      <Row label="System notifications" desc="Account security and platform updates (always on)" checked disabled />
    </div>
  );
}

function Row({ label, desc, checked, onChange, disabled, busy }: { label: string; desc: string; checked: boolean; onChange?: () => void; disabled?: boolean; busy?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f7f4f0]">
      <div>
        <p className="text-sm font-semibold text-[#1b1c1a]">{label}</p>
        <p className="text-xs text-[#857467]">{desc}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled || busy}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#8d4f11]" : "bg-[#e4e2de]"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

// ── Security ────────────────────────────────────────────────────────────────────
function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const submit = async () => {
    setToast(null);
    if (!currentPassword || !newPassword) {
      setToast({ kind: "err", text: "Fill in both password fields." });
      return;
    }
    setSaving(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setCurrent("");
      setNew("");
      setToast({ kind: "ok", text: "Password updated. Other sessions were signed out." });
    } catch (err) {
      let msg = err instanceof Error ? err.message : "Could not update password.";
      if (err instanceof ApiError && err.status === 400 && String(err.code) === "NO_PASSWORD_SET") {
        msg = "Your account has no password. Use “Forgot password” to set one.";
      }
      setToast({ kind: "err", text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-[#1b1c1a]">Security Settings</h2>
      {toast && <Toast kind={toast.kind} text={toast.text} />}
      <Labeled label="Current Password">
        <div className="relative">
          <input type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" className={`${inputCls} pr-10`} />
          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857467]">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Labeled>
      <Labeled label="New Password">
        <input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} placeholder="8+ chars, upper, lower, digit & symbol" className={inputCls} />
      </Labeled>
      <button
        onClick={submit}
        disabled={saving}
        className="btn-press self-start px-6 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors flex items-center gap-2 disabled:opacity-60"
      >
        {saving && <Loader2 size={15} className="animate-spin" />}
        {saving ? "Updating…" : "Update Password"}
      </button>
      <p className="text-xs text-[#857467]">
        Forgot your current password? <Link href="/forgot-password" className="text-[#8d4f11] font-semibold hover:underline">Reset it instead</Link>.
      </p>
    </div>
  );
}

// ── Language & Region ──────────────────────────────────────────────────────────
function LanguageSection({ user, refresh }: { user: AuthUser; refresh: () => Promise<AuthUser | null> }) {
  const [language, setLanguage] = useState(user.language || "en");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const save = async () => {
    setToast(null);
    setSaving(true);
    try {
      await api.patch("/auth/me", { language, currency: "INR" });
      await refresh();
      setToast({ kind: "ok", text: "Preferences saved." });
    } catch (err) {
      setToast({ kind: "err", text: err instanceof Error ? err.message : "Could not save." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-[#1b1c1a]">Language &amp; Region</h2>
      {toast && <Toast kind={toast.kind} text={toast.text} />}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#534439]">Display Language</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-4 py-2.5 rounded-xl text-sm border-2 font-medium transition-all ${
                language === code ? "border-[#8d4f11] bg-[#8d4f11]/5 text-[#8d4f11]" : "border-[#e4e2de] text-[#534439] hover:border-[#f4a460]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Labeled label="Currency">
        <select className={inputCls} defaultValue="INR" disabled>
          <option value="INR">₹ Indian Rupee (INR)</option>
        </select>
      </Labeled>
      <button
        onClick={save}
        disabled={saving}
        className="btn-press self-start px-6 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors flex items-center gap-2 disabled:opacity-60"
      >
        {saving && <Loader2 size={15} className="animate-spin" />}
        {saving ? "Saving…" : "Save Preferences"}
      </button>
    </div>
  );
}

// ── Payment ────────────────────────────────────────────────────────────────────
function PaymentSection() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-[#1b1c1a]">Payment Methods</h2>
      <div className="flex flex-col items-center justify-center text-center gap-3 py-12 border border-dashed border-[#d8c3b4] rounded-2xl">
        <div className="w-12 h-9 bg-[#efeeea] rounded-lg flex items-center justify-center">
          <CreditCard size={18} className="text-[#857467]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1b1c1a]">No saved payment methods</p>
          <p className="text-xs text-[#857467] mt-1 max-w-xs">
            Payments are handled securely through Razorpay at checkout — no card details are stored on SellWhatUMade.
          </p>
        </div>
        <Link href="/marketplace" className="mt-1 px-5 py-2.5 bg-[#8d4f11] text-white text-sm font-semibold rounded-xl hover:bg-[#6e3900] transition-colors">
          Browse marketplace
        </Link>
      </div>
    </div>
  );
}

// ── Delete ──────────────────────────────────────────────────────────────────────
function DeleteSection({ onDeleted }: { onDeleted: () => void }) {
  const { logout } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const del = async () => {
    setError(null);
    setDeleting(true);
    try {
      // Password users supply password; Google/OTP-only users rely on confirm:true.
      await apiFetch("/auth/me", {
        method: "DELETE",
        body: { password: password || undefined, confirm: true },
      } as never);
      await logout();
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete account.");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-red-600">Delete Account</h2>
      <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <span>This deactivates your account and signs you out everywhere. This can&apos;t be undone from here.</span>
      </div>
      {error && <Toast kind="err" text={error} />}
      <Labeled label="Confirm your password (if you have one)">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className={inputCls} />
      </Labeled>
      <Labeled label='Type "DELETE" to confirm'>
        <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" className={inputCls} />
      </Labeled>
      <button
        onClick={del}
        disabled={deleting || confirmText !== "DELETE"}
        className="btn-press self-start px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {deleting && <Loader2 size={15} className="animate-spin" />}
        {deleting ? "Deleting…" : "Delete my account"}
      </button>
    </div>
  );
}

// ── Shared bits ─────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#a89c90]";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#534439]">{label}</label>
      {children}
    </div>
  );
}
