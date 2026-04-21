import { ImagePlus, Maximize2 } from "lucide-react";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { useEffect, useState } from "react";
import ImageModal from "@/components/admin/ui/ImageModal";
import { CatalogImage } from "@/lib/constants/admin-catalog";

type Props = {
  files: File[];
  setFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  form: {
    images: CatalogImage[];
    primaryImageIndex?: number;
    altText?: string;
  };
  setForm: (updater: any) => void;
  errors: Record<string, string>;
};

export default function MediaSection({
  files,
  setFiles,
  form,
  setForm,
  errors,
}: Props) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // ✅ Generate previews safely
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // 🔥 Primary image index
  const primaryIndex = form.primaryImageIndex ?? 0;

  const setPrimary = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      primaryImageIndex: index,
    }));
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <ImagePlus className="h-5 w-5 text-slate-500" />
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
          Media
        </h3>
      </div>

      <div className="mt-6 grid gap-4">
        
        {/* Upload */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Upload product images
          </label>

          {/* ✅ Fixed: showPreview={false} to avoid double images */}
          <ImageUpload onFilesSelect={setFiles} showPreview={false} />

          <p className="text-xs text-slate-500">
            {files.length > 0
               ? `${files.length} image${files.length > 1 ? "s" : ""} selected`
              : "Upload multiple product images"}
          </p>

          {errors.images && (
            <p className="text-sm text-rose-600">{errors.images}</p>
          )}
        </div>

        {/* 🔥 EXISTING IMAGES (EDIT MODE) */}
        {form.images?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2 font-semibold">
              Existing Images
            </p>

            <div className="flex gap-3 flex-wrap">
              {form.images.map((img: CatalogImage, i: number) => (
                <div key={i} className="relative group overflow-hidden rounded-lg">
                  
                  <img
                    src={img.url}
                    className="h-20 w-20 object-cover rounded-lg border cursor-pointer group-hover:scale-110 transition-transform duration-300"
                    onClick={() => setZoomedImage(img.url)}
                  />

                  {/* Zoom Icon Overlay */}
                  <div 
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer pointer-events-none"
                  >
                    <Maximize2 className="h-4 w-4 text-white" />
                  </div>

                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 bg-black text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 NEW FILE PREVIEW */}
        {files.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2 font-semibold">
              New Images
            </p>

            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative group overflow-hidden rounded-lg">
                  
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="h-20 w-20 object-cover rounded-lg border cursor-pointer group-hover:scale-110 transition-transform duration-300"
                    onClick={() => setZoomedImage(src)}
                  />

                  {/* Zoom Icon Overlay */}
                  <div 
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer pointer-events-none"
                  >
                    <Maximize2 className="h-4 w-4 text-white" />
                  </div>

                  {/* Primary Badge */}
                  {i === primaryIndex && (
                    <span className="absolute top-1 left-1 bg-black text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      Primary
                    </span>
                  )}

                  {/* Set Primary Button */}
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    className="absolute bottom-1 left-1 text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase hover:bg-blue-700 transition"
                  >
                    Main
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) =>
                         prev.filter((_, index) => index !== i)
                      )
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alt text */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Image alt text
          </label>

          <input
            placeholder="Product displayed on clean background"
            value={form.altText}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                altText: e.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
          />

          <p className="text-xs text-slate-500">
            Helps with SEO and accessibility.
          </p>
        </div>

      </div>

      {/* ✅ Full Screen Image Modal */}
      <ImageModal
        isOpen={zoomedImage !== null}
        onClose={() => setZoomedImage(null)}
        imageUrl={zoomedImage}
      />

    </section>
  );
}