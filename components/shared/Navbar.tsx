"use client";

import { useState, useEffect } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartUIStore } from "@/store/ui/useCartUIStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useWishlistStore } from '@/store/user/wishlist/useWishlistStore';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
});


const inter = Inter({
  subsets: ['latin'],
  weight: ['100','200','300'],
});

const messages = [
  'New arrivals, now dropping five days a week - discover now',
  'Enjoy Free Standard Delivery on orders over €400',
  "Subscribe to our emails to hear about our exclusive launches, new arrivals and more"
];

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const [index, setIndex] = useState(0);
  const { items } = useCartStore();
  const { user, loading } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const linkClass = (path: string) => {
    return (
      `whitespace-nowrap ${pathname === path ? "text-[#D4AF37] font-semibold" : "text-white hover:text-[#D4AF37]"}`
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-black fixed top-0 z-9999">

      <div className='h-8 bg-gray-300 flex items-center justify-center text-xs text-center'>
        {messages[index]}
      </div>

      <div className="max-w-[2000px] mx-auto px-4 md:px-32 py-2 md:py-4 flex items-center justify-between">

        {/* LOGO FOR MOBILE DEVICE */}
        <div className={`${playfair.className} text-2xl font-semibold tracking-wide text-white md:hidden`}>
          <Link href="/" aria-label="Go to homepage - GOLDLAND">
            FA
            <span className="script text-5xl p-0.5">zz</span>
            MI
          </Link>
        </div>

        {/* EMPTY SPACE */}
        <div className="flex-1 hidden md:block"></div>

        {/* NAV LINKS */}
        <div className='hidden md:flex flex-col items-center justify-center flex-1'>

          {/* LOGO FOR MOBILE LARGE DEVICE */}
          <div className={`${playfair.className} text-2xl font-semibold tracking-wide text-white`}>
            <Link href="/" aria-label="Go to homepage - GOLDLAND">
              FA
              <span className="script text-5xl p-0.5">zz</span>
              MI
            </Link>
          </div>

          <nav
            className={`flex items-center gap-8 text-sm ${inter.className}`}
            aria-label="Main navigation"
          >
            <Link href="/" aria-label="Go to Home page" className={linkClass("/")}>
              New In
            </Link>

            <Link
              href="/category/clothing"
              aria-label="Browse Shop products"
              className={linkClass("/category/clothing")}
            >
              Clothing
            </Link>

            <Link
              href="/category/jewelry"
              aria-label="Browse Jewelry products"
              className={linkClass("/category/jewelry")}
            >
              Jewelry
            </Link>

            <Link
              href="/category/shoes"
              aria-label="Browse Shoes products"
              className={linkClass("/category/shoes")}
            >
              Shoes
            </Link>

            <Link
              href="/category/accessories"
              aria-label="Browse Accessories products"
              className={linkClass("/category/accessories")}
            >
              Accessories
            </Link>

            <Link
              href="/sale"
              aria-label="View Sale items"
              className={linkClass("/sale")}
            >
              Sale
            </Link>
          </nav>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-4 text-white justify-end flex-1">
          <button className="transition-colors duration-300 hover:text-[#D4AF37]">
            <Search size={18} />
          </button>
          <Link
            href="/wishlist"
            className="relative transition-colors duration-300 hover:text-[#D4AF37]"
          >
            <Heart size={18} />

            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <button onClick={() => {

            if (loading) return;
            router.push(user ? "/profile" : "/login");
          }} className="transition-colors duration-300 hover:text-[#D4AF37]">
            <User size={18} />
          </button>

          <button
            onClick={openCart}
            className="relative transition-colors duration-300 hover:text-[#D4AF37]"
          >
            <ShoppingCart size={18} />

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold text-[11px] px-1.5 py-0.5 rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

    </header>
  );
};
