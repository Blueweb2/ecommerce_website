// components/vendor-designer/DesignerSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BadgePercent,
  Box,
  LayoutDashboard,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/designer/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/designer/products", icon: Box },
  { name: "Orders", href: "/designer/orders", icon: ShoppingBag },
  { name: "Coupons", href: "/designer/coupons", icon: BadgePercent },
  { name: "Analytics", href: "/designer/analytics", icon: BarChart3 },
  { name: "Profile", href: "/designer/profile", icon: UserRound },
];

export default function DesignerSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Designer Panel
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Designer workspace
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {menu.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="rounded-[24px] bg-[linear-gradient(135deg,#dcfce7_0%,#f8fafc_100%)] p-4">
            <p className="text-sm font-semibold text-slate-900">Quick reminder</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep low-stock pieces updated so the dashboard stays useful for fulfillment.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
