/**
 * Server-side auth session helpers. Tokens live in httpOnly cookies and are
 * only ever read/written inside route handlers and server components.
 */
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
  cookieBaseOptions,
} from "./config";

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

/** Persist a fresh token pair into httpOnly cookies (call from a route handler). */
export async function setSessionCookies(token: string, refreshToken: string): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, token, { ...cookieBaseOptions, maxAge: ACCESS_MAX_AGE });
  store.set(REFRESH_COOKIE, refreshToken, { ...cookieBaseOptions, maxAge: REFRESH_MAX_AGE });
}

/** Clear the session (logout). */
export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
