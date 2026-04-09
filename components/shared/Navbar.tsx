"use client";

import { Poppins } from 'next/font/google';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartUIStore } from "@/store/ui/useCartUIStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const linkClass = (path: string) => {
    return (
      `${ pathname === path ? "text-[#D4AF37] font-semibold" : "text-white hover:text-[#D4AF37]"}`
    );
  };


  return (
    <header className="w-full bg-black fixed top-0 z-9999">
      <div className="max-w-[2000px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
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
            New In
          </Link>

          <Link
            href="/shop"
            aria-label="Browse Shop products"
            className={linkClass("/shop")}
          >
            Clothing
          </Link>

          <Link
            href="/about"
            aria-label="Learn more About Us"
            className={linkClass("/about")}
          >
            Jewelry
          </Link>

          <Link
            href="/contact"
            aria-label="Contact GOLDLAND"
            className={linkClass("/contact")}
          >
            Shoes
          </Link>

          <Link
            href="/about"
            aria-label="Learn more About Us"
            className={linkClass("/about")}
          >
            Accessories
          </Link>

          <Link
            href="/about"
            aria-label="Learn more About Us"
            className={linkClass("/about")}
          >
            Sale
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
          <button onClick={openCart} className="transition-colors duration-300 hover:text-[#D4AF37]">
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
