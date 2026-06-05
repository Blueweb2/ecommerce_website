"use client";

import { useState } from "react";
import DesignerHeader from "@/components/vendor-designer/DesignerHeader";
import DesignerSidebar from "@/components/vendor-designer/DesignerSidebar";

export default function VendorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f6f7f3]">
      <DesignerSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DesignerHeader onMenuClick={() => setMobileOpen((current) => !current)} />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
