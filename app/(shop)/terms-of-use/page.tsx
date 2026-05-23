// app/terms-of-use/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { termsSections } from "@/lib/legal/termsSections";

export default function TermsOfUsePage() {
  return (
    <LegalLayout
      heroTitle="Terms & Conditions"
      heroSubtitle="Customer Care"
      heroImage="/legal/terms-banner.jpg"
      intro="These Terms & Conditions govern your access to and use of the Zenfaz platform, services, products, applications, and related features. By using Zenfaz, you agree to comply with these Terms of Use and all applicable laws, policies, and regulations."
      sections={termsSections}
      tabs={legalTabs}
      activeHref="/terms-of-use"
    />
  );
}