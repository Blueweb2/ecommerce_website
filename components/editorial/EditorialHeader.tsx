import Link from "next/link";

export default function EditorialHeader() {
  return (
    <header className="px-5 text-center pt-10">
      <Link href="/editorial" className="inline-block" aria-label="Editorial home">
        <span className="block font-brand-serif text-sm italic text-stone-600">Incredible Women. Incredible Fashion. Every Day.</span>
        <span className="block font-brand-display text-5xl tracking-[0.08em] text-stone-950 sm:text-7xl">EDIT</span>
      </Link>
    </header>
  );
};