"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CollectionForm from "@/components/admin/collections/CollectionForm";
import { getCollectionById } from "@/lib/api/admin/collection.api";
import { useCollectionStore } from "@/store/admin/useCollectionStore";
import { Collection, CollectionPayload } from "@/types/collection";

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const { updateCollection } = useCollectionStore();

  const id = params?.id as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  //  LOAD COLLECTION
  useEffect(() => {
    if (!id) return;

    const loadCollection = async () => {
      try {
        setLoading(true);

        const data = await getCollectionById(id);

        if (!data) {
          toast.error("Collection not found");
          router.push("/admin/collections");
          return;
        }

        //  normalize category for form (important)
        const normalized = {
          ...data,
          category:
            typeof data.category === "string"
              ? data.category
              : data.category?._id,
        };

        setCollection(normalized);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load collection");
        router.push("/admin/collections");
      } finally {
        setLoading(false);
      }
    };

    void loadCollection();
  }, [id, router]);

  //  SUBMIT
  const handleSubmit = async (data: CollectionPayload) => {
    try {
      await updateCollection(id, data);

      toast.success("Collection updated successfully");

      router.push("/admin/collections");
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update collection"
      );
    }
  };

  // 🔹 LOADING
  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading collection...
      </div>
    );
  }

  // 🔹 NOT FOUND
  if (!collection) {
    return (
      <div className="p-6 text-sm text-red-500">
        Collection not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Edit Collection
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update collection details such as category, image, CTA, and priority.
        </p>
      </div>

      {/* FORM */}
      <CollectionForm
        initialData={collection}
        onSubmit={handleSubmit}
      />
    </div>
  );
}