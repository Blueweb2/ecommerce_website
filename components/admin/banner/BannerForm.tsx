"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { deleteImage } from "@/lib/cloudinary/delete";
import { createBanner } from "@/lib/api/admin/banner.api";
import ImageUpload from "@/components/admin/ui/ImageUpload";

export default function BannerForm({ onSuccess }: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    image: null as any,
    link: "",
    position: "hero",
  });

  //  Upload handler (same as category)
  const handleUpload = async (file: File) => {
    try {
      setLoading(true);

      const oldImage = form.image;

      //  Upload to Cloudinary
      const img = await uploadSingleImage(file, "ecommerce/banners");

      //  Delete old image (important)
      if (oldImage?.public_id) {
        await deleteImage(oldImage.public_id);
      }

      setForm((prev) => ({
        ...prev,
        image: img,
      }));

    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  //  Submit
  const handleSubmit = async () => {
    if (!form.image) {
      toast.error("Image is required");
      return;
    }

    try {
      setLoading(true);

      await createBanner({
        image: form.image,
        link: form.link,
        position: form.position,
      });

      toast.success("Banner created");

      onSuccess();

      setForm({
        image: null,
        link: "",
        position: "hero",
      });

    } catch (error) {
      toast.error("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="font-semibold text-lg">Add Banner</h2>

      {/* IMAGE UPLOAD */}
      <div>
        <label className="text-sm text-gray-600">Banner Image</label>

        <ImageUpload
          multiple={false}
          onFilesSelect={(files) => {
            if (files.length > 0) {
              handleUpload(files[0]);
            }
          }}
        />

        {/* PREVIEW */}
        {form.image?.url && (
          <img
            src={form.image.url}
            className="mt-3 w-full h-40 object-cover rounded"
          />
        )}

        {loading && (
          <p className="text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      {/* LINK */}
      <input
        placeholder="Redirect link (optional)"
        value={form.link}
        onChange={(e) =>
          setForm({ ...form, link: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      {/* POSITION */}
      <select
        value={form.position}
        onChange={(e) =>
          setForm({ ...form, position: e.target.value })
        }
        className="w-full border p-2 rounded"
      >
        <option value="hero">Hero</option>
        <option value="center">Center</option>
        <option value="rightTop">Right Top</option>
        <option value="rightBottom">Right Bottom</option>
      </select>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Add Banner"}
      </button>
    </div>
  );
}