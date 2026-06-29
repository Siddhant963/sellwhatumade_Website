"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, Tags, CheckCircle, Upload, ImageIcon, Link2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { api } from "@/lib/api/client";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import { ApiError } from "@/lib/api/errors";
import type { Category } from "@/lib/api/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  parentId: "",
  sortOrder: "0",
};

interface PresignResponse {
  uploadUrl: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  publicUrl: string;
  expiresIn: number;
}

export default function AdminCategoriesPage() {
  const { ready } = useRequireRole(["admin"]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.get<Category[]>("/api/v1/categories");
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setUploadError(null);
    setUrlMode(false);
  };

  const startEdit = (c: Category) => {
    setEditingId(c._id);
    setError(null);
    setUploadError(null);
    setUrlMode(false);
    setForm({
      name: c.name ?? "",
      slug: c.slug ?? "",
      description: c.description ?? "",
      imageUrl: c.imageUrl ?? c.image ?? "",
      parentId: c.parentId ?? "",
      sortOrder: String(c.sortOrder ?? 0),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-selected
    e.target.value = "";

    setUploadError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError("Image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      // 1. Get presigned params from Next.js server route (no backend deploy needed)
      const presignRes = await fetch("/api/admin/presign-category-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
        credentials: "same-origin",
      });
      if (!presignRes.ok) {
        const e = await presignRes.json().catch(() => null) as { message?: string } | null;
        throw new Error(e?.message ?? "Could not get upload URL.");
      }
      const presign = (await presignRes.json()) as PresignResponse;

      // 2. Upload directly to Cloudinary
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", presign.apiKey);
      fd.append("timestamp", String(presign.timestamp));
      fd.append("signature", presign.signature);
      fd.append("folder", presign.folder);
      fd.append("public_id", presign.publicId);

      const res = await fetch(presign.uploadUrl, { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error((body as { error?: { message?: string } })?.error?.message ?? "Upload failed.");
      }
      const data = (await res.json()) as { secure_url: string };

      set("imageUrl", data.secure_url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    setError(null);
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (form.slug.trim()) body.slug = form.slug.trim();
      if (form.description.trim()) body.description = form.description.trim();
      if (form.imageUrl.trim()) body.imageUrl = form.imageUrl.trim();
      if (form.parentId) body.parentId = form.parentId;

      if (editingId) await api.put(`/api/v1/categories/${editingId}`, body);
      else await api.post("/api/v1/categories", body);

      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"? This only works if it has no sub-categories.`)) return;
    setBusyId(c._id);
    setError(null);
    try {
      await api.delete(`/api/v1/categories/${c._id}`);
      if (editingId === c._id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete category.");
    } finally {
      setBusyId(null);
    }
  };

  const parentName = (id?: string | null) => categories.find((c) => c._id === id)?.name ?? "—";

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] text-[#857467]">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fbf9f5]">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Categories</h1>
            <p className="text-sm text-[#857467] mt-1">{categories.length} categories · manage the marketplace catalog</p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">{error}</div>
          )}

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Create / edit form */}
            <div className="xl:w-80 shrink-0">
              <div className="bg-white rounded-2xl shadow-artisan p-5 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#1b1c1a]">{editingId ? "Edit Category" : "New Category"}</h2>
                  {editingId && (
                    <button onClick={resetForm} type="button" className="text-xs text-[#857467] hover:text-[#8d4f11] flex items-center gap-1">
                      <X size={12} /> Cancel
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3.5">
                  <Field label="Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="Handicrafts" />
                  <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} placeholder="auto-generated from name" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      maxLength={500}
                      placeholder="Handmade items…"
                      className="w-full px-3.5 py-2.5 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] resize-none"
                    />
                  </div>

                  {/* Image upload section */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[#534439]">Category Image</label>
                      <button
                        type="button"
                        onClick={() => setUrlMode((v) => !v)}
                        className="text-xs text-[#8d4f11] hover:underline flex items-center gap-1"
                      >
                        {urlMode ? <><Upload size={11} /> Upload</>  : <><Link2 size={11} /> Enter URL</>}
                      </button>
                    </div>

                    {/* Image preview */}
                    {form.imageUrl && (
                      <div className="relative group rounded-xl overflow-hidden border border-[#d8c3b4] bg-[#fbf9f5]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.imageUrl}
                          alt="Category preview"
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => set("imageUrl", "")}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {urlMode ? (
                      /* Manual URL input */
                      <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(e) => set("imageUrl", e.target.value)}
                        placeholder="https://res.cloudinary.com/…"
                        className="w-full px-3.5 py-2.5 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
                      />
                    ) : (
                      /* Upload button */
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full py-2.5 border-2 border-dashed border-[#d8c3b4] hover:border-[#f4a460] rounded-xl text-sm text-[#857467] hover:text-[#534439] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {uploading ? (
                            <><Loader2 size={15} className="animate-spin" /> Uploading…</>
                          ) : form.imageUrl ? (
                            <><ImageIcon size={15} /> Replace image</>
                          ) : (
                            <><Upload size={15} /> Click to upload image</>
                          )}
                        </button>
                        <p className="text-xs text-[#857467]">JPEG, PNG or WebP · max 5 MB</p>
                      </>
                    )}

                    {uploadError && (
                      <p className="text-xs text-red-600">{uploadError}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#534439]">Parent category</label>
                    <select
                      value={form.parentId}
                      onChange={(e) => set("parentId", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                    >
                      <option value="">None (top-level)</option>
                      {categories
                        .filter((c) => c._id !== editingId)
                        .map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                  </div>
                  <Field label="Sort order" value={form.sortOrder} onChange={(v) => set("sortOrder", v)} placeholder="0" type="number" />

                  <button
                    onClick={submit}
                    disabled={saving || uploading}
                    className="btn-press mt-1 w-full py-2.5 bg-[#8d4f11] hover:bg-[#6e3900] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : editingId ? <CheckCircle size={15} /> : <Plus size={15} />}
                    {editingId ? "Save changes" : "Create category"}
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-artisan overflow-hidden">
                {loading ? (
                  <div className="py-16 text-center text-[#857467]"><Loader2 className="animate-spin inline mr-2" /> Loading…</div>
                ) : categories.length === 0 ? (
                  <div className="py-16 text-center text-[#857467] flex flex-col items-center gap-2">
                    <Tags size={32} className="text-[#d8c3b4]" />
                    No categories yet. Create your first one on the left.
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#f0ede9]">
                        {["Category", "Slug", "Parent", "Products", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#857467] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c._id} className="border-b border-[#f7f4f0] hover:bg-[#fbf9f5] transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              {(c.imageUrl || c.image) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={c.imageUrl || c.image} alt={c.name} className="w-8 h-8 rounded-lg object-cover bg-[#efeeea]" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-[#f4a460]/15 flex items-center justify-center">
                                  <Tags size={14} className="text-[#8d4f11]" />
                                </div>
                              )}
                              <span className="text-sm font-semibold text-[#1b1c1a]">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-[#857467]">{c.slug}</td>
                          <td className="px-4 py-3.5 text-sm text-[#534439]">{parentName(c.parentId)}</td>
                          <td className="px-4 py-3.5 text-sm text-[#1b1c1a]">{c.productCount ?? 0}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => startEdit(c)}
                                title="Edit"
                                className="w-7 h-7 rounded-lg hover:bg-[#f4a460]/15 flex items-center justify-center"
                              >
                                <Pencil size={13} className="text-[#857467]" />
                              </button>
                              <button
                                onClick={() => remove(c)}
                                disabled={busyId === c._id}
                                title="Delete"
                                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center disabled:opacity-50"
                              >
                                {busyId === c._id ? <Loader2 size={13} className="animate-spin text-[#857467]" /> : <Trash2 size={13} className="text-[#857467] hover:text-red-500" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
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
        className="w-full px-3.5 py-2.5 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460] placeholder:text-[#857467]"
      />
    </div>
  );
}
