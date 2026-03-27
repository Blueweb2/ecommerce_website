export const uploadMultipleImages = async (files: File[]) => {
  const res = await fetch(
    "/api/cloudinary/signature?folder=products"
  );
  const { timestamp, signature, cloudName, apiKey } = await res.json();

  const uploads = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "products");

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await uploadRes.json();
  });

  const results = await Promise.all(uploads);

  return results.map((img, index) => ({
    url: img.secure_url,
    public_id: img.public_id,
    isPrimary: index === 0,
  }));
};