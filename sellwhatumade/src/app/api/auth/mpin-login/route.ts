import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/config";
import { setSessionCookies } from "@/lib/api/session";
import { messageFromBody } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

/** Buyer-adapter MPIN login response shape (snake_case). */
interface MpinLoginResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    phone: string;
    membership_tier?: string;
    avatar_url?: string;
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/auth/mpin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ phone: body.phone, mpin: body.mpin }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  const data = (await backendRes.json().catch(() => null)) as MpinLoginResponse | null;

  if (!backendRes.ok || !data?.access_token || !data?.refresh_token) {
    return NextResponse.json(
      { message: messageFromBody(data, "MPIN login failed.") },
      { status: backendRes.status === 200 ? 401 : backendRes.status },
    );
  }

  await setSessionCookies(data.access_token, data.refresh_token);

  return NextResponse.json({ success: true });
}
