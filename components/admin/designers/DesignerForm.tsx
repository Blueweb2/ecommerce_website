"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { deleteImage } from "@/lib/cloudinary/delete";
import type { Designer, DesignerPayload } from "@/types/designer";
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

export default function DesignerForm({ initialData, onSubmit }: Props) {
  const router = useRouter();

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
              {initialData
                ? "Update Brand"
                : "Create Brand"
              }
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
