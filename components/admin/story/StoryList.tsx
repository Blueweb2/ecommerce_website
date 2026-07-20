"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import { deleteStory } from "@/lib/api/admin/story.api";
import { deleteImage } from "@/lib/cloudinary/delete";
import type { Story } from "@/types/story";

export default function StoryList({
  stories,
  refresh,
}: {
  stories: Story[];
  refresh: () => Promise<void>;
}) {
  const handleDelete = async (story: Story) => {
    if (!confirm(`Delete story "${story.title}"?`)) return;

    try {
      // Delete hero image from Cloudinary
      const publicId = story.heroImage?.public_id ?? story.image?.public_id;
      if (publicId) {
        await deleteImage(publicId);
      }

      await deleteStory(story._id);
      toast.success("Story deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete story");
    }
  };

  if (stories.length === 0) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        No stories yet. Create your first story above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Stories</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stories.map((story) => {
          const heroUrl = story.heroImage?.url ?? story.image?.url;
          const heroAlt = story.heroImage?.alt ?? story.image?.alt ?? story.title;
          const sectionCount = story.sections?.length ?? 0;

          return (
            <div
              key={story._id}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                {heroUrl ? (
                  <img
                    src={heroUrl}
                    alt={heroAlt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
                      story.isActive
                        ? "bg-emerald-600/90 text-white"
                        : "bg-white/90 text-slate-600"
                    }`}
                  >
                    {story.isActive ? "Active" : "Hidden"}
                  </span>
                  {story.featured && (
                    <span className="rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-slate-900">
                    {story.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {story.excerpt && (
                  <p className="line-clamp-2 text-xs text-slate-500">{story.excerpt}</p>
                )}

                {story.author && (
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    By {story.author}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/stories/${story._id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleDelete(story)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
