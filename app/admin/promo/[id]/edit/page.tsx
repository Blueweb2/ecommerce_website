"use client";

import { useEffect, useState } from "react";
import PromoForm from "@/components/admin/promo/PromoForm";
import { usePromoStore } from "@/store/admin/usePromoStore";
import { useParams } from "next/navigation";

export default function EditPromoPage() {
  const { id } = useParams();
  const { promos, fetchPromos, updatePromo } = usePromoStore();
  const [promo, setPromo] = useState<any>(null);

  useEffect(() => {
    if (promos.length === 0) {
      fetchPromos();
    } else {
      const found = promos.find((p) => p._id === id);
      setPromo(found);
    }
  }, [id, promos, fetchPromos]);

  if (!promo) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Promo Code</h1>
      <PromoForm
        initialData={promo}
        onSubmit={(data) => updatePromo(id as string, data)}
      />
    </div>
  );
}
