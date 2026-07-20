"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, BookOpen } from "lucide-react";
import { getStories } from "@/lib/api/admin/story.api";
import StoryForm from "@/components/admin/story/StoryForm";
import StoryList from "@/components/admin/story/StoryList";
import toast from "react-hot-toast";
import type { Story } from "@/types/story";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStories();
      setStories(response.data.data);
    } catch {
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStories();
  }, [fetchStories]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] bg-[#12251a] p-6 text-white shadow-xl">
          <div className="h-4 w-28 animate-pulse rounded-full bg-white/15" />
          <div className="mt-4 h-8 w-56 animate-pulse rounded-full bg-white/20" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-[24px] bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      {/* HEADER */}
      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-8 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
              <BookOpen className="h-3.5 w-3.5" />
              Content management
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Top Stories
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/80 md:text-base">
              Add, manage, and remove featured stories displayed on the home
              page.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStories}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      {/* STATS */}
      <div className="flex gap-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm min-w-[140px]">
          <p className="text-sm font-medium text-slate-500">Total Stories</p>
          <p className="mt-3 text-3xl font-semibold">{stories.length}</p>
        </div>
      </div>

      {/* FORM */}
      <StoryForm onSuccess={fetchStories} />

      {/* LIST */}
      <StoryList stories={stories} refresh={fetchStories} />
    </div>
  );
}
