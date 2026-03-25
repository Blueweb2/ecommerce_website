"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Tag, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-[#1a1f1a] text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">Admin Panel</h1>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                active
                  ? "bg-green-600"
                  : "hover:bg-[#2a2f2a]"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
