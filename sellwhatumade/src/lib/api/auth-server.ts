/**
 * Server-only helpers backing the /api/auth/* route handlers.
 * These own the cookie lifecycle for the JWT pair.
 */
import { NextResponse } from "next/server";
import { BACKEND_URL } from "./config";
import { setSessionCookies } from "./session";
import { messageFromBody } from "./errors";
import type { AuthSessionResponse } from "./types";

/** POST to a backend auth endpoint and, on success, persist the token pair. */
export async function authExchange(
  backendPath: string,
  payload: unknown,
): Promise<NextResponse> {
  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  const data = (await backendRes.json().catch(() => null)) as AuthSessionResponse | null;

  if (!backendRes.ok || !data?.token || !data?.refreshToken) {
    return NextResponse.json(
      { message: messageFromBody(data, "Authentication failed.") },
      { status: backendRes.status === 200 ? 401 : backendRes.status },
    );
  }

  await setSessionCookies(data.token, data.refreshToken);

  // Strip tokens before returning to the browser.
  const { token: _t, refreshToken: _r, ...safe } = data;
  void _t;
  void _r;
  return NextResponse.json(safe);
}
