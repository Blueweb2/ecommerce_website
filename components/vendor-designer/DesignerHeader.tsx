"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Plus, UserRound } from "lucide-react";
import Image from "next/image";
import {
  clearVendorSession,
  useVendorSessionPreview,
} from "@/lib/vendor/auth";
import { useDesignerAuthStore } from "@/store/designer/useDesignerAuthStore";

interface DesignerHeaderProps {
  onMenuClick?: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  orders: "Orders",
  promocodes: "Promo Codes",
  // analytics: "Analytics",
  profile: "Profile",
};

export default function DesignerHeader({
  onMenuClick,
}: DesignerHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const preview = useVendorSessionPreview();

  const logoutDesigner = useDesignerAuthStore((state) => state.logout);

  const pageTitle = useMemo(() => {
    const segment = pathname.split("/")[2];
    return PAGE_TITLES[segment] || "Vendor workspace";
  }, [pathname]);

  const handleLogout = () => {
    logoutDesigner();
    router.push("/designer/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Vendor Workspace
            </p>
            <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/designer/products/create"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>

          <Link
            href="/designer/profile"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <UserRound className="h-4 w-4" />
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/designer/profile"
            className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-100"
          >
            <Image
              src="/avatar-placeholder.png"
              alt="Designer"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />

            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-slate-800">
                {preview.brandName || preview.name || "Designer"}
              </p>
              <p className="text-xs text-slate-500">
                {preview.email || "Vendor account"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
