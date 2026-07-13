import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { careerSections } from "@/lib/legal/careers";

export default function CareersPage() {

  return (
    <LegalLayout
      heroTitle="Careers"
      heroSubtitle="Join the Zenfaz Team"
      heroImage="/legal-banner.webp"
      intro="At Zenfaz, we believe our people are our greatest strength. We're always looking for passionate, creative, and motivated individuals who want to help build a better online shopping experience. Join us and grow your career in a collaborative and innovative environment."
      sections={careerSections}
      tabs={legalTabs}
      activeHref="/careers"
    />
  );
}