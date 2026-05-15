"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { bodoni } from "@/lib/fonts";

export default function WishlistPage() {
  
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading || !user) return null;

  const username = user?.name
    ? `${user.name.split(" ")[0]}'s`
    : "My";

  return (
    <section className="w-full mt-14 md:mt-32">
      <div className="max-[2000] mx-auto py-10 mt-3  md:mt-20 px-4 md:px-32">
        <h1 className={`${bodoni.className} mb-3 text-[clamp(25px,2.5vw,32px)] font-normal tracking-tight text-neutral-600`}>
          {username} Wishlist
        </h1>

        <WishlistGrid />
      </div>
    </section>
  );
}