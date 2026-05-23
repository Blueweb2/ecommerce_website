// app/shipping-policy/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { shippingSections } from "@/lib/legal/shippingSections";

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      heroTitle="Shipping Policy"
      heroSubtitle="Customer Care"
      heroImage="/legal-banner.webp"
      intro="Zenfaz is committed to delivering your orders safely and efficiently. This Shipping Policy outlines delivery timelines, shipping procedures, logistics responsibilities, and important information related to order fulfillment."
      sections={shippingSections}
      tabs={legalTabs}
      activeHref="/shipping-policy"
    />
  );
}