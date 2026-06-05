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
import { getDesigners } from "@/lib/api/designer.api";
import { authApi } from '@/lib/api/auth.api';

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
  const [designers, setDesigners] = useState<any[]>([]);
  const [activeMenu, setActiveMenu] = useState<{
    type: "category" | "designer" | null;
    id?: string;
  }>({
    type: null,
  }); const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isProductPage = pathname.startsWith("/product");

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
    const fetchDesigners = async () => {
      try {
        const res = await getDesigners({
          isActive: true,
        });

        setDesigners(res || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDesigners();
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
  const { logout } = useAuthStore();


  // navbar hide and show during the scroll time
  useEffect(() => {

    if (isProductPage) {
      setShowNavbar(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Before 300px always show
      if (currentScrollY < 130) {
        setShowNavbar(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // After 300px
      if (currentScrollY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isProductPage]);

  return (
    <header
      className={`w-full bg-black z-[9999]
        transition-all duration-300 ease-in-out origin-top
        ${isProductPage ? "relative" : "fixed top-0"}
        ${showNavbar
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0 -translate-y-2"
        }
      `}
    >

      <div className='h-8 bg-[#f0f0f0] flex items-center justify-center text-xs text-center'>
        {messages[index]}
      </div>

      <div className="w-full mx-auto px-4 md:px-32 py-2 lg:pb-0 md:pt-4 flex items-center md:items-start justify-between">

        {/* LOGO FOR MOBILE DEVICE */}
        <Link href="/">
          <div className="font-brand-serif text-2xl font-semibold tracking-wide text-white lg:hidden">
            <img
              src="/home/navigation/zenfaz.svg"
              alt="logo"
              className="h-4 mb-2 mt-3"
            />
          </div>
        </Link>

        {/* EMPTY SPACE */}
        <div className="flex-1 hidden lg:block"></div>

        {/* NAV LINKS */}
        <div className='hidden lg:flex flex-col items-center justify-center flex-1'>

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
            className="relative flex items-center gap-8 font-brand-sans text-sm tracking-[1.5px] text-white"
            onMouseLeave={() =>
              setActiveMenu({
                type: null,
              })
            }
          >
            {/* NEW IN */}
            <Link
              href="/new-in"
              className={linkClass("/new-in")}
            >
              New In
            </Link>

            {/* DESIGNERS */}

            <Link
              onMouseEnter={() =>
                setActiveMenu({
                  type: "designer",
                })
              }
              href="/designers"
              className={linkClass("/designers")}
            >
              Designers
            </Link>


            {/* DYNAMIC CATEGORIES */}
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className={linkClass(`/category/${cat.slug}`)}
                onMouseEnter={() =>
                  setActiveMenu({
                    type: "category",
                    id: cat._id,
                  })
                }
              >
                {cat.name}
              </Link>
            ))}

            {/* SALE */}
            <Link
              href="/sale"
              className={linkClass("/sale")}
            >
              Sale
            </Link>

            {/* CATEGORY DROPDOWN */}
            {activeMenu.type === "category" && (
              <div
                className="absolute left-1/2 top-full z-50 w-screen -translate-x-1/2 border-t border-gray-200 bg-white py-10 text-black shadow-2xl"
                onMouseEnter={() =>
                  setActiveMenu(activeMenu)
                }
                onMouseLeave={() =>
                  setActiveMenu({
                    type: null,
                  })
                }
              >
                <div className="mx-auto max-w-[1300px] px-10">
                  {categories
                    .filter(
                      (cat: any) => cat._id === activeMenu.id
                    )
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
                        <div className="grid grid-cols-2 gap-x-16 gap-y-10 md:grid-cols-4">
                          {cat.children?.map((sub: any) => (
                            <div
                              key={sub._id}
                              className="space-y-3"
                            >
                              {/* SUBCATEGORY */}
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
                                    className="text-sm text-gray-600 transition-colors hover:text-black"
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

            {/* DESIGNER DROPDOWN */}
            {activeMenu.type === "designer" && (
              <div
                className="absolute left-1/2 top-full z-50 w-screen -translate-x-1/2 border-t border-gray-200 bg-white py-10 text-black shadow-2xl"
                onMouseEnter={() =>
                  setActiveMenu({
                    type: "designer",
                  })
                }
                onMouseLeave={() =>
                  setActiveMenu({
                    type: null,
                  })
                }
              >
                <div className="mx-auto grid max-w-[1300px] grid-cols-4 gap-16 px-10">

                  <div>
                    <h3 className="mb-6 text-lg font-semibold tracking-wider hover:underline">
                      DESIGNERS
                    </h3>

                    <div className="space-y-4">
                      {designers
                        .filter((designer) => designer.isFavorite)
                        .slice(0, 6)
                        .map((designer) => (
                          <Link
                            key={designer._id}
                            href={`/designers/${designer.slug}`}
                            className="block text-sm font-semibold uppercase tracking-wide text-black hover:text-gray-600"
                          >
                            {designer.name}
                          </Link>
                        ))}
                    </div>
                  </div>
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
              <span className="absolute -top-2 -right-2 bg-[#656565] text-white text-[10px] px-1 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => user && setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <button
              onClick={() => {
                if (loading) return;

                router.push(user ? "/account" : "/account/login");
              }}
              className="transition-colors duration-300 hover:text-[#D4AF37]"
            >
              <User size={18} />
            </button>

            {user && showAccountMenu && (
              <div className="absolute right-0 top-[35px] z-[9999] w-[320px] bg-white text-black shadow-2xl border border-black/10">
                {/* Triangle */}
                <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 bg-white border-l border-t border-black/10" />

                {/* Header */}
                <div className="px-8 pt-8 pb-6">
                  <p className="text-[24px] tracking-[3px] uppercase">
                    Hi {user.name}
                  </p>
                </div>

                <div className="border-t border-black/10" />

                {/* Links */}
                <div className="px-8 py-6 flex flex-col gap-5 text-[15px]">
                  <Link href="/account/orders">My Orders</Link>

                  <Link href="/wishlist">Wish List</Link>

                  <Link href="/account/address">
                    Address Book
                  </Link>

                  <Link href="/account/preferences">
                    Preferences
                  </Link>

                
                </div>

                <div className="border-t border-black/10 mx-8" />

                <div className="p-8">
                  <button
                    onClick={logout}
                    className="
            w-full
            h-[48px]
            border
            border-black
            text-[15px]
            transition
            hover:bg-black
            hover:text-white
          "
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={openCart}
            className="relative transition-colors duration-300 hover:text-[#D4AF37]"
          >
            <ShoppingCart size={18} />

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-[#656565] text-white font-bold text-[11px] px-1.5 py-0.5 rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

    </header>
  );
};
