import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/config";
import { getAccessToken, getRefreshToken, clearSessionCookies } from "@/lib/api/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const refreshToken = await getRefreshToken();
  const accessToken = await getAccessToken();

  // Best-effort backend revocation; clear cookies regardless of outcome.
  if (refreshToken) {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
    } catch {
      // ignore — local logout still proceeds
    }
  }

  await clearSessionCookies();
  return NextResponse.json({ message: "Logged out." });
}
