import api from "@/lib/api/axios";

type UploadedImage = {
  url: string;
  public_id: string;
  isPrimary?: boolean;
};

//  Get signature (FIXED)
const getSignature = async (folder: string, isDesignerPortal?: boolean) => {
  const endpoint = isDesignerPortal 
    ? `/designers/cloudinary/signature?folder=${folder}`
    : `/cloudinary/signature?folder=${folder}`;
  const res = await api.get(endpoint);
  return res.data;
};

//  SINGLE IMAGE UPLOAD
export const uploadSingleImage = async (
  file: File,
  folder = "ecommerce/categories",
  isDesignerPortal?: boolean
): Promise<UploadedImage> => {
  try {
    const { timestamp, signature, cloudName, apiKey } =
      await getSignature(folder, isDesignerPortal);

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
  primaryIndex = 0,
  isDesignerPortal?: boolean
): Promise<UploadedImage[]> => {
  try {
    const { timestamp, signature, cloudName, apiKey } =
      await getSignature(folder, isDesignerPortal);

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