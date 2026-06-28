"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronRight, ChevronLeft, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api/client";
import { formatPaise } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/mappers";
import type { Order } from "@/lib/api/types";

const RETURN_WINDOW_DAYS = 3;

const REASONS = [
  "Item damaged during transit",
  "Quality not as expected",
  "Received wrong item",
  "Sizing / Fit issue",
  "Changed my mind",
  "Other",
];

function ReturnsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.replace("/orders");
      return;
    }
    api
      .get<Order>(`/buyer/v1/orders/${orderId}`)
      .then(setOrder)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  const toggleItem = (idx: number) =>
    setSelectedItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );

  const returnWindowExpired = (() => {
    if (!order?.deliveredAt) return false;
    const ms = Date.now() - new Date(order.deliveredAt).getTime();
    return ms / (1000 * 60 * 60 * 24) > RETURN_WINDOW_DAYS;
  })();

  const submit = async () => {
    if (!orderId || !reason) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const itemNames = selectedItems.map((i) => order!.items[i]!.name).join(", ");
      const fullReason = itemNames ? `${reason} — Items: ${itemNames}` : reason;
      await api.post(`/buyer/v1/orders/${orderId}/return`, { reason: fullReason });
      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to submit return request");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-[#857467]" size={32} />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <AlertTriangle size={40} className="text-[#d8c3b4] mb-4" />
          <h1 className="text-xl font-bold text-[#1b1c1a] mb-2">{error ?? "Order not found"}</h1>
          <Link
            href="/orders"
            className="mt-4 px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl"
          >
            Back to Orders
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (order.status !== "delivered") {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <AlertTriangle size={40} className="text-[#d8c3b4] mb-4" />
          <h1 className="text-xl font-bold text-[#1b1c1a] mb-2">Not eligible for return</h1>
          <p className="text-sm text-[#857467] mb-6">Only delivered orders can be returned.</p>
          <Link
            href={`/orders/${order._id}`}
            className="px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl"
          >
            View Order
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (returnWindowExpired) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
          <AlertTriangle size={40} className="text-[#d8c3b4] mb-4" />
          <h1 className="text-xl font-bold text-[#1b1c1a] mb-2">Return window has expired</h1>
          <p className="text-sm text-[#857467] mb-6">
            Returns must be requested within {RETURN_WINDOW_DAYS} days of delivery.
          </p>
          <Link href="/orders" className="px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl">
            View Orders
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-[#fbf9f5] flex items-center justify-center py-20 px-6">
          <div className="bg-white rounded-3xl shadow-artisan p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#006d3d]/10 flex items-center justify-center mx-auto mb-5">
              <Check size={30} className="text-[#006d3d]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1b1c1a] mb-2">Return Request Submitted</h2>
            <p className="text-[#534439] leading-relaxed mb-3">
              Your return request for Order <strong>#{order.orderNumber}</strong> has been submitted.
            </p>
            <p className="text-sm text-[#857467] mb-6">
              Our courier partner will collect the items within 48 hours. Refund processed within
              3–5 business days after quality check.
            </p>
            <div className="flex gap-3">
              <Link
                href="/orders"
                className="flex-1 py-3 bg-[#8d4f11] text-white text-sm font-bold rounded-2xl hover:bg-[#6e3900] transition-colors text-center"
              >
                Track Return
              </Link>
              <Link
                href="/orders"
                className="flex-1 py-3 border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-2xl hover:border-[#f4a460] transition-colors text-center"
              >
                View Orders
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const refundTotal = selectedItems.reduce(
    (sum, i) => sum + (order.items[i]?.totalPricePaise ?? 0),
    0,
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5]">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <Link
            href={`/orders/${order._id}`}
            className="inline-flex items-center gap-2 text-sm text-[#857467] hover:text-[#534439] mb-6"
          >
            <ArrowLeft size={15} />
            Back to Order
          </Link>

          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-1">Return Request</h1>
          <p className="text-sm text-[#857467] mb-1">Order #{order.orderNumber}</p>
          <p className="text-xs text-[#8d4f11] mb-8">
            Returns must be requested within {RETURN_WINDOW_DAYS} days of delivery
          </p>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-8">
            {["Select Items", "Reason", "Review"].map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      i < step
                        ? "bg-[#006d3d] border-[#006d3d] text-white"
                        : i === step
                        ? "border-[#8d4f11] text-[#8d4f11]"
                        : "border-[#d8c3b4] text-[#d8c3b4]"
                    }`}
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      i === step ? "text-[#8d4f11] font-semibold" : "text-[#857467]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 -mt-5 ${
                      i < step ? "bg-[#006d3d]" : "bg-[#e4e2de]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-white rounded-2xl shadow-artisan p-6 mb-5">
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-[#1b1c1a]">
                  Which items do you want to return?
                </h2>
                {order.items.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedItems.includes(idx)
                        ? "border-[#8d4f11] bg-[#8d4f11]/5"
                        : "border-[#e4e2de] hover:border-[#f4a460]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(idx)}
                      onChange={() => toggleItem(idx)}
                      className="accent-[#8d4f11] w-4 h-4"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || PLACEHOLDER_IMAGE}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1b1c1a] line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#857467] mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#1b1c1a] shrink-0">
                      {formatPaise(item.totalPricePaise)}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-semibold text-[#1b1c1a]">Why are you returning?</h2>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#534439]">Reason for return</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fbf9f5] border border-[#d8c3b4] rounded-xl text-sm focus:outline-none focus:border-[#f4a460]"
                  >
                    <option value="">Select a reason</option>
                    {REASONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-[#006d3d]/10 border border-[#006d3d]/20 rounded-xl p-4 text-xs text-[#006d3d] leading-relaxed">
                  Once approved, our courier partner will collect the items within 48 hours.
                  Refunds are processed within 3–5 business days after quality check.
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-[#1b1c1a]">Review your return request</h2>
                <div className="flex flex-col gap-3 text-sm">
                  {[
                    { label: "Order", value: `#${order.orderNumber}` },
                    {
                      label: "Items to return",
                      value: `${selectedItems.length} item(s)`,
                    },
                    { label: "Reason", value: reason },
                    { label: "Est. refund amount", value: formatPaise(refundTotal) },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between border-b border-[#f0ede9] pb-2.5"
                    >
                      <span className="text-[#857467]">{label}</span>
                      <span className="font-semibold text-[#1b1c1a]">{value}</span>
                    </div>
                  ))}
                </div>
                {submitError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}
                <label className="flex items-start gap-3 cursor-pointer mt-1">
                  <input type="checkbox" required className="accent-[#8d4f11] mt-0.5" />
                  <span className="text-xs text-[#534439] leading-relaxed">
                    I confirm that the items are in the stated condition and I understand the
                    return policy.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-[#d8c3b4] text-[#534439] text-sm font-semibold rounded-2xl hover:border-[#f4a460] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
              Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={
                  (step === 0 && selectedItems.length === 0) || (step === 1 && !reason)
                }
                className="btn-press flex items-center gap-2 px-5 py-3 bg-[#8d4f11] hover:bg-[#6e3900] disabled:opacity-40 text-white text-sm font-semibold rounded-2xl transition-colors"
              >
                Continue
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="btn-press flex items-center gap-2 px-5 py-3 bg-[#006d3d] hover:bg-[#005a30] text-white text-sm font-semibold rounded-2xl transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                Submit Return Request
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ReturnsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="flex-1 flex items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#857467]" size={32} />
          </main>
          <Footer />
        </>
      }
    >
      <ReturnsContent />
    </Suspense>
  );
}
