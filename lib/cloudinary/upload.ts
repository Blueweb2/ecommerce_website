// // lib/api/cloudinary/upload.ts

// type UploadedImage = {
//   url: string;
//   public_id: string;
//   isPrimary?: boolean;
// };

// //  Get signature (private helper)
// const getSignature = async (folder: string) => {
//   const token = localStorage.getItem("accessToken"); //  FIX

//   if (!token) {
//     throw new Error("No access token found");
//   }

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/cloudinary/signature?folder=${folder}`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`, //  correct now
//       },
//       credentials: "include",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to get Cloudinary signature");
//   }

//   return res.json();
// };

// //  SINGLE IMAGE UPLOAD
// export const uploadSingleImage = async (
//   file: File,
//   folder = "categories"
// ): Promise<UploadedImage> => {
//   try {
//     const { timestamp, signature, cloudName, apiKey } =
//       await getSignature(folder);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("api_key", apiKey);
//     formData.append("timestamp", timestamp);
//     formData.append("signature", signature);
//     formData.append("folder", folder);

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error?.message || "Upload failed");
//     }

//     return {
//       url: data.secure_url,
//       public_id: data.public_id,
//     };
//   } catch (error) {
//     console.error("Single upload error:", error);
//     throw error;
//   }
// };

// //  MULTIPLE IMAGE UPLOAD
// export const uploadMultipleImages = async (
//   files: File[],
//   folder = "products"
// ): Promise<UploadedImage[]> => {
//   try {
//     const { timestamp, signature, cloudName, apiKey } =
//       await getSignature(folder);

//     const uploads = files.map(async (file, index) => {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("api_key", apiKey);
//       formData.append("timestamp", timestamp);
//       formData.append("signature", signature);
//       formData.append("folder", folder);

//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error?.message || "Upload failed");
//       }

//       return {
//         url: data.secure_url,
//         public_id: data.public_id,
//         isPrimary: index === 0, //  can improve later
//       };
//     });

//     return await Promise.all(uploads);
//   } catch (error) {
//     console.error("Multiple upload error:", error);
//     throw error;
//   }
// };

import api from "@/lib/api/axios";

type UploadedImage = {
  url: string;
  public_id: string;
  isPrimary?: boolean;
};

//  Get signature (FIXED)
const getSignature = async (folder: string) => {
  const res = await api.get(`/cloudinary/signature?folder=${folder}`);
  return res.data;
};

//  SINGLE IMAGE UPLOAD
export const uploadSingleImage = async (
  file: File,
  folder = "ecommerce/categories"
): Promise<UploadedImage> => {
  try {
    const { timestamp, signature, cloudName, apiKey } =
      await getSignature(folder);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return {
      url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error("Single upload error:", error);
    throw error;
  }
};

//  MULTIPLE IMAGE UPLOAD
export const uploadMultipleImages = async (
  files: File[],
  folder = "ecommerce/products",
  primaryIndex = 0
): Promise<UploadedImage[]> => {
  try {
    const { timestamp, signature, cloudName, apiKey } =
      await getSignature(folder);

    const uploads = files.map(async (file, index) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      return {
        url: data.secure_url,
        public_id: data.public_id,
        isPrimary: index === primaryIndex,
      };
    });

    return await Promise.all(uploads);

  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};