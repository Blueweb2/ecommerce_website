"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { createStory } from "@/lib/api/admin/story.api";
import ImageUpload from "@/components/admin/ui/ImageUpload";

export default function StoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "FASHION",
    image: null as any,
  });

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const img = await uploadSingleImage(file, "stories");
      setForm((prev) => ({ ...prev, image: img }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }
    if (!form.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      await createStory(form);
      toast.success("Story created!");
      onSuccess();
      setForm({ title: "", description: "", category: "FASHION", image: null });
    } catch {
      toast.error("Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <h2 className="text-xl font-semibold tracking-tight">Add New Story</h2>

      {/* TITLE */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Story title..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Story description..."
          rows={3}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a] resize-none"
        />
      </div>

      {/* CATEGORY */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="FASHION">Fashion</option>
          <option value="LIFESTYLE">Lifestyle</option>
          <option value="TRENDS">Trends</option>
          <option value="STYLE">Style</option>
          <option value="CULTURE">Culture</option>
        </select>
      </div>

      {/* IMAGE */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Story Image</label>
        <ImageUpload
          multiple={false}
          onFilesSelect={(files) => {
            if (files.length > 0) handleUpload(files[0]);
          }}
        />
        {form.image?.url && (
          <img
            src={form.image.url}
            alt="Preview"
            className="mt-3 h-40 w-full rounded-2xl object-cover"
          />
        )}
        {loading && (
          <p className="text-sm text-slate-500">Uploading...</p>
        )}
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-2xl bg-[#12251a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a3528] disabled:opacity-60"
      >
        {loading ? "Saving..." : "Publish Story"}
      </button>
    </div>
  );
}
