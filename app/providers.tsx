"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useDesignerAuthStore } from "@/store/designer/useDesignerAuthStore";

function CustomerAuthInit() {
  // Only mount this component (and thus run useAuthInit) for non-designer pages
  useAuthInit();
  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDesignerRoute = pathname?.startsWith("/designer");

  const hydrateDesigner = useDesignerAuthStore(
    (state) => state.hydrateDesigner
  );

  useEffect(() => {
    hydrateDesigner();
  }, [hydrateDesigner]);

  return (
    <>
      {/* Only run customer refresh-token flow on non-designer pages */}
      {!isDesignerRoute && <CustomerAuthInit />}
      {children}
    </>
  );
}