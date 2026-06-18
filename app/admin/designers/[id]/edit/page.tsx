"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getDesignerById } from "@/lib/api/admin/designer.api";
import { useDesignerStore } from "@/store/admin/useDesignerStore";
import type { Designer, DesignerPayload } from "@/types/designer";

export default function EditDesignerPage() {
  const params = useParams();
  const router = useRouter();
  const { updateDesigner } = useDesignerStore();
  const id = params?.id as string;

  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadDesigner = async () => {
      try {
        setLoading(true);

        const data = await getDesignerById(id);

        if (!data) {
          toast.error("Designer not found");
          router.push("/admin/designers");
          return;
        }

        setDesigner(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load designer");
        router.push("/admin/designers");
      } finally {
        setLoading(false);
      }
    };

    void loadDesigner();
  }, [id, router]);

  const handleSubmit = async (data: DesignerPayload) => {
    try {
      await updateDesigner(id, data);
      toast.success("Designer updated successfully");
      router.push("/admin/designers");
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update designer"
      );
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading designer...</div>;
  }

  if (!designer) {
    return <div className="p-6 text-sm text-rose-500">Designer not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Edit Designer
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update designer copy, imagery, and storefront favorite visibility.
        </p>
      </div>

      {/* TODO: Implement Admin Designer View/Approve Page */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">
          Admin profile view and approval controls coming soon.
          Designers now manage their own profile details.
        </p>
      </div>
    </div>
  );
}
