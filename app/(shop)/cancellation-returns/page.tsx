// app/cancellation-returns/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { cancellationSections } from "@/lib/legal/cancellationSections";

export default function CancellationReturnsPage() {
  return (
    <LegalLayout
      heroTitle="Cancellation & Returns"
      heroSubtitle="Customer Care"
      heroImage="/legal/returns-banner.jpg"
      intro="Zenfaz aims to provide a smooth and transparent return experience for all customers. This policy explains our cancellation, exchange, refund, and return procedures for purchases made through our platform."
      sections={cancellationSections}
      tabs={legalTabs}
      activeHref="/cancellation-returns"
    />
  );
}