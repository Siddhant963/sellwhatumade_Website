import type { NextRequest } from "next/server";
import { authExchange } from "@/lib/api/auth-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return authExchange("/auth/login", {
    email: body.email,
    password: body.password,
  });
}
