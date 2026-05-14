"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartUIStore } from "@/store/ui/useCartUIStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useWishlistStore } from '@/store/user/wishlist/useWishlistStore';
import { categoryAPI } from "@/lib/api/category.api";

type Category = {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
};

const messages = [
  "Discover the latest ZENFAZ collections crafted for modern style",
  "Enjoy Free Standard Delivery on all ZENFAZ orders over ₹40,000",
  "Subscribe to ZENFAZ updates for exclusive drops and new arrivals"
];

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const [index, setIndex] = useState(0);
  const { items } = useCartStore();
  const { user, loading } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const linkClass = (path: string) => {
    return `whitespace-nowrap border-b-2 transition-all duration-200 pb-3 ${pathname === path
      ? "text-white border-white"
      : "text-white border-transparent hover:border-white"
      }`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getTree();
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // navbar hide and show during the scroll time
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling DOWN = hide navbar
        setShowNavbar(false);
      } else {
        // scrolling UP = show navbar
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`w-full bg-black fixed top-0 z-9999 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >

      <div className='h-8 bg-gray-300 flex items-center justify-center text-xs text-center'>
        {messages[index]}
      </div>

      <div className="w-full mx-auto px-4 md:px-32 py-2 lg:pb-0 md:pt-4 flex items-center md:items-start justify-between">

        {/* LOGO FOR MOBILE DEVICE */}
        <Link href="/">
          <div className="font-brand-serif text-2xl font-semibold tracking-wide text-white md:hidden">
            <img
              src="/home/navigation/zenfaz.svg"
              alt="logo"
              className="h-4 mb-2 mt-3"
            />
          </div>
        </Link>

        {/* EMPTY SPACE */}
        <div className="flex-1 hidden md:block"></div>

        {/* NAV LINKS */}
        <div className='hidden md:flex flex-col items-center justify-center flex-1'>

          {/* LOGO FOR LARGE DEVICE */}
          <Link href="/">
            <div className="font-brand-serif mb-5 cursor-pointer text-3xl font-semibold tracking-wide text-white">
              <img
                src="/home/navigation/zenfaz.svg"
                alt="logo"
                className="h-7 mb-2 mt-3"
              />
            </div>
          </Link>

          <nav
            className="relative font-brand-sans flex items-center gap-8 text-sm tracking-[1.5px] text-white"
            onMouseLeave={() => setActiveCategory(null)}
          >
            {/* NEW IN */}
            <Link href="/new-in" className={linkClass("/new-in")}>
              New In
            </Link>

            {/* DYNAMIC CATEGORIES */}
            {categories.map((cat: any) => (
          
               <Link href={`/category/${cat.slug}`} className={linkClass(`/category/${cat.slug}`)}  onMouseEnter={() => setActiveCategory(cat._id)} key={cat._id}>
                 {cat.name}
              </Link>
            ))}

            {/* SALE */}
            <Link href="/sale" className={linkClass("/sale")}>
              Sale
            </Link>

            {/* GLOBAL DROPDOWN */}
            {activeCategory && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-white text-black shadow-2xl border-t border-gray-200 z-50 py-10"
                onMouseEnter={() => setActiveCategory(activeCategory)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="max-w-[1300px] mx-auto px-10">
                  {categories
                    .filter((cat: any) => cat._id === activeCategory)
                    .map((cat: any) => (
                      <div key={cat._id}>

                        {/* MAIN CATEGORY TITLE */}
                        <div className="mb-8">
                          <Link
                            href={`/category/${cat.slug}`}
                            className="text-lg font-semibold uppercase tracking-wider hover:underline"
                          >
                            {cat.name}
                          </Link>
                        </div>

                        {/* SUBCATEGORY GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-10">
                          {cat.children?.map((sub: any) => (
                            <div key={sub._id} className="space-y-3">

                              {/* SUB CATEGORY */}
                              <Link
                                href={`/category/${sub.slug}`}
                                className="block text-sm font-semibold uppercase tracking-wide text-black hover:text-gray-600"
                              >
                                {sub.name}
                              </Link>

                              {/* CHILD CATEGORIES */}
                              <div className="flex flex-col gap-2">
                                {sub.children?.map((child: any) => (
                                  <Link
                                    key={child._id}
                                    href={`/category/${child.slug}`}
                                    className="text-sm text-gray-600 hover:text-black transition-colors"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-6 text-white justify-end flex-1 md:mt-5">
          <button
            className="font-brand-sans flex items-center justify-center gap-x-1.5 text-[13px] text-sm transition-colors duration-300 hover:text-[#D4AF37]"
          >
            <Search size={18} /> Search
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
