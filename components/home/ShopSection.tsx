"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Products = {
  name: string;
  price: string;
  image: string;
  description: string;
}

const tabs = ["Featured", "Best Sellers", "Top Rated"];

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
  {
    name: "CLASSIC TENNIS BRACELET",
    price: "₹22,800",
    image: "/home/shopsection/shop.png",
    description:
      "A refined bracelet with a continuous line of brilliance, perfect for any occasion.",
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
  {
    name: "CLASSIC TENNIS BRACELET",
    price: "₹22,800",
    image: "/home/shopsection/shop.png",
    description:
      "A refined bracelet with a continuous line of brilliance, perfect for any occasion.",
  },
];

export default function ShopSection() {

  const [activeTab, setActiveTab] = useState("Featured");
  const [products, setProducts] = useState<Products[]>();

  useEffect(()=>{
    switch (activeTab) {

      case "Featured":
        setProducts(featuredProducts)
        break;

      case "Best Sellers":
        setProducts(bestSellers)
        break;

      case "Top Rated":
        setProducts(topRated)
        break;

      default:
        break;
    };
  },[activeTab, products]);

  return (
    <section className="bg-[#f5f5f5] pt-6 md:pt-0 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold mb-6 border-t-2 border-gray-300 pt-8">
          Shop Fazzmi
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
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth">

          {products?.map((product, index) => (
            <div
              key={index}
              className="w-[200px] md:w-[250px] flex flex-col justify-between flex-shrink-0 rounded-xl"
            >
              {/* IMAGE */}
              <Link
                href="/product/3"
                className="flex justify-center mb-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 md:h-60 object-contain w-full"
                />
              </Link>

              {/* CONTENT */}
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3 h-[45px]">
                  {product.description}
                </p>
                <p className="text-sm font-medium mb-4">
                  {product.price}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};