"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { CategoryPayload, CatalogEntity } from "@/lib/constants/admin-catalog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { deleteImage } from "@/lib/cloudinary/delete";

interface Props {
  initialData?: CatalogEntity | null;
  onSuccess?: () => void;
}

export default function CategoryForm({ initialData, onSuccess }: Props) {
  const router = useRouter();

  const {
    createCategory,
    updateCategory,
    fetchCategories,
    getParentCategories,
  } = useCategoryStore();

  const [loading, setLoading] = useState(false);

  // ✅ INITIAL EMPTY STATE
  const [form, setForm] = useState<CategoryPayload>({
    name: "",
    description: "",
    parent: null,
    image: undefined,
  });

  // ✅ 🔥 FIX: Sync form when initialData arrives
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        parent:
          typeof initialData.parent === "string"
            ? initialData.parent
            : initialData.parent?._id || null,
        image: initialData.image || undefined,
      });
    }
  }, [initialData]);

  // ✅ Fetch categories for dropdown
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const parentCategories = getParentCategories();

  // 🔥 HANDLE IMAGE UPLOAD
  const handleUpload = async (file: File) => {
    try {
      setLoading(true);

      const oldImage = form.image;

      const img = await uploadSingleImage(file, "ecommerce/categories");

      // delete old image after new upload
      if (oldImage?.public_id) {
        await deleteImage(oldImage.public_id);
      }

      setForm((prev) => ({
        ...prev,
        image: img,
      }));
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      setLoading(true);

      if (initialData?._id) {
        await updateCategory(initialData._id, form);
        toast.success("Category updated");
      } else {
        await createCategory(form);
        toast.success("Category created");
      }

      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-2xl shadow"
    >
      {/* TITLE */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Edit Category" : "Create Category"}
        </h2>
        <p className="text-sm text-gray-500">
          Manage your category details
        </p>
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm text-gray-600">Category Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="e.g. Clothing"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Optional description"
        />
      </div>

      {/* PARENT CATEGORY */}
      <div>
        <label className="text-sm text-gray-600">
          Parent Category (Optional)
        </label>
        <select
          value={form.parent || ""}
          onChange={(e) =>
            setForm({
              ...form,
              parent: e.target.value || null,
            })
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Main Category</option>
          {parentCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* IMAGE */}
      <div>
        <label className="text-sm text-gray-600">Category Image</label>

        <ImageUpload
          multiple={false}
          onFilesSelect={(files) => {
            if (files.length > 0) {
              handleUpload(files[0]);
            }
          }}
        />

        {form.image?.url && (
          <div className="mt-3">
            <img
              src={form.image.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_300/"
              )}
              alt={form.image?.altText || "preview"}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Category"
              : "Create Category"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useCategoryStore } from "@/store/admin/useCategoryStore";
// import { CategoryPayload, CatalogEntity } from "@/lib/constants/admin-catalog";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import ImageUpload from "@/components/admin/ui/ImageUpload";
// import { uploadSingleImage } from "@/lib/cloudinary/upload";
// import { deleteImage } from "@/lib/cloudinary/delete";

// interface Props {
//   initialData?: CatalogEntity | null;
//   onSuccess?: () => void;
// }

// export default function CategoryForm({ initialData, onSuccess }: Props) {
//   const router = useRouter();

//   const {
//     createCategory,
//     updateCategory,
//     fetchCategories,
//     getParentCategories,
//   } = useCategoryStore();

//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState<CategoryPayload>({
//  useEffect(() => {
//   if (initialData) {
//     setForm({
//       name: initialData.name || "",
//       description: initialData.description || "",
//       parent:
//         typeof initialData.parent === "string"
//           ? initialData.parent
//           : initialData.parent?._id || null,
//       image: initialData.image || undefined,
//     });
//   }
// }, [initialData]);
//   });

//   // 🔥 fetch categories for parent dropdown
//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   const parentCategories = getParentCategories();

//   // 🔥 HANDLE IMAGE UPLOAD (Cloudinary)


//   const handleUpload = async (file: File) => {
//     try {
//       setLoading(true);

//       const oldImage = form.image;

//       const img = await uploadSingleImage(file, "categories");

//       // ✅ only delete AFTER success
//       if (oldImage?.public_id) {
//         await deleteImage(oldImage.public_id);
//       }

//       setForm((prev) => ({
//         ...prev,
//         image: img,
//       }));

//     } catch (error) {
//       toast.error("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // 🔥 SUBMIT
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.name.trim()) {
//       return toast.error("Category name is required");
//     }

//     try {
//       setLoading(true);

//       if (initialData?._id) {
//         await updateCategory(initialData._id, form);
//         toast.success("Category updated");
//       } else {
//         await createCategory(form);
//         toast.success("Category created");
//       }

//       onSuccess?.();
//     } catch (err) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 bg-white p-6 rounded-2xl shadow"
//     >
//       {/* TITLE */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-800">
//           {initialData ? "Edit Category" : "Create Category"}
//         </h2>
//         <p className="text-sm text-gray-500">
//           Manage your category details
//         </p>
//       </div>

//       {/* NAME */}
//       <div>
//         <label className="text-sm text-gray-600">Category Name</label>
//         <input
//           type="text"
//           value={form.name}
//           onChange={(e) =>
//             setForm({ ...form, name: e.target.value })
//           }
//           className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//           placeholder="e.g. Clothing"
//         />
//       </div>

//       {/* DESCRIPTION */}
//       <div>
//         <label className="text-sm text-gray-600">Description</label>
//         <textarea
//           value={form.description}
//           onChange={(e) =>
//             setForm({ ...form, description: e.target.value })
//           }
//           className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//           placeholder="Optional description"
//         />
//       </div>

//       {/* PARENT CATEGORY */}
//       <div>
//         <label className="text-sm text-gray-600">
//           Parent Category (Optional)
//         </label>
//         <select
//           value={form.parent || ""}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               parent: e.target.value || null,
//             })
//           }
//           className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//         >
//           <option value="">Main Category</option>
//           {parentCategories.map((cat) => (
//             <option key={cat._id} value={cat._id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* IMAGE UPLOAD */}

//       <div>
//         <label className="text-sm text-gray-600">Category Image</label>

//         <ImageUpload
//           multiple={false}
//           onFilesSelect={(files) => {
//             if (files.length > 0) {
//               handleUpload(files[0]);
//             }
//           }}
//         />

//         {/* PREVIEW */}
//         {form.image?.url && (
//           <div className="mt-3">
//             <img
//               src={form.image.url.replace(
//                 "/upload/",
//                 "/upload/f_auto,q_auto,w_300/"
//               )}
//               alt={form.image?.altText || "preview"}
//               className="w-32 h-32 object-cover rounded-lg border"
//             />
//           </div>
//         )}

//         {loading && (
//           <p className="text-sm text-gray-500">Uploading...</p>
//         )}
//       </div>

//       {/* ACTIONS */}
//       <div className="flex gap-3">
//         <button
//           type="submit"
//           disabled={loading}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           {loading
//             ? "Saving..."
//             : initialData
//               ? "Update Category"
//               : "Create Category"}
//         </button>

//         <button
//           type="button"
//           disabled={loading}
//           onClick={() => router.back()}
//           className="px-4 py-2 bg-gray-200 rounded-lg"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }