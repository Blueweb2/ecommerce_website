"use client";

import { useState, useEffect } from "react";
import { Heart, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = {
  product: any;
};

type CustomDataItem = {
  fieldName: string;
  value: string | number;
};

const RightSide = ({ product }: Props) => {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const isCustomizable = product?.customizable?.isCustomizable;
  const [showCustom, setShowCustom] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  const [customData, setCustomData] = useState<CustomDataItem[]>([]);

const handleCustomChange = (name: string, value: string | number) => {
  setCustomData((prev) => {
    const existing = prev.find(f => f.fieldName === name);

    if (existing) {
      return prev.map(f =>
        f.fieldName === name ? { ...f, value } : f
      );
    }

    return [...prev, { fieldName: name, value }];
  });
};

  // ✅ Initialize default variant
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const isValid = product?.customizable?.fields?.every((field: any) => {
    if (!field.required) return true;
    return customData.find((f) => f.fieldName === field.name);
  }) ?? true;

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // ✅ Dynamic price
  const price = selectedVariant?.price || product.price;
  const discountPrice =
    selectedVariant?.discountPrice || product.discountPrice;

  // ===========================
  // ✅ ADD TO CART
  // ===========================
const handleAddToCart = () => {
  if (product.variants?.length && !selectedVariant) {
    toast.error("Please select a variant");
    return;
  }

  if (!isValid) {
    toast.error("Please fill all required measurements");
    return;
  }

  const cartItem = {
    productId: product._id,
    name: product.name,
    image: product.images?.[0]?.url,
    price,
    quantity: 1,
    variant: selectedVariant?.attributes || null,

    // ✅ IMPORTANT
    customData: isCustomizable ? customData : []
  };

  const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

  existingCart.push(cartItem);

  localStorage.setItem("cart", JSON.stringify(existingCart));

  toast.success("Added to cart");
};

return (
  <div className="h-fit lg:sticky top-20 space-y-6 text-sm mx-4 lg:mx-10 mt-10">

    {/* ✅ TITLE */}
    <div>
      <h1 className="text-2xl md:text-3xl font-serif">
        {product.name}
      </h1>
    </div>

    {/* ✅ PRICE */}
    <div>
      <p className="text-xl font-semibold">₹{price}</p>

      {discountPrice && (
        <p className="text-sm line-through text-gray-400">
          ₹{discountPrice}
        </p>
      )}
    </div>

    {/* ===========================
        ✅ VARIANT SELECTOR
    =========================== */}
    {product.variants?.length > 0 && (
      <div>
        <p className="text-xs text-gray-500 mb-2">
          SELECT OPTION:
        </p>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant: any, index: number) => {
            const label = Object.values(variant.attributes).join(" / ");

            return (
              <button
                key={index}
                onClick={() => setSelectedVariant(variant)}
                className={`px-3 py-1 border rounded ${
                  selectedVariant === variant
                    ? "bg-black text-white"
                    : "bg-white hover:bg-black hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    )}

    {product.sizes?.length > 0 && (
  <div>
    <p className="text-xs text-gray-500 mb-2">SELECT SIZE:</p>
    <div className="flex gap-2">
      {product.sizes.map((size: string) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          className={`px-3 py-1 border ${
            selectedSize === size
              ? "bg-black text-white"
              : "bg-white hover:bg-black hover:text-white"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
)}

    {/* ===========================
        ✅ BUTTONS
    =========================== */}
    <div className="flex flex-col gap-3">

      <button
        disabled={!isValid}
        onClick={handleAddToCart}
        className="bg-black text-white py-2 hover:bg-gray-800 disabled:bg-gray-400"
      >
        Add To Cart
      </button>

      <button className="border py-2 flex items-center justify-center gap-2">
        <Heart size={16} />
        Wishlist
      </button>

      {/* ✅ CUSTOM BUTTON (ONLY FOR CLOTHING) */}
      {product?.customizable?.isCustomizable && (
        <button
          onClick={() => setShowCustom(true)}
          className="border py-2 w-full mt-2 hover:bg-black hover:text-white transition"
        >
          ✂ Customize Your Fit
        </button>
      )}
    </div>

    {/* ===========================
        ✅ PRODUCT INFO
    =========================== */}
    <div className="space-y-4">

      {/* DESCRIPTION */}
      <div>
        <h3 className="text-sm font-semibold mb-1">
          PRODUCT DESCRIPTION
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          {product?.description || "No description available"}
        </p>
      </div>

      {/* KEY FEATURES */}
      {product?.keyFeatures?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-1">
            KEY FEATURES
          </h3>
          <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
            {product.keyFeatures.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* DELIVERY */}
      {product?.deliveryDetails && (
        <div>
          <h3 className="text-sm font-semibold mb-1">
            DELIVERY DETAILS
          </h3>
          <p className="text-xs text-gray-600">
            {product.deliveryDetails}
          </p>
        </div>
      )}
    </div>

    {/* ===========================
        ✅ ACCORDION
    =========================== */}
    <div>
      {[
        { title: "Size & Fit", content: "Standard fit" },
        { title: "Returns", content: "Easy returns available" },
      ].map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggle(index)}
            className="flex items-center gap-2"
          >
            <ChevronDown
              className={`${
                activeIndex === index ? "rotate-180" : ""
              }`}
            />
            {item.title}
          </button>

          {activeIndex === index && (
            <p className="text-xs text-gray-500">
              {item.content}
            </p>
          )}
        </div>
      ))}
    </div>

    {/* ===========================
        ✅ CUSTOMIZATION MODAL
    =========================== */}
    {showCustom && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white w-[90%] max-w-md p-6 rounded-lg space-y-4">

          <h2 className="text-lg font-semibold">
            Customize Your Fit
          </h2>

          {product.customizable.fields.map((field: any, index: number) => (
            <div key={index}>
              <label className="text-sm font-medium">
                {field.name} {field.unit && `(${field.unit})`}
              </label>

              {field.type === "select" ? (
                <select
                  onChange={(e) =>
                    handleCustomChange(field.name, e.target.value)
                  }
                  className="border p-2 w-full mt-1 rounded"
                >
                  <option value="">Select</option>
                  {field.options?.map((opt: string, i: number) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  onChange={(e) =>
                    handleCustomChange(field.name, e.target.value)
                  }
                  className="border p-2 w-full mt-1 rounded"
                />
              )}
            </div>
          ))}

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCustom(false)}
              className="flex-1 border py-2"
            >
              Cancel
            </button>

            <button
              onClick={() => setShowCustom(false)}
              className="flex-1 bg-black text-white py-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
);
};

export default RightSide;