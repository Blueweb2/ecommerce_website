// app/consumer-policy/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { consumerSections } from "@/lib/legal/consumerSections";

export default function ConsumerPolicyPage() {
  return (
    <LegalLayout
      heroTitle="Consumer Policy"
      heroSubtitle="Customer Care"
      heroImage="/legal-banner.webp"
      intro="Zenfaz is committed to maintaining transparency, fairness, and trust in every shopping experience. This Consumer Policy outlines customer rights, platform responsibilities, and important guidelines for using our ecommerce services."
      sections={consumerSections}
      tabs={legalTabs}
      activeHref="/consumer-policy"
    />
  );
}