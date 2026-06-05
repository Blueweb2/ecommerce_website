type BrandInformationCardProps = {
  form: {
    name: string;
    brandName: string;
    slug?: string;
    description: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function BrandInformationCard({
  form,
  setForm,
}: BrandInformationCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Brand Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Basic details about the designer and brand that will be displayed
          across the storefront.
        </p>
      </div>

      <div className="space-y-5">
        {/* Designer Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Designer Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g. Aanya Mehra"
            value={form.name}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            The designer's personal or public-facing name.
          </p>
        </div>

        {/* Brand Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Brand Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g. Studio Mehra"
            value={form.brandName}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                brandName: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            Brand name shown on product pages and collections.
          </p>
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Brand Slug
          </label>

          <input
            type="text"
            placeholder="e.g. studio-mehra"
            value={form.slug || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                slug: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            Used in URLs such as{" "}
            <span className="font-medium text-slate-700">
              /designers/studio-mehra
            </span>
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Brand Description <span className="text-red-500">*</span>
          </label>

          <textarea
            rows={6}
            placeholder="Tell customers about the brand story, design philosophy, craftsmanship, and specialties..."
            value={form.description}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              This description may appear on brand profile pages.
            </p>

            <span className="text-xs text-slate-400">
              {form.description.length}/1000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}