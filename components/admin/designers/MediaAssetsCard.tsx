"use client";

import ImageUpload from "@/components/admin/ui/ImageUpload";
import Image from "next/image";
import type { DesignerImage } from "@/types/designer";

type ImageField = "avatar" | "brandImage" | "bannerImage";

type MediaAssetsCardProps = {
  form: {
    avatar?: DesignerImage;
    brandImage?: DesignerImage;
    bannerImage?: DesignerImage;
  };
  onImageUpload: (field: ImageField, file: File) => Promise<void>;
};

const IMAGE_HELPERS = {
  avatar: {
    title: "Designer Avatar",
    description:
      "Used for profile cards, designer listings, and admin previews.",
    aspect: "aspect-square",
  },

  brandImage: {
    title: "Brand Logo",
    description:
      "Represents the brand identity across products and collections.",
    aspect: "aspect-[4/3]",
  },

  bannerImage: {
    title: "Banner Image",
    description:
      "Large hero image displayed on designer and brand pages.",
    aspect: "aspect-[16/7]",
  },
};

function PreviewFrame({
  image,
  title,
  aspect,
}: {
  image?: DesignerImage;
  title: string;
  aspect: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${aspect}`}
    >
      {image?.url ? (
        <Image
          src={image.url}
          alt={title}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full min-h-[180px] items-center justify-center text-sm text-slate-400">
          No image uploaded
        </div>
      )}
    </div>
  );
}

export default function MediaAssetsCard({
  form,
  onImageUpload,
}: MediaAssetsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Media Assets
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload professional visuals that represent the designer and brand
          throughout the storefront.
        </p>
      </div>

      <div className="space-y-8">
        {/* Avatar */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">
              {IMAGE_HELPERS.avatar.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {IMAGE_HELPERS.avatar.description}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <PreviewFrame
              image={form.avatar}
              title="Designer Avatar"
              aspect={IMAGE_HELPERS.avatar.aspect}
            />

            <ImageUpload
              multiple={false}
              onFilesSelect={(files) => {
                if (files[0]) {
                  void onImageUpload("avatar", files[0]);
                }
              }}
            />
          </div>
        </div>

        {/* Brand Logo */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">
              {IMAGE_HELPERS.brandImage.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {IMAGE_HELPERS.brandImage.description}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <PreviewFrame
              image={form.brandImage}
              title="Brand Logo"
              aspect={IMAGE_HELPERS.brandImage.aspect}
            />

            <ImageUpload
              multiple={false}
              onFilesSelect={(files) => {
                if (files[0]) {
                  void onImageUpload("brandImage", files[0]);
                }
              }}
            />
          </div>
        </div>

        {/* Banner */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">
              {IMAGE_HELPERS.bannerImage.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {IMAGE_HELPERS.bannerImage.description}
            </p>
          </div>

          <PreviewFrame
            image={form.bannerImage}
            title="Banner Image"
            aspect={IMAGE_HELPERS.bannerImage.aspect}
          />

          <div className="mt-4">
            <ImageUpload
              multiple={false}
              onFilesSelect={(files) => {
                if (files[0]) {
                  void onImageUpload("bannerImage", files[0]);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <h4 className="mb-1 text-sm font-medium text-blue-900">
          Image Guidelines
        </h4>

        <ul className="space-y-1 text-xs text-blue-700">
          <li>• Avatar: Square image, minimum 500×500px.</li>
          <li>• Brand Logo: Transparent PNG preferred.</li>
          <li>• Banner: Recommended 1600×700px or larger.</li>
          <li>• Use high-quality visuals with consistent branding.</li>
        </ul>
      </div>
    </div>
  );
}