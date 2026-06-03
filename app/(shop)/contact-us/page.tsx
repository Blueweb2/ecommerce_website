import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { contactSections } from "@/lib/legal/contactSections";

export default function ContactUsPage() {
  return (
    <LegalLayout
      heroTitle="Contact Us"
      heroSubtitle="Customer Care"
      heroImage="/legal-banner.webp"
      intro="Our Customer Care team is here to assist you with orders, deliveries, returns, payments, account-related questions, and any other enquiries. We aim to provide prompt and helpful support to ensure the best shopping experience."
      sections={contactSections}
      tabs={legalTabs}
      activeHref="/contact-us"
    />
  );
}