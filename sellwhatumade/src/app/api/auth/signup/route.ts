import type { NextRequest } from "next/server";
import { authExchange } from "@/lib/api/auth-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return authExchange("/auth/signup", {
    fullName: body.fullName,
    email: body.email,
    phone: body.phone || undefined,
    password: body.password,
    role: body.role, // "user" | "seller"
    craftCategory: body.craftCategory || undefined,
  });
}
