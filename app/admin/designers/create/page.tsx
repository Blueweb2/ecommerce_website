"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DesignerForm from "@/components/admin/designers/DesignerForm";
import { useDesignerStore } from "@/store/admin/useDesignerStore";
import type { AdminCreateDesignerPayload } from "@/types/designer";

export default function CreateDesignerPage() {
  const router = useRouter();
  const { createDesigner } = useDesignerStore();

  const handleSubmit = async (data: AdminCreateDesignerPayload) => {
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
      <DesignerForm onSubmit={handleSubmit} />
    </div>
  );
}
