// app/payment/page.tsx

import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { paymentSections } from "@/lib/legal/paymentSections";

export default function PaymentPage() {
  return (
    <LegalLayout
      heroTitle="Payment Policy"
      heroSubtitle="Customer Care"
      heroImage="/legal/payment-banner.jpg"
      intro="Zenfaz provides secure and reliable payment options to ensure a smooth shopping experience. This Payment Policy explains accepted payment methods, transaction processing, billing responsibilities, and payment security practices."
      sections={paymentSections}
      tabs={legalTabs}
      activeHref="/payment"
    />
  );
}