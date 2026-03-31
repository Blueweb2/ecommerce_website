// lib/api/cloudinary/delete.ts

export const deleteImage = async (public_id: string) => {
  try {
    const res = await fetch("/api/cloudinary/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id }),
      credentials: "include", // 🔐 important
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Delete failed");
    }

    return data;
  } catch (error) {
    console.error("Delete image error:", error);
    throw error;
  }
};