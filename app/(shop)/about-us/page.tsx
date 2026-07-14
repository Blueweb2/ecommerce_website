import LegalLayout from "@/components/legal/LegalLayout";

import { legalTabs } from "@/lib/legal/legalTabs";
import { aboutSections } from "@/lib/legal/aboutSection";

export default function AboutUsPage() {

  return (
    <LegalLayout
      heroTitle="About Us"
      heroSubtitle="Discover Zenfaz"
      heroImage="/legal-banner.webp"
      intro="Zenfaz is an online shopping platform dedicated to providing quality products at affordable prices. We offer a wide range of categories including fashion, electronics, home appliances, accessories, sports, toys, and more. Our goal is to make online shopping simple, secure, and enjoyable by delivering reliable products, competitive prices, and excellent customer service."
      sections={aboutSections}
      tabs={legalTabs}
      activeHref="/about-us"
    />
  );
}