"use client";

export default function ViewMoreButton({ onClick, label = "View more" }: { onClick?: () => void; label?: string }) {
  return <button type="button" onClick={onClick} className="border border-stone-900 px-7 py-3 font-brand-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-900 transition-colors hover:bg-stone-900 hover:text-white">{label}</button>;
}
