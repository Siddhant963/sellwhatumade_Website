/**
 * Catch-all BFF proxy. Any browser call to /api/be/<path> is forwarded to
 * the backend at BACKEND_URL/<path>, with the JWT attached from httpOnly
 * cookies and auto-refreshed on expiry.
 *
 * Examples:
 *   fetch('/api/be/api/v1/products?page=2')  -> GET  {BACKEND_URL}/api/v1/products?page=2
 *   fetch('/api/be/buyer/v1/cart/items', ..) -> POST {BACKEND_URL}/buyer/v1/cart/items
 */
import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/proxy";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const search = req.nextUrl.search; // includes leading "?" or ""
  const backendPath = `/${path.join("/")}${search}`;
  return proxyRequest(req, backendPath);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
