"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  Gift,
  Package,
  Heart,
  User,
  MapPin,
  CreditCard,
  ChevronRight,
} from "lucide-react";

import { bodoni, inter } from "@/lib/fonts";
import { useAuthStore } from "@/store/auth/useAuthStore";

const accountCards = [
  {
    title: "Rewards Program",
    description:
      "Gain access to exclusive rewards and experiences",
    icon: Gift,
    href: "/account/rewards",
  },
  {
    title: "My Orders",
    description:
      "Track the progress of your order, or arrange an exchange or return",
    icon: Package,
    href: "/account/orders",
  },
  {
    title: "Wish List",
    description:
      "Add your favorite items to keep track of their availability and purchase later",
    icon: Heart,
    href: "/wishlist",
  },
  {
    title: "Account Details",
    description:
      "View or change your sign-in information",
    icon: User,
    href: "/account/details",
  },
  {
    title: "Address Book",
    description:
      "Manage your billing or delivery address",
    icon: MapPin,
    href: "/account/addresses",
  },
  {
    title: "Card Wallet",
    description:
      "View and manage your payment methods",
    icon: CreditCard,
    href: "/account/wallet",
  },
];

export default function AccountPage() {
  const router = useRouter();

  const { user, isAuthenticated, initialized } = useAuthStore();

  // 🔒 PROTECT PAGE
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [initialized, isAuthenticated, router]);

  // ⏳ Prevent flash before redirect
  if (!initialized || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-[#f5f5f3] ${inter.className}`}>

      {/* HERO */}
      <section className="relative h-[320px] overflow-hidden">

        {/* BACKGROUND */}
        <Image
          src="/sale-banner.jpg"
          alt="Luxury background"
          fill
          priority
          className="object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/20" />

        {/* CONTENT */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center text-white">

            <p className="mb-4 text-[12px] uppercase tracking-[0.35em] text-white/80">
              My Account
            </p>

            {/* ✅ LOGGED USER NAME */}
            <h1
              className={`text-[56px] font-light tracking-tight ${bodoni.className}`}
            >
              Welcome {user.name}
            </h1>

          </div>
        </div>
      </section>

      {/* ACCOUNT GRID */}
      <section className="mx-auto max-w-[1250px] px-6 py-20">

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {accountCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group border border-[#e3e3e3] bg-white p-10 transition hover:border-black"
              >
                {/* ICON */}
                <div className="mb-8 flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e5e5e5]">
                    <Icon className="h-5 w-5 text-black" />
                  </div>

                  <ChevronRight className="h-5 w-5 text-[#999] transition group-hover:translate-x-1 group-hover:text-black" />
                </div>

                {/* TITLE */}
                <h3
                  className={`text-[34px] leading-none text-black ${bodoni.className}`}
                >
                  {card.title}
                </h3>

                {/* LINE */}
                <div className="my-8 h-px bg-[#ececec]" />

                {/* DESCRIPTION */}
                <p className="text-[13px] leading-7 text-[#666]">
                  {card.description}
                </p>
              </Link>
            );
          })}

        </div>

      </section>
    </div>
  );
}
