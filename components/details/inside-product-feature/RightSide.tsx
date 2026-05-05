"use client";

import { useState, useEffect } from "react";
import { Heart, ChevronDown, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { wishlistAPI } from "@/lib/api/wishlist.api";
import { useAuthStore } from "@/store/auth/useAuthStore";

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

  const { toggleWishlist, isInWishlist } = useWishlistStore();


  const { user } = useAuthStore();

  const isWishlisted = isInWishlist(product._id);

  const handleWishlistToggle = async () => {
    // ✅ Optimistic UI
    toggleWishlist({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
    });

    // ✅ Backend sync if logged in
    if (user) {
      try {
        await wishlistAPI.toggle(product._id);
      } catch (err) {
        console.log("Wishlist sync failed");
      }
    }

    // ✅ Toast feedback
    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist ❤️");
    }
  };

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

  const buildSelectedOptions = (variant: any, customData: any[]) => {
    const options: { fieldName: string; value: string }[] = [];

    // variant attributes → selectedOptions
    if (variant?.attributes) {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        options.push({
          fieldName: key,
          value: String(value),
        });
      });
    }

    // custom fields → selectedOptions
    customData?.forEach((c) => {
      options.push({
        fieldName: c.fieldName,
        value: String(c.value),
      });
    });

    return options;
  };

  // Initialize default variant
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstAvailable = product.variants.find(
        (v: any) => v.stock > 0
      );

      if (firstAvailable) {
        setSelectedVariant(firstAvailable);
        setSelectedSize(
          String(Object.values(firstAvailable.attributes)[0]).toUpperCase()
        );
      }
    }
  }, [product]);

  const isValid = product?.customizable?.fields?.every((field: any) => {
    if (!field.required) return true;
    return customData.find((f) => f.fieldName === field.name);
  }) ?? true;

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Dynamic price
  const price = selectedVariant?.price || product?.price;
  const discountPrice =
    selectedVariant?.discountPrice || product?.discountPrice;

  // ADD TO CART
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product.variants?.length && !selectedVariant) {
      toast.error("Please select a size");
      return;
    }

    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedOptions = buildSelectedOptions(
      selectedVariant,
      isCustomizable ? customData : []
    );

    const cartItem = {
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price,
      quantity: 1,
      gstPercentage: product.gstPercentage || 0,

      variantId: selectedVariant?.sku,
      selectedOptions,
    };

    addItem(cartItem);

    toast.success("Added to cart");
  };

  return (
    <div className="h-fit lg:sticky top-40 space-y-6 text-sm mx-4 lg:mx-10 mt-10 md:mt-20">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif">
          {product?.name}
        </h1>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-3">
        {discountPrice ? (
          <>
            <p className="text-2xl font-bold text-red-600">₹{discountPrice}</p>
            <p className="text-lg line-through text-gray-400">₹{price}</p>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded tracking-wide">
              {Math.round(((price - discountPrice) / price) * 100)}% OFF
            </span>
          </>
        ) : (
          <p className="text-2xl font-bold text-gray-900">₹{price}</p>
        )}
      </div>

      {/* SIZE SELECTOR  */}
      {(() => {
        const sizeAttribute = product?.attributes?.find(
          (attr: any) => attr.name === "size"
        );

        const sizes = sizeAttribute?.values || [];

        if (sizes.length === 0) return null;

        return (
          <div>
            <p className="text-xs text-gray-500 mb-2">SELECT SIZE:</p>

            <div className="flex gap-2">
              {sizes.map((size: string) => {
                const variant = product.variants.find(
                  (v: any) =>
                    v.attributes?.size?.toLowerCase() === size.toLowerCase()
                );

                const isOutOfStock = !variant || variant.stock === 0;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setSelectedVariant(variant);
                    }}
                    className={`px-3 py-1 border rounded transition
                      ${selectedSize === size
                        ? "bg-black text-white"
                        : "bg-white hover:bg-black hover:text-white"
                      }
                      ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}
                    `}
                  >
                    {size}
                  </button>

                );
              })}
            </div>
          </div>
        );
      })()}

      {/* BUTTONS */}
      <div className="flex flex-col gap-3">

        <button
          disabled={!isValid || (product?.variants?.length > 0 && !selectedVariant)}
          onClick={handleAddToCart}
          className="bg-black text-white py-2 hover:bg-gray-800 disabled:bg-gray-400"
        >
          Add To Cart
        </button>
        <button
          onClick={handleWishlistToggle}
          className={`border py-2 flex items-center justify-center gap-2 transition
    ${isWishlisted ? "bg-black text-white" : "bg-white"}
  `}
        >
          <Heart
            size={16}
            fill={isWishlisted ? "currentColor" : "none"}
          />
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>


        {/* CUSTOM BUTTON */}
        {product?.customizable?.isCustomizable && (
          <button
            onClick={() => setShowCustom(true)}
            className="border py-2 w-full mt-2 hover:bg-black hover:text-white transition"
          >
            ✂ Customize Your Fit
          </button>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="space-y-4">

        <div>
          <h3 className="text-sm font-semibold mb-1">
            PRODUCT DESCRIPTION
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {product?.description || "No description available"}
          </p>
        </div>

        {product?.keyFeatures?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-1 uppercase tracking-wider">
              Key Features
            </h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
              {product.keyFeatures.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* TECHNICAL SPECIFICATIONS */}
        {product?.specifications?.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 gap-y-2">
              {product.specifications.map((spec: any, index: number) => (
                <div key={index} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{spec.name}</span>
                  <span className="text-[11px] font-black text-slate-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product?.deliveryDetails && (
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                <Truck className="h-4 w-4" />
              </div>

              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Delivery Details
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-9">
              {product.deliveryDetails}
            </p>
          </div>
        )}
      </div>

      {/* ACCORDION */}
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
                className={`${activeIndex === index ? "rotate-180" : ""
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

      {/* CUSTOMIZATION MODAL */}
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