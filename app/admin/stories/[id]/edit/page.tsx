"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StoryForm from "@/components/admin/story/StoryForm";
import { getStoryById } from "@/lib/api/admin/story.api";
import type { Story } from "@/types/story";

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadStory = async () => {
      try {
        setLoading(true);

        const data = await getStoryById(id);

        if (!data) {
          toast.error("Story not found");
          router.push("/admin/stories");
          return;
        }

        setStory(data);
      } catch {
        toast.error("Failed to load story");
        router.push("/admin/stories");
      } finally {
        setLoading(false);
      }
    };

    void loadStory();
  }, [id, router]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading story...</div>;
  }

  if (!story) {
    return <div className="p-6 text-sm text-rose-500">Story not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Edit Story
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update story content, category, image, and storefront visibility.
        </p>
      </div>

      <StoryForm
        initialData={story}
        returnUrl="/admin/stories"
      />
    </div>
  );
}
