"use client";

import { useState, useEffect } from "react";
import { Handbag } from "lucide-react";

type Products = {
  name: string;
  price: string;
  image: string;
  description: string;
  id: number;
}

const relatedProducts = [
  {
    id: 1,
    name: "GOLD HOOP EARRINGS",
    description: "Bold yet minimal starter hugg hoops",
    price: "₹11,200",
    image: "/home/categorysection/category-one.png",
  },
  {
    id: 2,
    name: "CHARM BRACELET",
    description: "Playful yet elegant charm bracelet",
    price: "₹8,700",
    image: "/home/categorysection/category-one.png",
  },
  {
    id: 3,
    name: "GEMSTONE STATEMENT PENDANT",
    description: "Vibrant centerpiece with detailing",
    price: "₹16,300",
    image: "/home/categorysection/category-one.png",
  },
  {
    id: 4,
    name: "MINIMAL GOLD BAND",
    description: "Simple and timeless everyday ring",
    price: "₹8,900",
    image: "/home/categorysection/category-one.png",
  },
  {
    id: 5,
    name: "MINIMAL GOLD BAND",
    description: "Simple and timeless everyday ring",
    price: "₹8,900",
    image: "/home/categorysection/category-one.png",
  },
];

const resentViewProducts = [
  {
    id: 1,
    name: "GOLD HOOP EARRINGS",
    description: "Bold yet minimal starter hugg hoops",
    price: "₹11,200",
    image: "/home/herosection/hero-right-top.png",
  },
  {
    id: 2,
    name: "CHARM BRACELET",
    description: "Playful yet elegant charm bracelet",
    price: "₹8,700",
    image: "/home/herosection/hero-right-top.png",
  },
  {
    id: 3,
    name: "GEMSTONE STATEMENT PENDANT",
    description: "Vibrant centerpiece with detailing",
    price: "₹16,300",
    image: "/home/herosection/hero-right-top.png",
  },
  {
    id: 4,
    name: "MINIMAL GOLD BAND",
    description: "Simple and timeless everyday ring",
    price: "₹8,900",
    image: "/home/herosection/hero-right-top.png",
  },
  {
    id: 5,
    name: "MINIMAL GOLD BAND",
    description: "Simple and timeless everyday ring",
    price: "₹8,900",
    image: "/home/herosection/hero-right-top.png",
  },
];

export default function RelatedProducts() {

  const [activeTab, setActiveTab] = useState("like");
  const [products, setProducts] = useState<Products[]>();

  useEffect(() => {
    
    switch (activeTab) {
      case "like":
        setProducts(relatedProducts)
        break;

      case "recent":
        setProducts(resentViewProducts)
        break;
    
      default:
        break;
    }
  },[activeTab, products]);

  return (
    <section className="max-w-7xl lg:mx-auto pb-10 pl-5 lg:pl-0">
      
      {/* Tabs */}
      <div className="flex justify-center gap-8 text-sm tracking-wide mt-10 lg:mt-0 mb-8">
        <button
          onClick={() => setActiveTab("like")}
          className={`pb-2 border-b ${
            activeTab === "like"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          YOU MAY ALSO LIKE
        </button>

        <button
          onClick={() => setActiveTab("recent")}
          className={`pb-2 border-b ${
            activeTab === "recent"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          RECENTLY VIEWED
        </button>
      </div>

      {/* Products */}
      <div className="flex overflow-x-auto gap-6 scrollbar-hide">
        {products?.map((item) => (
          <div key={item.id} className="group cursor-pointer flex-shrink-0 w-[150px] lg:w-[290px]">
            
            {/* Image */}
            <div className="bg-gray-100 relative">
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-full h-[150px] lg:h-[190px]"
              />

              {/* Bag Icon  */}
              <div className="absolute bottom-0 right-0 w-7 h-7 flex items-center justify-center bg-white/30 backdrop-blur-md text-white">
                  <Handbag size={16} />
                </div>
              </div>

            {/* Content */}
            <div className="mt-3">
              <h3 className="text-xs font-semibold tracking-wide">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 mt-">{item.description}</p>
              <p className="text-sm mt-2">{item.price}</p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}