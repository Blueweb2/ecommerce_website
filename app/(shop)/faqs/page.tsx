// app/faqs/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { faqSections } from "@/lib/legal/faqSections";

export default function FAQsPage() {
  return (
    <LegalLayout
      heroTitle="Frequently Asked Questions"
      heroSubtitle="Customer Care"
      heroImage="/legal/faqs-banner.jpg"
      intro="Find answers to the most commonly asked questions about orders, payments, shipping, returns, accounts, and platform services at Zenfaz."
      sections={faqSections}
      tabs={legalTabs}
      activeHref="/faqs"
    />
  );
}