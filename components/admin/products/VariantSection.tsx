"use client";

type Variant = {
  attributes: Record<string, string>;
  stock?: number | string;
  price?: number | string;
  images?: {
    file?: File;
    preview?: string;
    url?: string;
  }[];
};

type Props = {
  variants: Variant[];
  setForm: (updater: any) => void;
  errors: Record<string, string>;
};

export default function VariantSection({
  variants,
  setForm,
  errors,
}: Props) {
  if (!variants.length) return null;

  const attributeKeys = Object.keys(variants[0]?.attributes || {});

  // 🔥 Update field (NO SKU)
  const updateField = (
    index: number,
    field: "stock" | "price",
    value: string
  ) => {
    setForm((prev: any) => ({
      ...prev,
      variants: prev.variants.map((v: Variant, i: number) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  // 🔥 Image upload
  const handleImageUpload = (
    index: number,
    files: FileList | null
  ) => {
    if (!files) return;

    const images = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setForm((prev: any) => ({
      ...prev,
      variants: prev.variants.map((v: Variant, i: number) =>
        i === index
          ? { ...v, images: [...(v.images || []), ...images] }
          : v
      ),
    }));
  };

  const removeImage = (variantIndex: number, imageIndex: number) => {
    setForm((prev: any) => ({
      ...prev,
      variants: prev.variants.map((v: Variant, i: number) =>
        i === variantIndex
          ? {
              ...v,
              images: v.images?.filter((_, j) => j !== imageIndex),
            }
          : v
      ),
    }));
  };

  return (
    <section className="rounded-[28px] border p-6 bg-white space-y-4">
      <h3 className="text-xl font-semibold">Variants</h3>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl">
          <thead className="bg-slate-100 text-sm">
            <tr>
              {attributeKeys.map((key) => (
                <th key={key} className="p-3 text-left capitalize">
                  {key}
                </th>
              ))}

              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Images</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((variant, index) => (
              <tr key={index} className="border-t align-top">
                
                {/* Attributes */}
                {attributeKeys.map((key) => (
                  <td key={key} className="p-3 text-sm">
                    {variant.attributes[key]}
                  </td>
                ))}

                {/* Price */}
                <td className="p-3">
                  <input
                    type="number"
                    value={variant.price ?? ""}
                    onChange={(e) =>
                      updateField(index, "price", e.target.value)
                    }
                    className="border px-2 py-1 rounded w-24"
                  />
                </td>

                {/* Stock */}
                <td className="p-3">
                  <input
                    type="number"
                    value={variant.stock ?? ""}
                    onChange={(e) =>
                      updateField(index, "stock", e.target.value)
                    }
                    className="border px-2 py-1 rounded w-20"
                  />
                </td>

                {/* Images */}
                <td className="p-3 space-y-2">
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      handleImageUpload(index, e.target.files)
                    }
                  />

                  <div className="flex gap-2 flex-wrap">
                    {variant.images?.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={
                            img.preview ||
                            img.url ||
                            "/placeholder.png"
                          }
                          className="w-12 h-12 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, i)}
                          className="absolute top-0 right-0 text-xs bg-red-500 text-white px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.variants && (
        <p className="text-red-500 text-sm">{errors.variants}</p>
      )}
    </section>
  );
}