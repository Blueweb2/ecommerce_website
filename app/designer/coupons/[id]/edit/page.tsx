"use client";

import { useEffect, useState } from "react";
import PromoForm from "@/components/admin/promo/PromoForm";
import { getMyCoupons, updateMyCoupon } from "@/lib/api/designer/designer-portal.api";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditCouponPage() {
  const { id } = useParams();
  const [coupon, setCoupon] = useState<any>(null);

  useEffect(() => {
    loadCoupon();
  }, [id]);

  const loadCoupon = async () => {
    try {
      const coupons = await getMyCoupons();
      const found = coupons.find((c: any) => c._id === id);
      if (found) {
        setCoupon(found);
      } else {
        toast.error("Coupon not found");
      }
    } catch {
      toast.error("Failed to load coupon");
    }
  };

  const handleUpdate = async (data: any) => {
    await updateMyCoupon(id as string, data);
  };

  if (!coupon) {
    return <div className="p-10 text-center text-slate-500 font-medium flex justify-center">Loading coupon...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Edit Coupon</h1>
        <p className="mt-2 text-sm text-slate-500">Update your promotional code settings.</p>
      </div>
      <PromoForm
        initialData={coupon}
        onSubmit={handleUpdate}
        returnUrl="/designer/coupons"
      />
    </div>
  );
}
