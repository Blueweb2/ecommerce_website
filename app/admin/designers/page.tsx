"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, PenSquare, Trash2 } from "lucide-react";
import { useDesignerStore } from "@/store/admin/useDesignerStore";
import { resolveImageSrc } from "@/lib/utils/image";
import type { Designer, DesignerImage } from "@/types/designer";

const FALLBACK_BANNER = "/home/herosection/hero-right-top.png";
const FALLBACK_AVATAR = "/placeholder.png";

function resolveImage(image?: DesignerImage | null, fallback = FALLBACK_AVATAR) {
  return resolveImageSrc(image?.url, fallback);
}

function StatusBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}

export default function DesignersPage() {
  const { designers, loading, fetchDesigners, deleteDesigner } = useDesignerStore();

  useEffect(() => {
      console.log("Fetching designers...");

    void fetchDesigners();
  }, [fetchDesigners]);

  const handleDelete = async (designer?: Designer) => {
    if (!designer?._id) {
      return;
    }

    const confirmed = confirm(`Delete designer "${designer.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteDesigner(designer._id);
      toast.success("Designer deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete designer");
    }
  };
  console.log("loading:", loading);
console.log("designers:", designers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Designers</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create and manage designers, their branding assets, and which ones are featured on the user side.
          </p>
        </div>

        <Link
          href="/admin/designers/create"
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Add Designer
        </Link>
      </div>

      {loading && !designers.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : designers.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {designers.map((designer) => (
            <article
              key={designer._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src={resolveImage(designer.bannerImage, FALLBACK_BANNER)}
                  alt={`${designer.name} banner`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-5 top-5 flex gap-2">
                  <StatusBadge
                    label={designer.isActive ? "Active" : "Inactive"}
                    active={Boolean(designer.isActive)}
                  />
                  <StatusBadge
                    label={designer.isFavorite ? "Favorite" : "Standard"}
                    active={Boolean(designer.isFavorite)}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <Image
                      src={resolveImage(designer.avatar)}
                      alt={designer.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {designer.name}
                      </h2>
                      {designer.isFavorite ? (
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-slate-400">
                      {designer.brandName}
                    </p>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {designer.description || "No description added yet."}
                    </p>
                  </div>

                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={resolveImage(designer.brandImage)}
                      alt={`${designer.brandName} brand`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/admin/designers/${designer._id}/edit`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    <PenSquare className="h-4 w-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleDelete(designer)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-800">No designers yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Add your first designer profile to start featuring brands on the storefront.
          </p>
        </div>
      )}
    </div>
  );
}
