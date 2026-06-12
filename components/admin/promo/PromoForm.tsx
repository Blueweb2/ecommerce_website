"use client";

import { useState } from "react";
import { PromoPayload } from "@/store/admin/usePromoStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  initialData?: any;
  onSubmit: (data: PromoPayload) => Promise<void>;
  returnUrl?: string;
};

export default function PromoForm({ initialData, onSubmit, returnUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PromoPayload>({
    code: initialData?.code || "",
    type: initialData?.type || "percentage",
    value: initialData?.value || 0,
    minOrderValue: initialData?.minOrderValue || 0,
    maxDiscount: initialData?.maxDiscount || 0,
    expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : "",
    usageLimit: initialData?.usageLimit || 0,
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await onSubmit(form);
      toast.success(initialData ? "Promo code updated" : "Promo code created");
      router.push(returnUrl || "/admin/promo");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-6">
        {/* Code */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Promo Code</label>
          <input
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="e.g. SUMMER25"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 font-bold tracking-widest"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Discount Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {form.type === "percentage" ? "Discount Percentage" : "Discount Amount"}
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Min Order Value */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Min. Order Value (₹)</label>
            <input
              required
              type="number"
              min="0"
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            />
          </div>

          {/* Max Discount (only for percentage) */}
          {form.type === "percentage" && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Max. Discount (₹)</label>
              <input
                type="number"
                min="0"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />
              <p className="text-xs text-slate-400">Optional: 0 means no limit</p>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Expiry Date */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Expiry Date</label>
            <input
              required
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            />
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Usage Limit</label>
            <input
              required
              type="number"
              min="0"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            />
            <p className="text-xs text-slate-400">0 means unlimited usages</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-5 w-5 accent-emerald-600"
          />
          <label htmlFor="isActive" className="font-bold text-slate-700 uppercase tracking-wider">Is Active</label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push(returnUrl || "/admin/promo")}
          className="flex-1 rounded-2xl bg-slate-100 py-4 font-bold text-slate-600 transition hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : initialData ? "Update Promo Code" : "Create Promo Code"}
        </button>
      </div>
    </form>
  );
}
