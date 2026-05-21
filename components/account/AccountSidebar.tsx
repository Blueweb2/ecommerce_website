"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  {
    label: "My Account",
    href: "/account",
  },
  {
    label: "Rewards Program",
    href: "/account/rewards",
  },
  {
    label: "My Orders",
    href: "/account/orders",
  },
  {
    label: "Wish List",
    href: "/wishlist",
  },
  {
    label: "Account Details",
    href: "/account/details",
  },
  {
    label: "Address Book",
    href: "/account/addresses",
  },
  {
    label: "Card Wallet",
    href: "/account/wallet",
  },
  {
    label: "Preferences",
    href: "/account/preferences",
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-[260px]">
      <nav className="space-y-5">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 text-[15px] transition",
                active
                  ? "text-black"
                  : "text-[#555] hover:text-black"
              )}
            >
              <span
                className={clsx(
                  "h-5 w-[2px]",
                  active
                    ? "bg-black"
                    : "bg-transparent"
                )}
              />

              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}