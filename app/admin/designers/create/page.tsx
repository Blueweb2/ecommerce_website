"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DesignerForm from "@/components/admin/designers/DesignerForm";
import { useDesignerStore } from "@/store/admin/useDesignerStore";
import type { DesignerPayload } from "@/types/designer";

export default function CreateDesignerPage() {
  const router = useRouter();
  const { createDesigner } = useDesignerStore();

  const handleSubmit = async (data: DesignerPayload) => {
    try {
      await createDesigner(data);
      toast.success("Designer created successfully");
      router.push("/admin/designers");
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create designer"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create Designer
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add a designer profile with their brand visuals and control whether they appear in the storefront favorites section.
        </p>
      </div>

      <DesignerForm onSubmit={handleSubmit} />
    </div>
  );
}
