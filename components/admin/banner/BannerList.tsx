"use client";

import toast from "react-hot-toast";
import { deleteBanner } from "@/lib/api/admin/banner.api";
import { deleteImage } from "@/lib/cloudinary/delete";

export default function BannerList({ banners, refresh }: any) {

  // 🔥 Flatten grouped banners
  const allBanners = [
    ...(banners.hero || []),
    ...(banners.center ? [banners.center] : []),
    ...(banners.rightTop ? [banners.rightTop] : []),
    ...(banners.rightBottom ? [banners.rightBottom] : []),
  ];

  const handleDelete = async (banner: any) => {
    const confirmDelete = confirm("Delete this banner?");
    if (!confirmDelete) return;

    try {
      // ✅ 1. Delete image from Cloudinary
      if (banner.image?.public_id) {
        await deleteImage(banner.image.public_id);
      }

      // ✅ 2. Delete from DB
      await deleteBanner(banner._id);

      toast.success("Banner deleted");
      refresh();

    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (allBanners.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No banners found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {allBanners.map((banner) => (
        <div
          key={banner._id}
          className="border rounded-lg overflow-hidden bg-white shadow-sm"
        >
          {/* IMAGE */}
          <img
            src={banner.image?.url}
            className="h-32 w-full object-cover"
          />

          {/* DETAILS */}
          <div className="p-3 space-y-1">
            <p className="text-xs text-gray-500 uppercase">
              {banner.position}
            </p>

            {banner.link && (
              <p className="text-xs text-blue-500 truncate">
                {banner.link}
              </p>
            )}

            {/* DELETE */}
            <button
              onClick={() => handleDelete(banner)}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}