"use client";

import { usePathname } from "next/navigation";
import VendorShell from "@/components/vendor-designer/VendorShell";

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/designer/login") {
    return <>{children}</>;
  }

  return <VendorShell>{children}</VendorShell>;
}
