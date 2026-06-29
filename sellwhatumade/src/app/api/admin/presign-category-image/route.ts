/**
 * Proxies the Cloudinary presign request to the backend.
 * The backend holds the Cloudinary credentials (Render env vars),
 * so signing happens there — no credentials needed in Next.js env.
 */
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/api/session";
import { BACKEND_URL } from "@/lib/api/config";
import { messageFromBody } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as { contentType?: string };

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/v1/categories/presign-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contentType: body.contentType }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  const data = await backendRes.json().catch(() => null);
  if (!backendRes.ok) {
    return NextResponse.json(
      { message: messageFromBody(data, "Could not get upload URL.") },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
