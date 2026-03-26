"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingCart } from "lucide-react";

export default function Navbar() {

  const pathname = usePathname();

  const linkClass = (path: string) =>
    `transition hover:text-black ${
      pathname === path ? "text-black font-semibold" : "text-gray-700"
    }`;

  return (
    <header className="w-full border-b border-gray-200 bg-white">
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
          <button className="hover:text-black transition">
            <User size={18} />
          </button>
          <button className="hover:text-black transition">
            <ShoppingCart size={18} />
          </button>
        </div>

      </div>
    </header>
  );
};
