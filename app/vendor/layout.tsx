import VendorShell from "@/components/vendor-designer/VendorShell";

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorShell>{children}</VendorShell>;
}
