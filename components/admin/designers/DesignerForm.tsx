"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { deleteImage } from "@/lib/cloudinary/delete";
import type { Designer, DesignerImage, DesignerPayload } from "@/types/designer";
import BrandInformationCard from "./BrandInformationCard";
import BusinessInformationCard from "./BusinessInformationCard";
import CategoryAssignmentCard from "./CategoryAssignmentCard";
import BusinessAddressCard from "./BusinessAddressCard";
import MediaAssetsCard from "./MediaAssetsCard";
import SocialLinksCard from "./SocialLinksCard";
import BrandSummaryCard from "./BrandSummaryCard";
import StorefrontSettingsCard from "./StorefrontSettingsCard";
import GuidelinesCard from "./GuidelinesCard";
import { useCategoryStore } from "@/store/admin/useCategoryStore";

type Props = {
  initialData?: Designer | null;
  onSubmit: (data: DesignerPayload) => Promise<void>;
};

type ImageField = "avatar" | "brandImage" | "bannerImage";
const DESIGNER_UPLOAD_FOLDER = "ecommerce/designers";

const IMAGE_HELPERS: Record<ImageField, { title: string; folder: string; aspect: string }> = {
  avatar: {
    title: "Designer Avatar",
    folder: DESIGNER_UPLOAD_FOLDER,
    aspect: "aspect-square",
  },
  brandImage: {
    title: "Brand Image",
    folder: DESIGNER_UPLOAD_FOLDER,
    aspect: "aspect-[4/3]",
  },
  bannerImage: {
    title: "Banner Image",
    folder: DESIGNER_UPLOAD_FOLDER,
    aspect: "aspect-[16/7]",
  },
};

function PreviewFrame({
  image,
  title,
  aspect,
}: {
  image?: DesignerImage | null;
  title: string;
  aspect: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${aspect}`}>
      {image?.url ? (
        <Image
          src={image.url}
          alt={`${title} preview`}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
          No image uploaded
        </div>
      )}
    </div>
  );
}

export default function DesignerForm({ initialData, onSubmit }: Props) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<DesignerPayload>({
    name: "",
    brandName: "",
    description: "",

    businessName: "",
    email: "",
    phone: "",
    gstNumber: "",
    website: "",

    categories: [],

    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      state: "",
      country: "India",
      pincode: "",
    },

    socialLinks: {
      instagram: "",
      facebook: "",
      youtube: "",
      pinterest: "",
      twitter: "",
    },

    avatar: undefined,
    brandImage: undefined,
    bannerImage: undefined,

    isFavorite: false,
    isFeatured: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setForm({
      name: initialData.name || "",
      brandName: initialData.brandName || "",
      description: initialData.description || "",

      businessName: initialData.businessName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      gstNumber: initialData.gstNumber || "",
      website: initialData.website || "",

      categories: initialData.categories || [],

      address: {
        addressLine1: initialData.address?.addressLine1 || "",
        addressLine2: initialData.address?.addressLine2 || "",
        city: initialData.address?.city || "",
        district: initialData.address?.district || "",
        state: initialData.address?.state || "",
        country: initialData.address?.country || "India",
        pincode: initialData.address?.pincode || "",
      },

      socialLinks: {
        instagram: initialData.socialLinks?.instagram || "",
        facebook: initialData.socialLinks?.facebook || "",
        youtube: initialData.socialLinks?.youtube || "",
        pinterest: initialData.socialLinks?.pinterest || "",
        twitter: initialData.socialLinks?.twitter || "",
      },

      avatar: initialData.avatar || undefined,
      brandImage: initialData.brandImage || undefined,
      bannerImage: initialData.bannerImage || undefined,

      isFavorite: initialData.isFavorite ?? false,
      isFeatured: initialData.isFeatured ?? false,
      isActive: initialData.isActive ?? true,
    });
  }, [initialData]);

  const handleImageUpload = async (field: ImageField, file: File) => {
    try {
      setLoading(true);

      const previous = form[field];
      const uploaded = await uploadSingleImage(file, IMAGE_HELPERS[field].folder);

      if (previous?.public_id) {
        await deleteImage(previous.public_id);
      }

      setForm((prev) => ({
        ...prev,
        [field]: uploaded,
      }));
    } catch {
      toast.error(`${IMAGE_HELPERS[field].title} upload failed`);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Designer name is required");
      return false;
    }

    if (!form.brandName.trim()) {
      toast.error("Brand name is required");
      return false;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!form.categories?.length) {
      toast.error("Please assign at least one category");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading || !validate()) {
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        ...form,
        name: form.name.trim(),
        brandName: form.brandName.trim(),
        description: form.description.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <form onSubmit={handleSubmit} className="space-y-6 pb-20">
  //     <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
  //       <div className="flex-1 space-y-6">
  //         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  //           <h2 className="mb-5 text-lg font-semibold text-slate-800">
  //             Designer Details
  //           </h2>

  //           <div className="space-y-5">
  //             <div>
  //               <label className="mb-1.5 block text-sm font-medium text-slate-700">
  //                 Designer Name
  //               </label>
  //               <input
  //                 type="text"
  //                 placeholder="e.g. Aanya Mehra"
  //                 value={form.name}
  //                 onChange={(event) =>
  //                   setForm((prev) => ({ ...prev, name: event.target.value }))
  //                 }
  //                 className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
  //               />
  //             </div>

  //             <div>
  //               <label className="mb-1.5 block text-sm font-medium text-slate-700">
  //                 Brand Name
  //               </label>
  //               <input
  //                 type="text"
  //                 placeholder="e.g. Studio Mehra"
  //                 value={form.brandName}
  //                 onChange={(event) =>
  //                   setForm((prev) => ({
  //                     ...prev,
  //                     brandName: event.target.value,
  //                   }))
  //                 }
  //                 className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
  //               />
  //             </div>

  //             <div>
  //               <label className="mb-1.5 block text-sm font-medium text-slate-700">
  //                 Description
  //               </label>
  //               <textarea
  //                 rows={6}
  //                 placeholder="Write a short profile about the designer, the brand story, and what makes them special."
  //                 value={form.description}
  //                 onChange={(event) =>
  //                   setForm((prev) => ({
  //                     ...prev,
  //                     description: event.target.value,
  //                   }))
  //                 }
  //                 className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  //           <h2 className="mb-5 text-lg font-semibold text-slate-800">
  //             Media Assets
  //           </h2>

  //           <div className="grid gap-6 lg:grid-cols-2">
  //             {(Object.keys(IMAGE_HELPERS) as ImageField[]).map((field) => (
  //               <div
  //                 key={field}
  //                 className={field === "bannerImage" ? "lg:col-span-2 space-y-4" : "space-y-4"}
  //               >
  //                 <div>
  //                   <h3 className="text-sm font-medium text-slate-700">
  //                     {IMAGE_HELPERS[field].title}
  //                   </h3>
  //                   <p className="mt-1 text-xs text-slate-500">
  //                     Upload a polished visual for the storefront and admin previews.
  //                   </p>
  //                 </div>

  //                 <ImageUpload
  //                   multiple={false}
  //                   onFilesSelect={(files) => {
  //                     if (files[0]) {
  //                       void handleImageUpload(field, files[0]);
  //                     }
  //                   }}
  //                 />

  //                 <PreviewFrame
  //                   image={form[field]}
  //                   title={IMAGE_HELPERS[field].title}
  //                   aspect={IMAGE_HELPERS[field].aspect}
  //                 />
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </div>

  //       <div className="w-full space-y-6 xl:w-[360px]">
  //         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  //           <h2 className="text-base font-semibold text-slate-800">
  //             Visibility
  //           </h2>

  //           <div className="mt-5 space-y-5">
  //             <div className="flex items-center justify-between gap-4">
  //               <div>
  //                 <p className="text-sm font-medium text-slate-700">
  //                   Favorite on User Side
  //                 </p>
  //                 <p className="text-xs text-slate-500">
  //                   Show this designer in the storefront favorites section.
  //                 </p>
  //               </div>

  //               <label className="relative inline-flex cursor-pointer items-center">
  //                 <input
  //                   type="checkbox"
  //                   className="peer sr-only"
  //                   checked={form.isFavorite}
  //                   onChange={(event) =>
  //                     setForm((prev) => ({
  //                       ...prev,
  //                       isFavorite: event.target.checked,
  //                     }))
  //                   }
  //                 />
  //                 <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300"></div>
  //               </label>
  //             </div>

  //             <div className="flex items-center justify-between gap-4">
  //               <div>
  //                 <p className="text-sm font-medium text-slate-700">
  //                   Active
  //                 </p>
  //                 <p className="text-xs text-slate-500">
  //                   Inactive designers stay saved but hidden from the storefront.
  //                 </p>
  //               </div>

  //               <label className="relative inline-flex cursor-pointer items-center">
  //                 <input
  //                   type="checkbox"
  //                   className="peer sr-only"
  //                   checked={form.isActive}
  //                   onChange={(event) =>
  //                     setForm((prev) => ({
  //                       ...prev,
  //                       isActive: event.target.checked,
  //                     }))
  //                   }
  //                 />
  //                 <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300"></div>
  //               </label>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  //           <h2 className="text-base font-semibold text-slate-800">
  //             Preview Notes
  //           </h2>
  //           <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-500">
  //             <li>Use the avatar for the portrait and the brand image for logo-style branding.</li>
  //             <li>Banner images work best as wide editorial visuals with strong focal points.</li>
  //             <li>Favorite designers are surfaced on the user-facing home page.</li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="mt-8 flex items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
  //       <button
  //         type="button"
  //         onClick={() => router.back()}
  //         className="rounded-full px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
  //       >
  //         Cancel
  //       </button>

  //       <button
  //         type="submit"
  //         disabled={loading}
  //         className="rounded-full bg-slate-900 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
  //       >
  //         {loading ? "Saving..." : "Save Designer"}
  //       </button>
  //     </div>
  //   </form>
  // );
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {initialData
            ? "Edit Brand Partner"
            : "Create Brand Partner"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage designer profiles, business details, category assignments,
          branding assets, and storefront visibility.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-6">

            {/* BRAND INFORMATION */}
            <BrandInformationCard
              form={form}
              setForm={setForm}
            />

            {/* BUSINESS INFORMATION */}
            <BusinessInformationCard
              form={form}
              setForm={setForm}
            />

            {/* CATEGORY ASSIGNMENT */}
            <CategoryAssignmentCard
              categories={categories}
              selectedCategories={form.categories || []}
              setForm={setForm}
            />

            {/* BUSINESS ADDRESS */}
            <BusinessAddressCard
              form={form}
              setForm={setForm}
            />

            {/* SOCIAL LINKS */}
            <SocialLinksCard
              form={form}
              setForm={setForm}
            />

            {/* MEDIA ASSETS */}
            <MediaAssetsCard
              form={form}
              onImageUpload={handleImageUpload}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full xl:w-[380px] space-y-6">

            {/* STATUS */}
            <StorefrontSettingsCard
              form={form}
              setForm={setForm}
            />

            {/* SUMMARY */}
            <BrandSummaryCard form={form} />

            {/* GUIDELINES */}
            <GuidelinesCard />
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="sticky bottom-4 z-20">
          <div className="flex items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-8 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {submitting
                ? "Saving Brand..."
                : uploading
                  ? "Uploading Assets..."
                  : initialData
                    ? "Update Brand"
                    : "Create Brand"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
