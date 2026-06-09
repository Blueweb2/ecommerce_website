"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
<<<<<<< HEAD
import { Loader2 } from "lucide-react";
import type { AdminCreateDesignerPayload } from "@/types/designer";
=======
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
>>>>>>> c0b113f08364540b39b2748dd5949eb57162c109

type Props = {
  onSubmit: (data: AdminCreateDesignerPayload) => Promise<void>;
};

<<<<<<< HEAD
export default function DesignerForm({ onSubmit }: Props) {
  const router = useRouter();
=======
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
>>>>>>> c0b113f08364540b39b2748dd5949eb57162c109
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AdminCreateDesignerPayload>({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create Brand Partner
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new vendor account. They will receive an email with their login credentials to complete their profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">
            Account Details
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Contact Name / Placeholder Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. Aanya Mehra"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="vendor@example.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Temporary Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

<<<<<<< HEAD
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Account"}
          </button>
=======
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
>>>>>>> c0b113f08364540b39b2748dd5949eb57162c109
        </div>
      </form>
    </>
  );
}
