"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export default function ImageModal({ isOpen, onClose, imageUrl }: Props) {
  //  Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 transition-all duration-300 animate-in fade-in">
      
      {/* Container */}
      <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-slate-300 transition p-2"
          aria-label="Close modal"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Image Backdrop (Click to close) */}
        <div 
          className="absolute inset-0 cursor-zoom-out" 
          onClick={onClose} 
        />

        {/* Large Image */}
        <img
          src={imageUrl}
          alt="Product large view"
          className="relative max-h-full max-w-full object-contain rounded shadow-2xl animate-in zoom-in-95 duration-200"
        />

      </div>
    </div>
  );
}
