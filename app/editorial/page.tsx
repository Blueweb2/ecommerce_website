import type { Metadata } from "next";
import EditorialExperience from "@/components/editorial/EditorialExperience";

export const metadata: Metadata = {
  title: "The Zenfaz Edit | Editorial",
  description: "The Zenfaz Edit: fashion, beauty, culture and considered living.",
  alternates: { canonical: "/editorial" },
  openGraph: { title: "The Zenfaz Edit | Editorial", description: "Fashion, beauty, culture and considered living.", type: "website", url: "/editorial" },
};

export default function EditorialPage() { return <EditorialExperience />; }
