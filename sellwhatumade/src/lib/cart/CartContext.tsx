"use client";
/**
 * Cart state shared across the Navbar, product pages, cart, and checkout.
 * Backed by the buyer cart API. Only loads/mutates when a buyer is signed in.
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
import type { Cart } from "@/lib/api/types";

interface AddItemInput {
  productId: string;
  quantity: number;
  variantSku?: string;
}

interface CartContextValue {
  cart: Cart | null;
  count: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (input: AddItemInput) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  redeemCoins: (coins: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_PATH = "/buyer/v1/cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const isBuyer = !!user && (user.role === "user" || user.role === "admin");
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isBuyer) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<Cart>(CART_PATH);
      setCart(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isBuyer]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  // All mutations refetch to pick up the recomputed summary.
  const addItem = useCallback(
    async (input: AddItemInput) => {
      await api.post(`${CART_PATH}/items`, input);
      await refresh();
    },
    [refresh],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      await api.put(`${CART_PATH}/items/${productId}`, { quantity });
      await refresh();
    },
    [refresh],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      await api.delete(`${CART_PATH}/items/${productId}`);
      await refresh();
    },
    [refresh],
  );

  const clear = useCallback(async () => {
    await api.delete(CART_PATH);
    await refresh();
  }, [refresh]);

  const applyCoupon = useCallback(
    async (couponCode: string) => {
      await api.post(`${CART_PATH}/coupon`, { couponCode });
      await refresh();
    },
    [refresh],
  );

  const removeCoupon = useCallback(async () => {
    await api.delete(`${CART_PATH}/coupon`);
    await refresh();
  }, [refresh]);

  const redeemCoins = useCallback(
    async (coins: number) => {
      await api.post(`${CART_PATH}/redeem-coins`, { coins });
      await refresh();
    },
    [refresh],
  );

  const count = cart?.summary?.itemCount ?? cart?.items?.length ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        loading,
        refresh,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        applyCoupon,
        removeCoupon,
        redeemCoins,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
