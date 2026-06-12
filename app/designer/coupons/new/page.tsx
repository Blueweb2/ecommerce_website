"use client";

import PromoForm from "@/components/admin/promo/PromoForm";
import { createMyCoupon } from "@/lib/api/designer/designer-portal.api";
import { PromoPayload } from "@/store/admin/usePromoStore";

export default function CreateCouponPage() {
  const handleCreate = async (data: PromoPayload) => {
    await createMyCoupon(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create Coupon</h1>
        <p className="mt-2 text-sm text-slate-500">Add a new promotional code for your customers.</p>
      </div>
      <PromoForm onSubmit={handleCreate} returnUrl="/designer/coupons" />
    </div>
  );
}
