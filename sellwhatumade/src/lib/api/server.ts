/**
 * Server-side fetch helper for Server Components (mostly public catalog reads).
 *
 * Attaches the Bearer token from cookies when present. Does NOT auto-refresh —
 * Server Components cannot mutate cookies during render. Authenticated, mutating,
 * and refresh-dependent calls should go through the browser proxy (/api/be/*).
 */
import { BACKEND_URL } from "./config";
import { getAccessToken } from "./session";
import { ApiError, messageFromBody } from "./errors";

export interface ServerFetchOptions extends RequestInit {
  /** Next.js fetch caching controls. Defaults to no-store for live data. */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
}

export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, messageFromBody(body, res.statusText), undefined, body);
  }
  return body as T;
}

/**
 * Like serverFetch but returns null on 404/401 instead of throwing —
 * convenient for pages that should render an empty/not-found state.
 */
export async function serverFetchOrNull<T>(
  path: string,
  options?: ServerFetchOptions,
): Promise<T | null> {
  try {
    return await serverFetch<T>(path, options);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 401)) return null;
    throw err;
  }
}
