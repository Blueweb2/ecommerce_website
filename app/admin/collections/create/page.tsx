"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CollectionForm from "@/components/admin/collections/CollectionForm";
import { useCollectionStore } from "@/store/admin/useCollectionStore";
import { CollectionPayload } from "@/types/collection";

export default function CreateCollectionPage() {
  const router = useRouter();
  const { createCollection } = useCollectionStore();

  const handleSubmit = async (data: CollectionPayload) => {
    try {
      await createCollection(data);
      toast.success("Collection created successfully");
      router.push("/admin/collections");
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create collection"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create Collection
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Build a new collection, attach the banner, and define the filters the
          backend should use to populate it.
        </p>
      </div>

      <CollectionForm onSubmit={handleSubmit} />
    </div>
  );
}
