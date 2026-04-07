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
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
        Core details
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Add the essentials your shoppers and merchandisers need.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        
        {/* SKU */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            SKU
          </label>

          <input
            value={form.sku || ""}
            readOnly
            placeholder="Auto generated after product creation"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
          />

          <p className="text-xs text-slate-500">
            Product-level SKU (variants have their own SKU).
          </p>
        </div>

        {/* Product Name */}
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Product name
          </label>

          <input
            placeholder="Premium Cotton T-Shirt"
            value={form.name}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
          />

          {errors.name && (
            <p className="text-sm text-rose-600">{errors.name}</p>
          )}
        </div>

        {/* Price */}
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Base Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="999"
            value={form.price}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                price: e.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
          />

          <p className="text-xs text-slate-500">
            Used when variant price is not set.
          </p>

          {errors.price && (
            <p className="text-sm text-rose-600">{errors.price}</p>
          )}
        </div>

        {/* Stock */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Stock
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
            className={`rounded-2xl border px-4 py-3 outline-none transition 
              ${
                hasVariants
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "border-slate-200 focus:border-slate-400"
              }
            `}
          />

          {/* 🔥 Variant stock info */}
          {hasVariants && (
            <p className="text-xs text-slate-500">
              Stock is managed per variant. Total:{" "}
              <span className="font-medium">{totalVariantStock}</span>
            </p>
          )}

          {errors.stock && (
            <p className="text-sm text-rose-600">{errors.stock}</p>
          )}
        </div>

        {/* Description */}
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="High quality cotton t-shirt with breathable fabric..."
            value={form.description}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
          />

          <p className="text-xs text-slate-500">
            Describe features, materials, and usage.
          </p>

          {errors.description && (
            <p className="text-sm text-rose-600">
              {errors.description}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}