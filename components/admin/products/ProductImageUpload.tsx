"use client";

import { useState } from "react";

type ImageType = {
  file: File;
  preview: string;
};

interface Props {
  onChange: (files: File[]) => void;
}

export default function ProductImageUpload({ onChange }: Props) {
  const [images, setImages] = useState<ImageType[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updated = [...images, ...newImages];

    setImages(updated);
    onChange(updated.map((img) => img.file));
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onChange(updated.map((img) => img.file));
  };

  return (
    <div className="space-y-4">
      <input type="file" multiple accept="image/*" onChange={handleChange} />

      <div className="flex gap-3 flex-wrap">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img.preview}
              className="h-24 w-24 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}