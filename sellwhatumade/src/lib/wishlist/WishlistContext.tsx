"use client";
/**
 * Wishlist state shared across product cards, the product detail page, and
 * the /wishlist page. Backed by the buyer wishlist API. Only loads/mutates
 * when a buyer is signed in.
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
import { ApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/AuthContext";

interface WishlistContextValue {
  ids: Set<string>;
  loading: boolean;
  refresh: () => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_PATH = "/buyer/v1/wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const isBuyer = !!user && (user.role === "user" || user.role === "admin");
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isBuyer) {
      setIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const list = await api.get<string[]>(`${WISHLIST_PATH}/ids`);
      setIds(new Set(list));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isBuyer]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids]);

  const toggle = useCallback(
    async (productId: string) => {
      const wasWishlisted = ids.has(productId);
      setIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.delete(productId);
        else next.add(productId);
        return next;
      });
      try {
        if (wasWishlisted) await api.delete(`${WISHLIST_PATH}/${productId}`);
        else await api.post(`${WISHLIST_PATH}/${productId}`);
      } catch (err) {
        // Roll back the optimistic update on failure.
        setIds((prev) => {
          const next = new Set(prev);
          if (wasWishlisted) next.add(productId);
          else next.delete(productId);
          return next;
        });
        throw err;
      }
    },
    [ids],
  );

  return (
    <WishlistContext.Provider value={{ ids, loading, refresh, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within <WishlistProvider>");
  return ctx;
}
