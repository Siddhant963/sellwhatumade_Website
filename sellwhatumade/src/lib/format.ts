/** Display helpers. All money in the backend is integer paise. */

/** Format integer paise as an Indian Rupee string, e.g. 345000 -> "₹3,450". */
export function formatPaise(paise: number | undefined | null, opts?: { decimals?: boolean }): string {
  const value = (paise ?? 0) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(value);
}

/** Convert a rupee amount (number or numeric string) to integer paise. */
export function toPaise(rupees: number | string): number {
  const n = typeof rupees === "string" ? parseFloat(rupees) : rupees;
  return Math.round((Number.isFinite(n) ? n : 0) * 100);
}

/** Discount percentage from MRP and selling price (both in paise). */
export function discountPercent(mrpPaise: number, pricePaise: number): number {
  if (!mrpPaise || mrpPaise <= pricePaise) return 0;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}

/** Relative-ish date label for lists. */
export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
