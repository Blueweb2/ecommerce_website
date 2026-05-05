"use client";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryAPI } from "@/lib/api/category.api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  isActive: boolean;
};

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        // Filter only top-level active categories
        const topLevel = (res.data.data || []).filter(
          (cat: Category) => !cat.parent && cat.isActive
        );
        setCategories(topLevel);
      } catch (error) {
        console.error("Failed to fetch footer categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer>
      <div className="bg-[#e7e7e7] py-12">
        <div className="max-w-[2000px] mx-auto px-4 md:px-32 grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* SHOP */}
          <div>
            <h3 className="font-brand-display mb-4 font-semibold text-neutral-600">Shop</h3>
            <ul className="font-brand-sans space-y-2 text-[11px]">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link href={`/category/${cat.slug}`} className="text-[#8D8B9D] hover:text-black transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/category/rings">Rings</Link></li>
                  <li><Link href="/category/necklaces">Necklaces</Link></li>
                  <li><Link href="/category/earrings">Earrings</Link></li>
                  <li><Link href="/category/bracelets">Bracelets</Link></li>
                </>
              )}
              <li><Link href="/collection/new-in" className="text-[#8D8B9D] hover:text-black transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-brand-display mb-4 font-semibold text-neutral-600">Support</h3>
            <ul className="font-brand-sans space-y-2 text-[11px] text-[#8D8B9D]">
              <li><Link href="#" className="hover:text-black">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:text-black">Returns & Exchanges</Link></li>
              <li><Link href="#" className="hover:text-black">FAQs</Link></li>
              <li><Link href="#" className="hover:text-black">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-black">Track Order</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-brand-display mb-4 font-semibold text-neutral-600">Company</h3>
            <ul className="font-brand-sans space-y-2 text-[11px] text-[#8D8B9D]">
              <li><Link href="#" className="hover:text-black">About Us</Link></li>
              <li><Link href="#" className="hover:text-black">Our Story</Link></li>
              <li><Link href="#" className="hover:text-black">Blog</Link></li>
              <li><Link href="#" className="hover:text-black">Careers</Link></li>
              <li><Link href="#" className="hover:text-black">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* SOCIAL + PAYMENTS */}
          <div>
            <h3 className="font-brand-display mb-4 font-semibold text-neutral-600">Follow us on</h3>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-4 mb-6 text-[#8D8B9D]">
              <Facebook size={20} className="cursor-pointer hover:text-black h-4" />
              <Instagram size={20} className="cursor-pointer hover:text-black h-4" />
              <Linkedin size={20} className="cursor-pointer hover:text-black h-4" />
              <X size={20} className="cursor-pointer hover:text-black h-4" />
              <Youtube size={20} className="cursor-pointer hover:text-black h-4" />
            </div>

            {/* PAYMENTS */}
            <p className="text-xs text-neutral-600 mb-2">We accepts</p>
            <div className="flex items-center gap-2">
              <img src="/home/footer/visa.png" alt="visa" className="h-3.5 md:h-4" />
              <img src="/home/footer/master.png" alt="mastercard" className="h-3.5 md:h-4" />
              <img src="/home/footer/apple-pay.png" alt="paypal" className="h-3.5 md:h-4" />
              <img src="/home/footer/discover.png" alt="amex" className="h-3.5 md:h-4" />
              <img src="/home/footer/maestro.png" alt="maestro" className="h-3.5 md:h-4" />
            </div>
          </div>

        </div>
      </div>

      <div className="font-brand-display bg-[#f5f5f5] px-4 py-1 text-neutral-600 md:px-32">
        <p className="max-w-[2000px] mx-auto pl-4">@ 2026 Your Brand Name All right recived</p>
      </div>
    </footer>
  );
};
