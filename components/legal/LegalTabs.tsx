// components/legal/LegalTabs.tsx

"use client";

import Link from "next/link";
import { LegalTab } from "../../lib/legal/types";

type Props = {
  tabs: LegalTab[];
  activeHref: string;
};

export default function LegalTabs({
  tabs,
  activeHref,
}: Props) {
  return (
    <section className="border-b border-[#ddd7d1] bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-10 overflow-x-auto px-6 py-6 md:px-20">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap border-b pb-1 text-[15px] transition ${
              activeHref === tab.href
                ? "border-black text-black"
                : "border-transparent text-[#444] hover:text-black"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </section>
  );
}