import { Clock, Package, Truck, CheckCircle, XCircle, RotateCcw, CreditCard } from "lucide-react";
import type { OrderStatus } from "@/lib/api/types";

interface StatusMeta {
  label: string;
  color: string;
  bg: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending_payment: { label: "Payment pending", color: "text-amber-700", bg: "bg-amber-50", icon: CreditCard },
  payment_failed: { label: "Payment failed", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
  confirmed: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50", icon: Clock },
  processing: { label: "Processing", color: "text-blue-700", bg: "bg-blue-50", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-50", icon: Truck },
  out_for_delivery: { label: "Out for delivery", color: "text-purple-700", bg: "bg-purple-50", icon: Truck },
  delivered: { label: "Delivered", color: "text-[#006d3d]", bg: "bg-[#006d3d]/10", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
  return_requested: { label: "Return requested", color: "text-amber-700", bg: "bg-amber-50", icon: RotateCcw },
  return_approved: { label: "Return approved", color: "text-amber-700", bg: "bg-amber-50", icon: RotateCcw },
  returned: { label: "Returned", color: "text-[#534439]", bg: "bg-[#efeeea]", icon: RotateCcw },
  refunded: { label: "Refunded", color: "text-[#534439]", bg: "bg-[#efeeea]", icon: RotateCcw },
};

export function statusMeta(status: OrderStatus): StatusMeta {
  return ORDER_STATUS_META[status] ?? ORDER_STATUS_META.confirmed;
}

/** Order amount in paise (handles legacy field names defensively). */
export function orderTotalPaise(order: { totalPaise?: number }): number {
  return order.totalPaise ?? 0;
}

/**
 * Groups a flat order list by the checkout that created them (`orderGroupId`).
 * A cart spanning several vendors becomes one Order per vendor sharing an
 * `orderGroupId` — this collapses them back into one unit for display, while
 * preserving each group's first-seen position (the list is expected sorted
 * newest-first already). Orders without an `orderGroupId` (older/legacy data)
 * each form their own single-member group.
 */
export function groupOrdersByCheckout<T extends { _id: string; orderGroupId?: string }>(
  orders: T[],
): T[][] {
  const groups = new Map<string, T[]>();
  const order: string[] = [];
  for (const o of orders) {
    const key = o.orderGroupId ?? o._id;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(o);
  }
  return order.map((key) => groups.get(key)!);
}
