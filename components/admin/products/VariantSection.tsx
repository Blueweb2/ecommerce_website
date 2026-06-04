import { useState } from "react";
import ImageModal from "@/components/admin/ui/ImageModal";
import { Maximize2, Plus } from "lucide-react";

type Variant = {
  attributes: Record<string, string>;
  stock?: number | string;
  price?: number | string;
  discountPrice?: number | string;
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
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!variants.length) return null;

  const firstVariantAttributes = variants[0]?.attributes;
  const variantAttributeKeys =
    firstVariantAttributes &&
    typeof firstVariantAttributes === "object" &&
    !Array.isArray(firstVariantAttributes)
      ? Object.keys(firstVariantAttributes)
      : [];

  //  Update field (NO SKU)
  const updateField = (
    index: number,
    field: "stock" | "price" | "discountPrice",
    value: string
  ) => {
    setForm((prev: any) => ({
      ...prev,
      variants: prev.variants.map((v: Variant, i: number) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  //  Image upload
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
              {variantAttributeKeys.map((key) => (
                <th key={key} className="p-3 text-left capitalize">
                  {key}
                </th>
              ))}

              <th className="p-3">Price</th>
              <th className="p-3">Discount Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Images</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((variant, index) => (
              <tr key={index} className="border-t align-top">

                {/* Attributes */}
                {variantAttributeKeys.map((key) => (
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

                {/* Discount Price */}
                <td className="p-3">
                  <input
                    type="number"
                    value={variant.discountPrice ?? ""}
                    onChange={(e) =>
                      updateField(index, "discountPrice", e.target.value)
                    }
                    className="border px-2 py-1 rounded w-24"
                  />
                </td>

                {/* Stock */}
                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    value={variant.stock ?? ""}
                    onChange={(e) =>
                      updateField(index, "stock", e.target.value)
                    }
                    className="border px-2 py-1 rounded w-20"
                  />
                </td>

                {/* Images */}
                <td className="p-3 space-y-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition active:scale-95">
                    <Plus className="h-3 w-3" />
                    Add Images
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(index, e.target.files)
                      }
                    />
                  </label>

                  <div className="flex gap-2 flex-wrap">
                    {variant.images?.map((img, i) => {
                      const src = img.preview || img.url || "/placeholder.png";
                      return (
                        <div key={i} className="relative group rounded overflow-hidden">
                          <img
                            src={src}
                            className="w-12 h-12 object-cover rounded cursor-pointer group-hover:scale-110 transition"
                            onClick={() => setZoomedImage(src)}
                          />

                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition">
                            <Maximize2 className="h-3 w-3 text-white" />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeImage(index, i)}
                            className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-bl text-[10px] hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
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

      {/* Image Preview Modal */}
      <ImageModal
        isOpen={zoomedImage !== null}
        onClose={() => setZoomedImage(null)}
        imageUrl={zoomedImage}
      />
    </section>
  );
}
