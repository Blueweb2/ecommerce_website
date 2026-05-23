// app/security/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { securitySections } from "@/lib/legal/securitySections";

export default function SecurityPage() {
  return (
    <LegalLayout
      heroTitle="Security"
      heroSubtitle="Customer Care"
      heroImage="/legal/security-banner.jpg"
      intro="At Zenfaz, we prioritize the safety and protection of our customers, payments, and personal information. Our platform uses modern security practices and continuous monitoring to help maintain a secure shopping experience."
      sections={securitySections}
      tabs={legalTabs}
      activeHref="/security"
    />
  );
}