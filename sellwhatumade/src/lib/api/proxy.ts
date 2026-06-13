/**
 * Core BFF proxy. Forwards a browser request to the backend, attaching the
 * Bearer token from httpOnly cookies and transparently refreshing it on a 401.
 *
 * Used by the catch-all route at /api/be/[...path].
 */
import { NextResponse } from "next/server";
import { BACKEND_URL } from "./config";
import {
  getAccessToken,
  getRefreshToken,
  setSessionCookies,
  clearSessionCookies,
} from "./session";

/** Headers we must not forward verbatim (hop-by-hop / host-specific). */
const STRIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "cookie",
  "authorization",
]);

interface RefreshResult {
  token: string;
  refreshToken: string;
}

/** Call the backend refresh endpoint. Returns null if it fails. */
async function tryRefresh(): Promise<RefreshResult | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RefreshResult;
    if (!data?.token || !data?.refreshToken) return null;
    return data;
  } catch {
    return null;
  }
}

async function forward(
  backendPath: string,
  method: string,
  headers: Headers,
  bodyBuffer: ArrayBuffer | null,
  token: string | undefined,
): Promise<Response> {
  const outHeaders = new Headers();
  headers.forEach((value, key) => {
    if (!STRIP_REQUEST_HEADERS.has(key.toLowerCase())) outHeaders.set(key, value);
  });
  outHeaders.set("Accept", "application/json");
  if (token) outHeaders.set("Authorization", `Bearer ${token}`);

  return fetch(`${BACKEND_URL}${backendPath}`, {
    method,
    headers: outHeaders,
    body: bodyBuffer && bodyBuffer.byteLength > 0 ? Buffer.from(bodyBuffer) : undefined,
    cache: "no-store",
    redirect: "manual",
  });
}

/** Build a same-shape NextResponse from a backend Response. */
async function relay(backendRes: Response): Promise<NextResponse> {
  const buf = await backendRes.arrayBuffer();
  const res = new NextResponse(buf, { status: backendRes.status });
  const contentType = backendRes.headers.get("content-type");
  if (contentType) res.headers.set("content-type", contentType);
  return res;
}

/**
 * Proxy a request. `backendPath` already includes the leading slash and any
 * query string (e.g. "/buyer/v1/cart" or "/api/v1/products?page=2").
 */
export async function proxyRequest(req: Request, backendPath: string): Promise<NextResponse> {
  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const bodyBuffer = hasBody ? await req.arrayBuffer() : null;

  let token = await getAccessToken();
  let backendRes = await forward(backendPath, method, req.headers, bodyBuffer, token);

  // Transparent refresh on 401 (only if we had a session to begin with).
  if (backendRes.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      await setSessionCookies(refreshed.token, refreshed.refreshToken);
      token = refreshed.token;
      backendRes = await forward(backendPath, method, req.headers, bodyBuffer, token);
    } else if (await getRefreshToken()) {
      // Refresh token present but invalid → session is dead, clear it.
      await clearSessionCookies();
    }
  }

  return relay(backendRes);
}
