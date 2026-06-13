"use client";
/**
 * Client auth context. The actual tokens live in httpOnly cookies; this only
 * tracks the resolved user profile and exposes login/signup/logout actions
 * that drive the /api/auth/* and /api/be/auth/me endpoints.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "@/lib/api/client";
import { ApiError, messageFromBody } from "@/lib/api/errors";
import type { AuthUser, UserRole } from "@/lib/api/types";

/** Call a dedicated /api/auth/* handler (cookie-managing, NOT the /api/be proxy). */
async function authAction(path: string, body?: unknown): Promise<void> {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, messageFromBody(data, "Request failed."), undefined, data);
  }
}

interface SignupInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: Extract<UserRole, "user" | "seller">;
  craftCategory?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const me = await api.get<AuthUser>("/auth/me");
      setUser(me);
      return me;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        return null;
      }
      // Network/other error — keep prior state, don't crash the app.
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await refresh();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      // /api/auth/login sets the httpOnly cookies.
      await authAction("login", { email, password });
      const me = await refresh();
      if (!me) throw new ApiError(401, "Login succeeded but session could not be loaded.");
      return me;
    },
    [refresh],
  );

  const signup = useCallback(
    async (input: SignupInput): Promise<AuthUser> => {
      await authAction("signup", input);
      const me = await refresh();
      if (!me) throw new ApiError(401, "Signup succeeded but session could not be loaded.");
      return me;
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    try {
      await authAction("logout");
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
