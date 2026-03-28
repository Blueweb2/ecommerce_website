"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (path: string) => {
    return (
      `${ pathname === path ? "text-[#D4AF37] font-semibold" : "text-white hover:text-[#D4AF37]"}`
    );
  };


  return (
    <header className="w-full bg-black fixed top-0 z-9999">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="text-xl font-semibold tracking-wide text-white">
          <Link href="/" aria-label="Go to homepage - GOLDLAND">FAZZMI</Link>
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
        <div className="flex items-center gap-4 text-white">
          <button className="transition-colors duration-300 hover:text-[#D4AF37]">
            <Search size={18} />
          </button>
          <button className="transition-colors duration-300 hover:text-[#D4AF37]">
            <Heart size={18} />
          </button>
          <button onClick={() => router.push("/login")} className="transition-colors duration-300 hover:text-[#D4AF37]">
            <User size={18} />
          </button>
          <button className="transition-colors duration-300 hover:text-[#D4AF37]">
            <ShoppingCart size={18} />
          </button>
        </div>

      </div>
    </header>
  );
};
