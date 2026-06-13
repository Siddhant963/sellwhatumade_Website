/**
 * Central API configuration shared by the BFF route handlers and server helpers.
 *
 * Architecture: the browser never talks to the backend directly. It calls
 * same-origin Next.js route handlers under `/api/*`, which attach the JWT from
 * httpOnly cookies and forward to BACKEND_URL. This keeps tokens out of JS.
 */

/** Backend origin, e.g. http://localhost:3001. Server-side only. */
export const BACKEND_URL =
  process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

/** Same-origin prefix the browser uses to reach the backend through the proxy. */
export const PROXY_PREFIX = "/api/be";

/** httpOnly cookie names holding the JWT pair. */
export const ACCESS_COOKIE = "swum_at";
export const REFRESH_COOKIE = "swum_rt";

/** Cookie options for the auth tokens. */
export const cookieBaseOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/** Access token lifetime hint (seconds) — short; refresh handles renewal. */
export const ACCESS_MAX_AGE = 60 * 60; // 1h
/** Refresh token lifetime hint (seconds). */
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30d
