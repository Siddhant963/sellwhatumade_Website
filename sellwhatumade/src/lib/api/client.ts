"use client";
/**
 * Browser API client. Talks to the same-origin BFF proxy, which attaches the
 * JWT from httpOnly cookies and refreshes it transparently. Never sends tokens
 * from JS — cookies ride along automatically (same-origin).
 */
import { PROXY_PREFIX } from "./config";
import { ApiError, messageFromBody } from "./errors";

export interface ClientFetchOptions extends Omit<RequestInit, "body"> {
  /** Plain object (JSON-encoded) or a raw BodyInit (FormData, etc.). */
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
}

function buildPath(path: string, query?: ClientFetchOptions["query"]): string {
  // path is a backend path like "/buyer/v1/cart" — prefix with the proxy.
  const normalized = path.startsWith("/") ? path : `/${path}`;
  let url = `${PROXY_PREFIX}${normalized}`;
  if (query) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    const s = qs.toString();
    if (s) url += `${url.includes("?") ? "&" : "?"}${s}`;
  }
  return url;
}

export async function apiFetch<T>(path: string, options: ClientFetchOptions = {}): Promise<T> {
  const { body, query, headers, ...rest } = options;
  const h = new Headers(headers);
  h.set("Accept", "application/json");

  let payload: BodyInit | undefined;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && body !== null) {
    if (isFormData || typeof body === "string") {
      payload = body as BodyInit;
    } else {
      h.set("Content-Type", "application/json");
      payload = JSON.stringify(body);
    }
  }

  const res = await fetch(buildPath(path, query), {
    ...rest,
    headers: h,
    body: payload,
    credentials: "same-origin",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, messageFromBody(data, res.statusText), undefined, data);
  }
  return data as T;
}

/** Convenience verbs. */
export const api = {
  get: <T>(path: string, opts?: ClientFetchOptions) => apiFetch<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: ClientFetchOptions) =>
    apiFetch<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: ClientFetchOptions) =>
    apiFetch<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: ClientFetchOptions) =>
    apiFetch<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: ClientFetchOptions) =>
    apiFetch<T>(path, { ...opts, method: "DELETE" }),
};
