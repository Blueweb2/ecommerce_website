"use client";

import PromoForm from "@/components/admin/promo/PromoForm";
import { usePromoStore } from "@/store/admin/usePromoStore";

export default function CreatePromoPage() {
  const { createPromo } = usePromoStore();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Create Promo Code</h1>
      <PromoForm onSubmit={createPromo} />
    </div>
  );
}
