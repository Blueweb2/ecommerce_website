"use client";

import { Facebook, Linkedin, Link2, Twitter } from "lucide-react";

export default function StoryShareButtons() {
  const url =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
        Share this story
      </span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook size={18} />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter size={18} />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Linkedin size={18} />
      </a>

      <button onClick={handleCopyLink}>
        <Link2 size={18} />
      </button>
    </div>
  );
}