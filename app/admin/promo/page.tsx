"use client";

import { useEffect } from "react";
import { usePromoStore } from "@/store/admin/usePromoStore";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function PromoListPage() {
  const { promos, loading, fetchPromos, deletePromo } = usePromoStore();

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      try {
        await deletePromo(id);
        toast.success("Promo code deleted");
      } catch (err) {
        toast.error("Failed to delete promo code");
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Promo Codes</h1>
        <Link
          href="/admin/promo/new"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700"
        >
          <Plus size={20} />
          Create New
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Min Order</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                  Loading promo codes...
                </td>
              </tr>
            ) : promos.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                  No promo codes found.
                </td>
              </tr>
            ) : (
              promos.map((promo) => (
                <tr key={promo._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{promo.code}</td>
                  <td className="px-6 py-4 capitalize">{promo.type}</td>
                  <td className="px-6 py-4">
                    {promo.type === "percentage" ? `${promo.value}%` : `₹${promo.value}`}
                  </td>
                  <td className="px-6 py-4">₹{promo.minOrderValue}</td>
                  <td className="px-6 py-4">
                    {new Date(promo.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        promo.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {promo.usedCount} / {promo.usageLimit === 0 ? "∞" : promo.usageLimit}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/promo/${promo._id}/edit`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(promo._id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
