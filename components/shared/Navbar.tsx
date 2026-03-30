"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartUIStore } from "@/store/ui/useCartUIStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const linkClass = (path: string) =>
    `transition hover:text-black ${
      pathname === path ? "text-black font-semibold" : "text-gray-700"
    }`;

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 z-9999">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="text-xl font-semibold tracking-wide">
          <Link href="/" aria-label="Go to homepage - GOLDLAND">GOLDLAND</Link>
        </div>

        {/* NAV LINKS */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm"
          aria-label="Main navigation"
        >
          <Link href="/" aria-label="Go to Home page" className={linkClass("/")}>
            Home
          </Link>

          <Link
            href="/shop"
            aria-label="Browse Shop products"
            className={linkClass("/shop")}
          >
            Shop
          </Link>

          <Link
            href="/about"
            aria-label="Learn more About Us"
            className={linkClass("/about")}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            aria-label="Contact GOLDLAND"
            className={linkClass("/contact")}
          >
            Contact
          </Link>
        </nav>

        {/* ICONS */}
        <div className="flex items-center gap-4 text-gray-700">
          <button className="hover:text-black transition">
            <Search size={18} />
          </button>
          <button className="hover:text-black transition">
            <Heart size={18} />
          </button>
          <button className="hover:text-black transition" onClick={() => router.push("/login")}>
            <User size={18} />
          </button>
          <button onClick={openCart} className="hover:text-black transition relative">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
