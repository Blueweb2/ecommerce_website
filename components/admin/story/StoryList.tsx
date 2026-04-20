"use client";

import toast from "react-hot-toast";
import { deleteStory } from "@/lib/api/admin/story.api";
import { deleteImage } from "@/lib/cloudinary/delete";
import { Trash2 } from "lucide-react";

type Story = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: {
    url: string;
    public_id: string;
    alt?: string;
  };
  isActive: boolean;
};

export default function StoryList({
  stories,
  refresh,
}: {
  stories: Story[];
  refresh: () => void;
}) {
  const handleDelete = async (story: Story) => {
    if (!confirm(`Delete story "${story.title}"?`)) return;

    try {
      // 1. Delete image from Cloudinary
      if (story.image?.public_id) {
        await deleteImage(story.image.public_id);
      }
      // 2. Delete from DB
      await deleteStory(story._id);
      toast.success("Story deleted");
      refresh();
    } catch {
      toast.error("Failed to delete story");
    }
  };

  if (stories.length === 0) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        No stories yet. Add your first story above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Published Stories</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stories.map((story) => (
          <div
            key={story._id}
            className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                src={story.image?.url}
                alt={story.image?.alt || story.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 backdrop-blur-sm">
                {story.category}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1">
                {story.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {story.description}
              </p>

              <button
                onClick={() => handleDelete(story)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
