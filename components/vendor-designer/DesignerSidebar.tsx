// components/vendor-designer/DesignerSidebar.tsx

"use client";

import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/vendor/dashboard" },
  { name: "Products", href: "/vendor/products" },
  { name: "Orders", href: "/vendor/orders" },
  { name: "Promo Codes", href: "/vendor/promocodes" },
  { name: "Customers", href: "/vendor/customers" },
  { name: "Analytics", href: "/vendor/analytics" },
  { name: "Profile", href: "/vendor/profile" },
  { name: "Settings", href: "/vendor/settings" },
];

export default function DesignerSidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-5 border-b">
        <h2 className="font-bold text-xl">
          Designer Panel
        </h2>
      </div>

      <nav className="p-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block py-3 px-4 rounded-lg hover:bg-gray-100"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}