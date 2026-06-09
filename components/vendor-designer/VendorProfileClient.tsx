"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Building2,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import BrandInformationCard from "@/components/admin/designers/BrandInformationCard";
import BrandSummaryCard from "@/components/admin/designers/BrandSummaryCard";
import BusinessAddressCard from "@/components/admin/designers/BusinessAddressCard";
import BusinessInformationCard from "@/components/admin/designers/BusinessInformationCard";
import CategoryAssignmentCard from "@/components/admin/designers/CategoryAssignmentCard";
import MediaAssetsCard from "@/components/admin/designers/MediaAssetsCard";
import SocialLinksCard from "@/components/admin/designers/SocialLinksCard";
import { useVendorPortalData } from "@/hooks/useVendorPortalData";
import { deleteImage } from "@/lib/cloudinary/delete";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { updateDesigner } from "@/lib/api/admin/designer.api";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { useDesignerProfileStore } from "@/store/designer/useDesignerProfileStore";
import type { Designer, DesignerImage, DesignerPayload } from "@/types/designer";

type VendorProfileForm = Omit<DesignerPayload, "categories" | "name" | "brandName" | "description"> & {
  name: string;
  brandName: string;
  description: string;
  slug?: string;
  categories: string[];
  avatar?: DesignerImage;
  brandImage?: DesignerImage;
  bannerImage?: DesignerImage;
};

type ImageField = "avatar" | "brandImage" | "bannerImage";

const DESIGNER_UPLOAD_FOLDER = "ecommerce/designers";

const EMPTY_FORM: VendorProfileForm = {
  name: "",
  brandName: "",
  slug: "",
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
  isActive: true,
  isFavorite: false,
  isFeatured: false,
};

function createFormFromDesigner(designer: Designer): VendorProfileForm {
  return {
    name: designer.name || "",
    brandName: designer.brandName || "",
    slug: designer.slug || "",
    description: designer.description || "",
    businessName: designer.businessName || "",
    email: designer.email || "",
    phone: designer.phone || "",
    gstNumber: designer.gstNumber || "",
    website: designer.website || "",
    categories: Array.isArray(designer.categories) 
      ? designer.categories.map((c: any) => typeof c === "string" ? c : c._id) 
      : [],
    address: {
      addressLine1: designer.address?.addressLine1 || "",
      addressLine2: designer.address?.addressLine2 || "",
      city: designer.address?.city || "",
      district: designer.address?.district || "",
      state: designer.address?.state || "",
      country: designer.address?.country || "India",
      pincode: designer.address?.pincode || "",
    },
    socialLinks: {
      instagram: designer.socialLinks?.instagram || "",
      facebook: designer.socialLinks?.facebook || "",
      youtube: designer.socialLinks?.youtube || "",
      pinterest: designer.socialLinks?.pinterest || "",
      twitter: designer.socialLinks?.twitter || "",
    },
    avatar: designer.avatar || undefined,
    brandImage: designer.brandImage || undefined,
    bannerImage: designer.bannerImage || undefined,
    isActive: designer.isActive ?? true,
    isFavorite: designer.isFavorite ?? false,
    isFeatured: designer.isFeatured ?? false,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber" | "blue" | "slate";
}) {
  const tones = {
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-sky-100 text-sky-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {label}
    </span>
  );
}

export default function VendorProfileClient() {
  const {
    identityLabel,
    stats,
    loading: portalLoading,
    error: portalError,
    notice,
    refresh,
  } = useVendorPortalData();
  const { categories, fetchCategories } = useCategoryStore();
  const { profile: designer, loading: profileLoading, fetchProfile, completionPercentage, sections, updateProfile } = useDesignerProfileStore();

  const [form, setForm] = useState<VendorProfileForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void fetchCategories();
    void fetchProfile();
  }, [fetchCategories, fetchProfile]);

  useEffect(() => {
    if (designer) {
      setForm(createFormFromDesigner(designer));
    }
  }, [designer]);

  const handleImageUpload = async (field: ImageField, file: File) => {
    const previous = form[field];

    try {
      setUploading(true);
      const uploaded = await uploadSingleImage(file, DESIGNER_UPLOAD_FOLDER);

      if (previous?.public_id) {
        await deleteImage(previous.public_id);
      }

      setForm((current) => ({
        ...current,
        [field]: uploaded,
      }));

      toast.success("Image updated");
    } catch (caughtError) {
      console.error(caughtError);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    if (designer) {
      setForm(createFormFromDesigner(designer));
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!designer?._id) {
      toast.error("Designer profile is not linked to this account yet.");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Designer name is required");
      return;
    }

    if (!form.brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Brand description is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        name: form.name.trim(),
        brandName: form.brandName.trim(),
        slug: form.slug?.trim() || undefined,
        description: form.description.trim(),
        businessName: form.businessName?.trim() || undefined,
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        gstNumber: form.gstNumber?.trim() || undefined,
        website: form.website?.trim() || undefined,
      };

      await updateProfile(payload);

      await refresh();
      toast.success("Vendor profile updated");
    } catch (caughtError) {
      console.error(caughtError);
      toast.error("Failed to update vendor profile");
    } finally {
      setSaving(false);
    }
  };

  if ((portalLoading || profileLoading) && !designer) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (portalError) {
    return (
      <section className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h1 className="text-2xl font-semibold">Vendor profile unavailable</h1>
        <p className="mt-3 text-sm leading-6">{portalError}</p>
      </section>
    );
  }

  if (!designer) {
    return (
      <section className="rounded-[32px] border border-amber-200 bg-amber-50 p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Profile Link Needed
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          We couldn&apos;t find a designer profile for {identityLabel}.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Ask an admin to link this vendor login to a designer record first. Once
          the account is linked, this page will unlock profile editing, media
          uploads, and brand information management.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-2xl">
        <div className="absolute inset-0">
          {form.bannerImage?.url ? (
            <Image
              src={form.bannerImage.url}
              alt={`${form.brandName} banner`}
              fill
              className="object-cover opacity-30"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,20,16,0.92)_0%,rgba(18,37,26,0.82)_45%,rgba(38,84,59,0.78)_100%)]" />
        </div>

        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="flex min-w-0 items-center gap-5">
            <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-white/15 bg-white/10">
              {form.avatar?.url ? (
                <Image
                  src={form.avatar.url}
                  alt={form.name || "Designer avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                  {(form.name || form.brandName || "D").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                <Store className="h-3.5 w-3.5" />
                Vendor Profile
              </div>
              <h1 className="mt-4 truncate text-3xl font-semibold">
                {form.brandName || identityLabel}
              </h1>
              <p className="mt-2 text-sm text-emerald-50/80">
                {form.name || "Designer"} · {form.email || "Add your business email"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge
                  label={form.isActive ? "Active brand" : "Inactive brand"}
                  tone={form.isActive ? "green" : "slate"}
                />
                {form.isFeatured ? (
                  <StatusBadge label="Featured" tone="amber" />
                ) : null}
                {form.isFavorite ? (
                  <StatusBadge label="Homepage showcase" tone="blue" />
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="submit"
              form="vendor-profile-form"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Profile
            </button>
          </div>
        </div>
      </section>

      {notice ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {notice}
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <article className="col-span-1 md:col-span-4 rounded-[24px] border bg-white p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Profile Completion</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{completionPercentage}%</p>
            </div>
            <div className="flex-1 max-w-xl">
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${completionPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${completionPercentage}%` }} 
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {sections.map(section => (
                  <span 
                    key={section.key} 
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${section.isComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}
                  >
                    {section.isComplete ? <BadgeCheck className="h-3 w-3" /> : <Sparkles className="h-3 w-3 text-slate-400" />}
                    {section.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.totalProducts}</p>
        </article>
        <article className="rounded-[24px] border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.totalOrders}</p>
        </article>
        <article className="rounded-[24px] border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </article>
      </div>

      <form
        id="vendor-profile-form"
        onSubmit={handleSave}
        className="space-y-6"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="flex-1 space-y-6">
            <BrandInformationCard form={form} setForm={setForm} />
            <BusinessInformationCard form={form} setForm={setForm} />
            <CategoryAssignmentCard
              categories={categories}
              selectedCategories={form.categories || []}
              setForm={setForm}
            />
            <BusinessAddressCard form={form} setForm={setForm} />
            <SocialLinksCard form={form} setForm={setForm} />
            <MediaAssetsCard form={form} onImageUpload={handleImageUpload} />
          </div>

          <div className="w-full space-y-6 xl:w-[380px]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Visibility and verification states currently applied to this brand.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Brand status</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Controlled by platform approval and vendor onboarding status.
                    </p>
                  </div>
                  <StatusBadge
                    label={form.isActive ? "Active" : "Inactive"}
                    tone={form.isActive ? "green" : "slate"}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Homepage showcase</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Managed by admin merchandising when your brand is selected.
                    </p>
                  </div>
                  <StatusBadge
                    label={form.isFavorite ? "Enabled" : "Not enabled"}
                    tone={form.isFavorite ? "blue" : "slate"}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Featured campaigns</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Set by admin teams for curated promotions and landing pages.
                    </p>
                  </div>
                  <StatusBadge
                    label={form.isFeatured ? "Featured" : "Standard"}
                    tone={form.isFeatured ? "amber" : "slate"}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-xs leading-5 text-indigo-700">
                  Vendors can update brand content here. Promotional placement and
                  storefront merchandising remain controlled by admins.
                </p>
              </div>
            </article>

            <BrandSummaryCard form={form} />

            <article className="rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_100%)] p-6 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Profile checklist</h2>
                  <p className="mt-1 text-sm text-white/70">
                    A stronger profile helps catalog approval and storefront trust.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/85">
                {sections.map(section => (
                  <div key={section.key} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span className={section.isComplete ? "text-emerald-300" : ""}>{section.label} ({section.weight}%)</span>
                    {section.isComplete ? (
                      <BadgeCheck className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-white/40" />
                    )}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="sticky bottom-4 z-20">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Save after updating brand info, contact details, address, social links, or media.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset Changes
              </button>

              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
              >
                {saving || uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : uploading ? "Uploading..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
