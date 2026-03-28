"use client";

import { useState, useEffect } from "react";

interface Props {
  onFilesSelect: (files: File[]) => void;
  multiple?: boolean;
}

export default function ImageUpload({ onFilesSelect, multiple = true }: Props) {
  const [preview, setPreview] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    onFilesSelect(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  // 🔥 cleanup memory
  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  return (
    <div className="space-y-3">
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm"
      />

      <div className="flex gap-3 flex-wrap">
        {preview.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="preview"
            className="h-20 w-20 rounded object-cover border"
          />
        ))}
      </div>
    </div>
  );
}