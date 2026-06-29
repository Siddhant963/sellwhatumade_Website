/**
 * Server-side Cloudinary presign for category images.
 * Runs entirely in Next.js — no backend deployment needed.
 * Reads CLOUDINARY_* env vars from .env.local.
 */
import { NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { getAccessToken } from "@/lib/api/session";
import { BACKEND_URL } from "@/lib/api/config";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function cloudinarySign(params: Record<string, string | number>, secret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(`${sorted}${secret}`).digest("hex");
}

export async function POST(req: Request) {
  // ── Auth: verify caller is an admin ──────────────────────────────────────
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  }).catch(() => null);
  if (!meRes?.ok) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const me = (await meRes.json().catch(() => null)) as { role?: string } | null;
  if (me?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  // ── Cloudinary credentials ────────────────────────────────────────────────
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const baseFolder = process.env.CLOUDINARY_FOLDER ?? "swum";

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Cloudinary credentials not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local." },
      { status: 503 },
    );
  }

  // ── Validate content type ─────────────────────────────────────────────────
  const body = await req.json().catch(() => ({})) as { contentType?: string };
  if (!body.contentType || !ALLOWED_TYPES.includes(body.contentType)) {
    return NextResponse.json(
      { message: "Only JPEG, PNG, and WebP images are allowed." },
      { status: 400 },
    );
  }

  // ── Generate signed upload params ─────────────────────────────────────────
  const folder = `${baseFolder}/categories`;
  const publicId = randomUUID();
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinarySign({ folder, public_id: publicId, timestamp }, apiSecret);

  return NextResponse.json({
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    apiKey,
    timestamp,
    signature,
    folder,
    publicId,
    publicUrl: `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${publicId}`,
    expiresIn: 300,
  });
}
