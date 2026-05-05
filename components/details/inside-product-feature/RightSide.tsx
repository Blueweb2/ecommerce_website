"use client";

import { useState, useEffect } from "react";
import { Heart, ChevronDown, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { Bodoni_Moda, Inter } from 'next/font/google';
import { useCartStore } from "@/store/user/cart/useCartStore";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { wishlistAPI } from "@/lib/api/wishlist.api";
import { useAuthStore } from "@/store/auth/useAuthStore";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ['latin'],
});

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
    toggleWishlist({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
    });

    if (user) {
      try {
        await wishlistAPI.toggle(product._id);
      } catch {
        console.log("Wishlist sync failed");
      }
    }

    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const handleCustomChange = (name: string, value: string | number) => {
    setCustomData((prev) => {
      const existing = prev.find((field) => field.fieldName === name);

      if (existing) {
        return prev.map((field) =>
          field.fieldName === name ? { ...field, value } : field
        );
      }

      return [...prev, { fieldName: name, value }];
    });
  };

  const buildSelectedOptions = (variant: any, nextCustomData: CustomDataItem[]) => {
    const options: { fieldName: string; value: string }[] = [];

    if (variant?.attributes) {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        options.push({
          fieldName: key,
          value: String(value),
        });
      });
    }

    nextCustomData.forEach((field) => {
      options.push({
        fieldName: field.fieldName,
        value: String(field.value),
      });
    });

    return options;
  };

  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstAvailable = product.variants.find((variant: any) => variant.stock > 0);

      if (firstAvailable) {
        setSelectedVariant(firstAvailable);
        setSelectedSize(
          String(Object.values(firstAvailable.attributes)[0]).toUpperCase()
        );
      }
    }
  }, [product]);

  const isValid =
    product?.customizable?.fields?.every((field: any) => {
      if (!field.required) return true;
      return customData.find((item) => item.fieldName === field.name);
    }) ?? true;

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const price = selectedVariant?.price || product?.price;
  const discountPrice = selectedVariant?.discountPrice || product?.discountPrice;

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

    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price,
      quantity: 1,
      gstPercentage: product.gstPercentage || 0,
      variantId: selectedVariant?.sku,
      selectedOptions,
    });

    toast.success("Added to cart");
  };

  return (
    <div className="mx-4 mt-10 h-fit space-y-6 text-sm lg:sticky lg:top-40 lg:mx-10 md:mt-20">
      <div>
        <h1 className={`${bodoni.className} text-2xl text-neutral-600 md:text-3xl`}>
          {product?.name}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {discountPrice ? (
          <>
            <p className="text-2xl font-bold text-[#8D8B9D]">₹{discountPrice}</p>
            <p className="text-lg text-red-400 line-through">₹{price}</p>
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold tracking-wide text-white">
              {Math.round(((price - discountPrice) / price) * 100)}% OFF
            </span>
          </>
        ) : (
          <p className="font-brand-display text-2xl font-bold text-[#8D8B9D]">
            {price}
          </p>
        )}
      </div>

      {(() => {
        const sizeAttribute = product?.attributes?.find(
          (attr: any) => attr.name === "size"
        );

        const sizes = sizeAttribute?.values || [];

        if (sizes.length === 0) return null;

        return (
          <div>
            <p className="mb-2 text-xs text-neutral-600">SELECT SIZE:</p>

            <div className="flex gap-2">
              {sizes.map((size: string) => {
                const variant = product.variants.find(
                  (item: any) =>
                    item.attributes?.size?.toLowerCase() === size.toLowerCase()
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
                    className={`rounded border px-3 py-1 transition ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-white hover:bg-black hover:text-white"
                    } ${isOutOfStock ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col gap-3">
        <button
          disabled={!isValid || (product?.variants?.length > 0 && !selectedVariant)}
          onClick={handleAddToCart}
          className="bg-black py-2 text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          Add To Cart
        </button>

        <button
          onClick={handleWishlistToggle}
          className={`flex items-center justify-center gap-2 border py-2 transition ${
            isWishlisted ? "bg-black text-white" : "bg-white"
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>

        {product?.customizable?.isCustomizable && (
          <button
            onClick={() => setShowCustom(true)}
            className="mt-2 w-full border py-2 transition hover:bg-black hover:text-white"
          >
            Customize Your Fit
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className={`${bodoni.className} mb-1 text-sm font-semibold text-neutral-600`}>
            PRODUCT DESCRIPTION
          </h3>
          <p className={`${inter.className} text-xs leading-relaxed text-[#8D8B9D]`}>
            {product?.description || "No description available"}
          </p>
        </div>

        {product?.keyFeatures?.length > 0 && (
          <div>
            <h3 className={`${bodoni.className} mb-1 text-sm font-semibold text-neutral-600`}>
              KEY FEATURES
            </h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-[#8D8B9D]">
              {product.keyFeatures.map((feature: string, index: number) => (
                <li key={index} className={inter.className}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product?.specifications?.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <h3 className={`${bodoni.className} mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-600`}>
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 gap-y-2">
              {product.specifications.map((spec: any, index: number) => (
                <div
                  key={index}
                  className={`${inter.className} flex justify-between border-b border-slate-50 py-2 last:border-0`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {spec.name}
                  </span>
                  <span className="text-[11px] font-black text-slate-900">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product?.deliveryDetails && (
          <div className="border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
                <Truck className="h-4 w-4" />
              </div>

              <h3 className={`${bodoni.className} text-sm font-bold uppercase tracking-tight text-neutral-600`}>
                Delivery Details
              </h3>
            </div>
            <p className={`${inter.className} pl-9 text-xs leading-relaxed text-[#8D8B9D]`}>
              {product.deliveryDetails}
            </p>
          </div>
        )}
      </div>

      <div>
        {[
          { title: "Size & Fit", content: "Standard fit" },
          { title: "Returns", content: "Easy returns available" },
        ].map((item, index) => (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="flex items-center gap-2 text-neutral-600"
            >
              <ChevronDown
                className={activeIndex === index ? "rotate-180" : ""}
              />
              {item.title}
            </button>

            {activeIndex === index && (
              <p className="font-brand-sans text-xs text-[#8D8B9D]">
                {item.content}
              </p>
            )}
          </div>
        ))}
      </div>

      {showCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-md space-y-4 rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Customize Your Fit</h2>

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
                    className="mt-1 w-full rounded border p-2"
                  >
                    <option value="">Select</option>
                    {field.options?.map((option: string, optionIndex: number) => (
                      <option key={optionIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    onChange={(e) =>
                      handleCustomChange(field.name, e.target.value)
                    }
                    className="mt-1 w-full rounded border p-2"
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
                className="flex-1 bg-black py-2 text-white"
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
