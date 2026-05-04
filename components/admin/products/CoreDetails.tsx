"use client";

type Props = {
  form: any;
  setForm: (updater: any) => void;
  errors: Record<string, string>;
};

export default function CoreDetails({ form, setForm, errors }: Props) {
  // 🔥 Detect if variants exist
  const hasVariants = form.variants?.length > 0;

  // 🔥 Calculate total stock from variants (optional UX boost)
  const totalVariantStock = hasVariants
    ? form.variants.reduce(
      (sum: number, v: any) => sum + (Number(v.stock) || 0),
      0
    )
    : 0;

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Core details
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Add the essentials your shoppers and merchandisers need.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* SKU */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            SKU (Base)
          </label>
          <input
            value={form.sku || ""}
            readOnly
            placeholder="Auto generated after product creation"
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-400 outline-none cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 italic">
            Base SKU for identifying this product family.
          </p>
        </div>

        {/* Product Name */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Product name
          </label>
          <input
            placeholder="e.g. Premium Silk Scarf"
            value={form.name}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
          />
          {errors.name && (
            <p className="text-sm text-rose-600 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Total Stock
          </label>
          <input
            type="number"
            min="0"
            placeholder="14"
            value={form.stock}
            disabled={hasVariants}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                stock: e.target.value,
              }))
            }
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition 
              ${hasVariants
                ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
                : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              }
            `}
          />
          {hasVariants && (
            <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full inline-block">
              Stock managed by variants. Total: {totalVariantStock}
            </p>
          )}
          {errors.stock && (
            <p className="text-sm text-rose-600 font-medium">{errors.stock}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Full Description
          </label>
          <textarea
            rows={6}
            placeholder="Describe the aesthetic, quality, and specific use cases..."
            value={form.description}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
          />
          {errors.description && (
            <p className="text-sm text-rose-600 font-medium">
              {errors.description}
            </p>
          )}
        </div>

        {/* Delivery Details */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Delivery Details
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Ships within 2-3 business days. Free shipping on orders over ₹2000."
            value={form.deliveryDetails}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                deliveryDetails: e.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
          />
        </div>

      </div>
    </section>
  );
}