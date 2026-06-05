type StorefrontSettingsCardProps = {
  form: {
    isActive?: boolean;
    isFavorite?: boolean;
    isFeatured?: boolean;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <div className="peer h-6 w-11 rounded-full bg-slate-200 transition after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-emerald-300/30" />
    </label>
  );
}

export default function StorefrontSettingsCard({
  form,
  setForm,
}: StorefrontSettingsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Storefront Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Control how this brand appears across the storefront and admin
          platform.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Active */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-800">
              Active Brand
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Active brands are visible throughout the storefront and can be
              assigned to products.
            </p>
          </div>

          <Toggle
            checked={form.isActive ?? true}
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                isActive: value,
              }))
            }
          />
        </div>

        {/* Featured */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-800">
              Featured Brand
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Highlight this brand in featured collections, landing pages,
              promotional sections, and special campaigns.
            </p>
          </div>

          <Toggle
            checked={form.isFeatured ?? false}
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                isFeatured: value,
              }))
            }
          />
        </div>

        {/* Homepage */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-800">
              Homepage Showcase
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Display this brand in the homepage designer section and brand
              discovery areas.
            </p>
          </div>

          <Toggle
            checked={form.isFavorite ?? false}
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                isFavorite: value,
              }))
            }
          />
        </div>
      </div>

      {/* Status Preview */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-800">
          Current Status
        </h3>

        <div className="flex flex-wrap gap-2">
          {form.isActive && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Active
            </span>
          )}

          {form.isFeatured && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Featured
            </span>
          )}

          {form.isFavorite && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Homepage
            </span>
          )}

          {!form.isActive && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-xs leading-5 text-indigo-700">
          Featured and homepage brands receive additional visibility in the
          customer-facing storefront. Use these options for strategic brand
          promotion.
        </p>
      </div>
    </div>
  );
}