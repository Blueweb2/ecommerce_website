"use client";

import { useState, useEffect } from "react";
import { Heart, ChevronDown } from "lucide-react";

const rightBottomSection = [
  {
    title: "SIZE & FIT",
    content: "Free delivery within 3-5 business days. Easy returns available.",
  },
  {
    title: "DELIVERY AND RETURNS",
    content: "This pendant features a romantic design with a delicate chain.",
  },
  {
    title: "RATING AND REVIEWS",
    content: "Premium quality, lightweight, skin-friendly, long-lasting shine.",
  },
];

const productDescription = 'Crafted with precision and attention to detail, this diamond halo ring features a stunning center stone surrounded by a delicate halo of smaller diamonds. The elegant band enhances its brilliance, making it a perfect choice for engagements, celebrations, or everyday luxury.'

const keyFeatures = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ipsam culpa saepe accusamus tempore itaque minima rerum maiores officia officiis recusandae velit, quos vero libero sapiente autem voluptatum mollitia at?'

const productDetails = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis vel consectetur nihil ex aspernatur obcaecati quae iure necessitatibus, dolorum, laudantium deleniti repellat repudiandae alias, sapiente ipsum fugit eum dicta rem.'

const RightSide = () => {

  const [selectedSize, setSelectedSize] = useState<string>();
  const [activeTab, setActiveTab] = useState("PRODUCT DESCRIPTION");
  const [tabDetails, setTabDetails] = useState<string>();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // product description, features and details change content
  useEffect(()=>{
    switch (activeTab) {

      case "PRODUCT DESCRIPTION":
        setTabDetails(productDescription)
        break;

      case "KEY FEATURES":
        setTabDetails(keyFeatures)
        break;

      case "DELIVERY DETAILS":
        setTabDetails(productDetails)
        break;

      default:
        break;
    };
  },[activeTab, tabDetails]);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="h-fit lg:sticky top-20 space-y-6 text-sm mx-4 lg:mx-10 mt-32 md:mt-[300px] lg:mt-0">

      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif">
          Diamond Halo Ring
        </h1>

        <div className="flex gap-4 text-xs text-gray-600 mt-2">
          <span>• Lorem, ipsum dolor sit amet consectetur adipisicing elit.</span>
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xl font-semibold">₹24,500</p>
        <p className="text-xs text-gray-600 mt-1">color: <span className="text-black">sky blue</span></p>
      </div>

      {/* Size */}
      <div>
        <p className="text-xs text-gray-500 mb-2">SELECT SIZE:</p>
        <div className="flex gap-2">
          {["XS", "S", "M", "XL", "XXL"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-1 border rounded transition ${
                selectedSize === size
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-black hover:text-white border border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col gap-3">
        {/* Add To Cart */}
        <button className="flex-1 bg-black text-white text-sm font-medium py-2 
          transition-all duration-300 
          hover:bg-gray-800 hover:scale-[1.02] active:scale-95">
          Add To Cart
        </button>

        {/* Wishlist */}
        <button className="flex-1 text-black text-sm font-medium py-2 
          flex items-center justify-center gap-2 border border-gray-300
          transition-all duration-300
          hover:bg-black hover:text-white hover:border-black hover:scale-[1.02] active:scale-95">
          <Heart size={16} />
          Add to Wishlist
        </button>
      </div>

      {/* Tabs */}
      <div className="space-y-2">
        <div className="flex gap-6 text-xs font-medium text-gray-500">
          <select name="" id="" className="outline-none" onChange={(e) => setActiveTab(e.target.value)}>
            <option value="DELIVERY DETAILS">DELIVERY DETAILS</option>
            <option value="PRODUCT DESCRIPTION">PRODUCT DESCRIPTION</option>
            <option value="KEY FEATURES">KEY FEATURES</option>
          </select>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed h-24">
          {tabDetails}
        </p>
      </div>

      {/* Complete the look */}
      <div className="space-y-3">
        <p className="text-xs font-medium">
          COMPLETE THE LOOK:
        </p>

        <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide">

          {/* Item one */}
          <div className="flex items-stretch gap-x-3 bg-gray-50 border border-gray-400 w-48 h-20 flex-shrink-0 p-1">
            <img
              src="/home/herosection/hero-right-top.png"
              className="w-12 h-full object-cover border rounded-[3px]"
              alt=""
            />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-800 leading-3 line-clamp-2">HEART DIAMOND PENDANT</p>
              <p className="text-gray-400 text-xs font-extralight leading-3 mt-1 line-clamp-2">Romantic design with a delicate chain</p>
              <p className="text-red-500 mt-1 text-xs">₹11,900</p>
            </div>
          </div>

          {/* Item two */}
          <div className="flex items-stretch gap-x-3 bg-gray-50 border border-gray-400 w-48 h-20 flex-shrink-0 p-1">
            <img
              src="/home/herosection/hero-right-top.png"
              className="w-12 h-full object-cover border rounded-[3px]"
              alt=""
            />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-800 leading-3 line-clamp-2">HEART DIAMOND PENDANT</p>
              <p className="text-gray-400 text-xs font-extralight leading-3 mt-1 line-clamp-2">Romantic design with a delicate chain</p>
              <p className="text-red-500 mt-1 text-xs">₹11,900</p>
            </div>
          </div>

        </div>

      </div>

      <div className="mt-6">
        {rightBottomSection.map((item, index) => (
          <div key={index}>
            
            {/* Header */}
            <button
              onClick={() => toggle(index)}
              className="flex items-center py-1 text-sm leading-1 text text-gray-700"
            >
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
              {item.title}
            </button>

            {/* Content */}
            <div
              className={`overflow-hidden transition-all duration-300 pl-5 ${
                activeIndex === index ? "max-h-40 pb-4" : "max-h-0"
              }`}
            >
              <p className="text-xs text-gray-500">{item.content}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default RightSide