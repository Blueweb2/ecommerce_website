"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Heart, Share2 } from "lucide-react";
const Carousel = dynamic(() => import("./Carousel/Carousel"));

const materials = ["White Gold", "Yellow Gold", "Rose Gold"];

const tabs = ['PRODUCT DESCRIPTION', 'KEY FEATURES', 'PRODUCT DETAILS'];

const productDescription = 'Crafted with precision and attention to detail, this diamond halo ring features a stunning center stone surrounded by a delicate halo of smaller diamonds. The elegant band enhances its brilliance, making it a perfect choice for engagements, celebrations, or everyday luxury.'

const keyFeatures = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ipsam culpa saepe accusamus tempore itaque minima rerum maiores officia officiis recusandae velit, quos vero libero sapiente autem voluptatum mollitia at?'

const productDetails = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis vel consectetur nihil ex aspernatur obcaecati quae iure necessitatibus, dolorum, laudantium deleniti repellat repudiandae alias, sapiente ipsum fugit eum dicta rem.'


const ProductFeature = () => {

  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedMaterial, setSelectedMaterial] = useState("White Gold");
  const [activeTab, setActiveTab] = useState("PRODUCT DESCRIPTION");
  const [tabDetails, setTabDetails] = useState<string>();
  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zooming, setZooming] = useState(false);

  // product description, features and details change content
  useEffect(()=>{
    switch (activeTab) {

      case "PRODUCT DESCRIPTION":
        setTabDetails(productDescription)
        break;

      case "KEY FEATURES":
        setTabDetails(keyFeatures)
        break;

      case "PRODUCT DETAILS":
        setTabDetails(productDetails)
        break;

      default:
        break;
    };
  },[activeTab, tabDetails]);

  // custom cursor handling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return !zooming ? (
    <section className="py-10">
      <div className="grid grid-cols-3 max-w-7xl mx-auto">

        {/* LEFT (IMAGE DISPLAY) */}
        <div
          className="sticky top-0 h-[600px] group cursor-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setLeftPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onClick={()=>setZooming(true)}
        >
          <img
            src="/home/herosection/hero-right-top.png"
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Custom Cursor */}
          <div
            className="pointer-events-none absolute w-10 h-10 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center leading-none text-white 
            "
            style={{
              left: leftPos.x - 20,
              top: leftPos.y - 20,
            }}
          ><span className="scale-190">+</span></div>
        </div>

        {/* MIDDLE SECTION ( ANOTHER IMAGES ) */}
        <div className="group cursor-none relative" onClick={()=>setZooming(true)}>
          <img src="/home/categorysection/category-one.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/herosection/hero-center.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/shopsection/shop-one.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/herosection/hero-right-bottom.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/herosection/hero-right-top.png" alt="" className="h-[600px] w-full object-cover" />
          {/* Custom Cursor */} 
          <div
            className="pointer-events-none fixed w-10 h-10 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center leading-none text-white"
            style={{
              left: mousePos.x - 20,
              top: mousePos.y - 20,
            }}
          >
            <span className="scale-190">+</span>
          </div>
        </div>

        {/* RIGHT (ADD TO CART AREA) */}
        <div className="h-fit sticky top-10 space-y-6 text-sm mx-10">

          {/* Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-serif">
              Diamond Halo Ring
            </h1>

            <div className="flex gap-4 text-xs text-gray-600 mt-2">
              <span>• 18K Gold Vermeil</span>
              <span>• Lab-Grown Diamond</span>
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-xl font-semibold">₹24,500</p>
            <p className="text-xs text-gray-600 mt-1">★★★★★ 4.8 (1)</p>
          </div>

          <hr className="text-gray-300" />

          {/* Size */}
          <div>
            <p className="text-xs text-gray-500 mb-2">SIZE:</p>
            <div className="flex gap-2">
              {["6", "7", "8", "9"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded transition ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div>
            <p className="text-xs text-gray-500 mb-2">MATERIAL:</p>

            <div className="flex flex-wrap gap-4">
              {materials.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {/* Radio */}
                  <input
                    type="radio"
                    name="material"
                    value={item}
                    checked={selectedMaterial === item}
                    onChange={() => setSelectedMaterial(item)}
                    className="w-4 h-4 accent-blue-700 cursor-pointer"
                  />

                  {/* Text */}
                  <span className="text-sm text-gray-800">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <hr className="text-gray-300" />

          {/* Quantity + Button */}
          <div className="flex gap-3">
            <select className="py-2 px-10 text-sm border border-gray-300 rounded-[10px]">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>

            <button className="flex-1 bg-[#b8965b] text-white text-sm font-medium py-2 hover:bg-[#bd892f] transition rounded-[10px]">
              ADD TO CART
            </button>
          </div>

          <hr className="text-gray-300" />

          {/* Actions */}
          <div className="flex gap-6 text-sm text-gray-700">
            <button className="flex items-center gap-1">
              {/* ♡ Add to Wishlist */}
              <Heart size={16} /> Add to Wishlist
            </button>

            <button className="flex items-center gap-1">
              {/* ⇄ Share Product */}
              <Share2 size={16} /> Share Product
            </button>
          </div>

          <hr className="text-gray-300" />

          {/* Tabs */}
          <div className="space-y-2">
            <div className="flex gap-6 text-xs font-medium text-gray-500">

              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={()=>setActiveTab(tab)} 
                  className={`${tab === activeTab? 'text-black border-b border-black pb-1':''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {tabDetails}
            </p>
          </div>

          {/* Complete the look */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500">
              COMPLETE THE LOOK:
            </p>

            {/* Item 1 */}
            <div className="flex items-center gap-3 bg-gray-50 p-3">
              <img
                src="/home/herosection/hero-right-top.png"
                className="w-12 h-12 object-cover"
                alt=""
              />
              <div className="flex-1 text-xs">
                <p className="font-medium">HEART DIAMOND PENDANT</p>
                <p className="text-gray-500">Romantic design with a delicate chain</p>
                <p className="text-red-500 mt-1">₹11,900</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 bg-gray-50 p-3">
              <img
                src="/home/herosection/hero-right-top.png"
                className="w-12 h-12 object-cover"
                alt=""
              />
              <div className="flex-1 text-xs">
                <p className="font-medium">LAYERED CHAIN NECKLACE</p>
                <p className="text-gray-500">Modern multi-layered design</p>
                <p className="text-red-500 mt-1">₹13,200</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  ):(
    <Carousel setZooming={setZooming} />
  );
};

export default ProductFeature;