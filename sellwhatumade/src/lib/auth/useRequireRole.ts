"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import type { UserRole } from "@/lib/api/types";

interface GuardState {
  ready: boolean; // auth resolved AND user authorized
  loading: boolean;
}

/**
 * Client guard for role-restricted pages. Redirects to /login (with ?next) when
 * unauthenticated, or to "/" when authenticated but lacking the required role.
 */
export function useRequireRole(roles: UserRole[]): GuardState {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const authorized = !!user && roles.includes(user.role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!roles.includes(user.role)) {
      router.replace("/");
    }
  }, [loading, user, roles, router, pathname]);

  return { ready: !loading && authorized, loading };
}
