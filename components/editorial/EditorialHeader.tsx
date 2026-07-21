import Link from "next/link";

export default function EditorialHeader() {
  return (
    <header className="border-y border-stone-200 bg-[#fcfbf9] px-5 py-7 text-center sm:py-10">
      <Link href="/editorial" className="inline-block" aria-label="Editorial home">
        <span className="block font-brand-sans text-[10px] font-medium uppercase tracking-[0.42em] text-stone-500">The Zenfaz</span>
        <span className="mt-1 block font-brand-display text-5xl tracking-[0.08em] text-stone-950 sm:text-7xl">EDIT</span>
        <span className="mt-2 block font-brand-serif text-sm italic text-stone-600">Style, culture and considered living</span>
      </Link>
    </header>
  );
}
