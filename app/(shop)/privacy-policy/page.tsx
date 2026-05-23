// app/privacy-policy/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { privacySections } from "@/lib/legal/privacySections";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      heroTitle="Privacy Policy"
      heroSubtitle="Customer Care"
      heroImage="/legal/privacy-banner.jpg"
      intro="Zenfaz is committed to protecting and respecting your privacy. This Privacy Policy explains what personal data we collect, how we use that data, and how we keep your information secure while using our ecommerce platform."
      sections={privacySections}
      tabs={legalTabs}
      activeHref="/privacy-policy"
    />
  );
}