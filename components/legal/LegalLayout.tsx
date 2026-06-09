"use client";

import LegalHero from "./LegalHero";
import LegalTabs from "./LegalTabs";
import LegalAccordion from "./LegalAccordion";
import LegalSidebar from "./LegalSidebar";
import { LegalSection, LegalTab } from "../../lib/legal/types";

type Props = {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage: string;
  intro: string;
  sections: LegalSection[];
  tabs: LegalTab[];
  activeHref: string;
};

export default function LegalLayout({
  heroTitle,
  heroSubtitle,
  heroImage,
  intro,
  sections,
  tabs,
  activeHref,
}: Props) {
  return (
    <main className="min-h-screen bg-[#f6f4f1] text-[#111111]">
      <LegalHero
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
      />

      <LegalTabs
        tabs={tabs}
        activeHref={activeHref}
      />

      <section className="mx-auto max-w-[1600px] px-6 py-3 md:py-6 lg:py-10 md:px-20">
        <div className="grid gap-20 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}
          <div>
            <div className="max-w-4xl">
              <p className="text-[16px] md:text-[20px] text-[#222]">
                {intro}
              </p>
            </div>

            <LegalAccordion sections={sections} />
          </div>

          {/* RIGHT */}
          <LegalSidebar sections={sections} />
        </div>
      </section>
    </main>
  );
}