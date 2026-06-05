// app/vendor/layout.tsx

import DesignerSidebar from "@/components/vendor-designer/DesignerSidebar";
import DesignerHeader from "@/components/vendor-designer/DesignerHeader";

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DesignerSidebar />

      <div className="flex-1">
        <DesignerHeader />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}