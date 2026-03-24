"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Type } from "lucide-react";
import { useRef } from "react";

type Products = {
  name: string;
  price: string;
  image: string;
  description: string;
}

const tabs = ["Featured", "Best Sellers", "New Arrivals", "Top Rated"];

const featuredProducts = [
  {
    name: "DIAMOND HALO RING",
    price: "₹18,999",
    image: "/home/shopsection/shop.png",
    description:
      "A timeless halo design featuring a brilliant center stone, crafted for elegant everyday wear.",
  },
  {
    name: "GOLD PENDANT NECKLACE",
    price: "₹9,499",
    image: "/home/shopsection/shop.png",
    description:
      "A delicate gold pendant designed to add subtle sophistication to any outfit.",
  },
  {
    name: "EMERALD DROP EARRINGS",
    price: "₹14,250",
    image: "/home/shopsection/shop.png",
    description:
      "Vibrant emerald stones paired with fine detailing for a graceful, eye-catching look.",
  },
  {
    name: "CLASSIC TENNIS BRACELET",
    price: "₹22,800",
    image: "/home/shopsection/shop.png",
    description:
      "A refined bracelet with a continuous line of brilliance, perfect for any occasion.",
  },
];

const bestSellers = [
  {
    name: "ROSE GOLD HEART RING",
    price: "₹12,999",
    image: "/home/shopsection/shop-one.png",
    description:
      "A romantic heart-shaped ring crafted in rose gold, loved by many for its charm.",
  },
  {
    name: "SILVER CHARM BRACELET",
    price: "₹6,750",
    image: "/home/shopsection/shop-one.png",
    description:
      "A stylish charm bracelet designed for everyday elegance and personalization.",
  },
  {
    name: "PEARL STUD EARRINGS",
    price: "₹5,499",
    image: "/home/shopsection/shop-one.png",
    description:
      "Classic pearl studs that never go out of style, perfect for all occasions.",
  },
  {
    name: "GOLD LAYERED NECKLACE",
    price: "₹11,200",
    image: "/home/shopsection/shop-one.png",
    description:
      "A trendy layered necklace that adds depth and style to your outfit.",
  },
];

const newArrivals = [
  {
    name: "MINIMALIST BAR NECKLACE",
    price: "₹7,999",
    image: "/home/shopsection/shop-two.png",
    description:
      "A sleek and modern bar necklace designed for a clean, minimal look.",
  },
  {
    name: "TWISTED GOLD HOOPS",
    price: "₹8,499",
    image: "/home/shopsection/shop-two.png",
    description:
      "Unique twisted hoop earrings that bring a fresh take on a classic style.",
  },
  {
    name: "SAPPHIRE STATEMENT RING",
    price: "₹19,999",
    image: "/home/shopsection/shop-two.png",
    description:
      "A bold sapphire ring designed to stand out with elegance and color.",
  },
  {
    name: "CRYSTAL CHAIN BRACELET",
    price: "₹6,299",
    image: "/home/shopsection/shop-two.png",
    description:
      "A lightweight bracelet with sparkling crystals for a modern touch.",
  },
];

const topRated = [
  {
    name: "PLATINUM BAND RING",
    price: "₹25,500",
    image: "/home/shopsection/shop-three.png",
    description:
      "A premium platinum band known for durability and timeless appeal.",
  },
  {
    name: "DIAMOND STUD EARRINGS",
    price: "₹21,000",
    image: "/home/shopsection/shop-three.png",
    description:
      "Highly rated diamond studs with unmatched brilliance and clarity.",
  },
  {
    name: "LUXURY TENNIS NECKLACE",
    price: "₹35,999",
    image: "/home/shopsection/shop-three.png",
    description:
      "A stunning tennis necklace crafted for high-end elegance.",
  },
  {
    name: "GOLD CUFF BRACELET",
    price: "₹13,750",
    image: "/home/shopsection/shop-three.png",
    description:
      "A bold cuff bracelet with a modern finish, loved by customers.",
  },
];

export default function ShopSection() {

  const [activeTab, setActiveTab] = useState("Featured");
  const [products, setProducts] = useState<Products[]>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    switch (activeTab) {

      case "Featured":
        setProducts(featuredProducts)
        break;

      case "Best Sellers":
        setProducts(bestSellers)
        break;

      case "New Arrivals":
        setProducts(newArrivals)
        break;

      case "Top Rated":
        setProducts(topRated)
        break;

      default:
        break;
    };
  },[activeTab, products])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;

      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    };
  };

  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold mb-6">
          Shop GOLDLAND
        </h2>

        {/* TABS */}
        <div className="flex justify-center gap-6 mb-10 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 border-b transition ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth" ref={scrollRef}>

          {products?.map((product, index) => (
            <div
              key={index}
              className="bg-white w-[300px] h-full flex flex-col justify-between flex-shrink-0 rounded-xl p-5 border border-gray-300 "
            >
              {/* IMAGE */}
              <div className="flex justify-center mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 object-contain"
                />
              </div>

              {/* CONTENT */}
              <div className="text-center">
                <h3 className="text-sm font-semibold mb-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {product.description}
                </p>
                <p className="text-sm font-medium mb-4">
                  {product.price}
                </p>

                <button
                  className="w-full py-2 rounded-md text-sm transition text-black
                   hover:bg-black hover:text-white bg-gray-100 transition-all duration-300 ease-in-out"
                >
                  SHOP NOW
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* BOTTOM ARROWS */}
        <div className="flex justify-center gap-3 mt-8">
          <button 
            className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition"
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition"
            onClick={() => scroll("right")}
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};