"use client";

import Link from "next/link";
import {
  BookOpen,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  Package,
  ShoppingCart,
  Tag,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth/useAuthStore";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const menu = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Tag,
    },
    {
      name: "Collections",
      href: "/admin/collections",
      icon: LayoutGrid,
    },
    {
      name: "Banners",
      href: "/admin/banners",
      icon: ImageIcon,
    },
    {
      name: "Stories",
      href: "/admin/stories",
      icon: BookOpen,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
    },
    ...(user?.role === "superadmin"
      ? [
          {
            name: "Admins",
            href: "/admin/admins",
            icon: UserCog,
          },
        ]
      : []),
    {
      name: "Profile",
      href: "/admin/profile",
      icon: User,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1a1f1a] p-4 text-white">
      <h1 className="mb-8 text-xl font-bold">Admin Panel</h1>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg p-3 transition ${
                active ? "bg-green-600" : "hover:bg-[#2a2f2a]"
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
