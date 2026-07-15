"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { wishlistAPI } from "@/lib/api/wishlist.api";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { bodoni, inter } from "@/lib/fonts";
import { getPrimaryProductImage } from "@/lib/constants/admin-catalog";
import { getInclusivePrice } from "@/lib/utils/pricing";

import { normalizeKey, getAttributeValueCaseInsensitive } from "@/lib/utils/attributes";

type Props = {
  product: any;
  onVariantChange?: (variant: any | null) => void;
};

type CustomDataItem = {
  fieldName: string;
  value: string | number;
};

const RightSide = ({ product, onVariantChange }: Props) => {

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const isCustomizable = product?.customizable?.isCustomizable;
  const [showCustom, setShowCustom] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  const [customData, setCustomData] = useState<CustomDataItem[]>([]);

  // Fabric / Quantity State
  const isFabric = product?.isFabric;
  const minQty = isFabric ? product?.minOrderQty || 1 : 1;

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const isWishlisted = isInWishlist(product._id);
  const selectedVariantPrimaryImage =
    getPrimaryProductImage(selectedVariant?.images)?.url;
  const primaryImageUrl =
    selectedVariantPrimaryImage ||
    getPrimaryProductImage(product.images)?.url ||
    "/placeholder.png";

  const handleWishlistToggle = async () => {
    toggleWishlist({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: primaryImageUrl,
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

  const inStockVariants =
    product?.variants?.filter((variant: any) => variant.stock > 0) || [];

  const findBestMatchingVariant = (
    attributeName: string,
    value: string,
    currentSelection: Record<string, string>
  ) => {
    const targetKeyNormalized = normalizeKey(attributeName);
    const targetValueLower = value.toLowerCase().trim();

    let candidates = inStockVariants.filter((variant: any) => {
      const variantValue = getAttributeValueCaseInsensitive(variant.attributes, attributeName);
      return variantValue !== undefined && String(variantValue).toLowerCase().trim() === targetValueLower;
    });

    if (candidates.length === 0) {
      candidates = (product?.variants || []).filter((variant: any) => {
        const variantValue = getAttributeValueCaseInsensitive(variant.attributes, attributeName);
        return variantValue !== undefined && String(variantValue).toLowerCase().trim() === targetValueLower;
      });
    }

    if (candidates.length === 0) return null;

    let bestCandidate = candidates[0];
    let maxMatches = -1;

    candidates.forEach((candidate: any) => {
      let matches = 0;
      Object.entries(currentSelection).forEach(([selKey, selVal]) => {
        const selKeyNorm = normalizeKey(selKey);
        if (selKeyNorm === targetKeyNormalized) return;

        const candidateVal = getAttributeValueCaseInsensitive(candidate.attributes, selKey);
        if (candidateVal !== undefined && String(candidateVal).toLowerCase().trim() === String(selVal).toLowerCase().trim()) {
          matches++;
        }
      });

      if (matches > maxMatches) {
        maxMatches = matches;
        bestCandidate = candidate;
      }
    });

    return bestCandidate;
  };

  const onVariantChangeRef = useRef(onVariantChange);
  useEffect(() => {
    onVariantChangeRef.current = onVariantChange;
  }, [onVariantChange]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstAvailable = product.variants.find((variant: any) => variant.stock > 0) || product.variants[0];

      if (firstAvailable) {
        setSelectedVariant(firstAvailable);
        onVariantChangeRef.current?.(firstAvailable);
        setSelectedAttributes(
          Object.entries(firstAvailable.attributes || {}).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [normalizeKey(key)]: String(value),
            }),
            {}
          )
        );
        return;
      }
    }

    setSelectedVariant(null);
    onVariantChangeRef.current?.(null);
    setSelectedAttributes({});
  }, [product]);

  const isValid =
    product?.customizable?.fields?.every((field: any) => {
      if (!field.required) return true;
      return customData.find((item) => item.fieldName === field.name);
    }) ?? true;

  const basePrice = selectedVariant?.price || product?.price;
  const baseDiscountPrice = selectedVariant?.discountPrice || product?.discountPrice;
  const gstPct = product?.gstPercentage || 0;
  const price = getInclusivePrice(basePrice, gstPct);
  const discountPrice = baseDiscountPrice ? getInclusivePrice(baseDiscountPrice, gstPct) : undefined;

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product.variants?.length && !selectedVariant) {
      toast.error("Please select product options");
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
      image: primaryImageUrl,
      price: basePrice,
      quantity: minQty,
      gstPercentage: product.gstPercentage || 0,
      variantId: selectedVariant?.sku,
      selectedOptions,
      isFabric: product.isFabric,
      unit: product.unit,
      minOrderQty: product.minOrderQty,
      stepQty: product.stepQty,
    });

    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto max-w-[390px] bg-[#f8f8f8] shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[99999]`}
        >
          <div className="p-4">
            <div className="flex gap-4">
              {/* IMAGE */}
              <div className="h-[142px] w-[108px] shrink-0 bg-white">
                <img
                  src={primaryImageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-1 flex-col">
                <h2 className="text-[14px] font-semibold leading-[1.3] text-black">
                  This article was added to your shopping bag.
                </h2>

                <p className="mt-10 text-[15px] leading-[1.5] text-black">
                  Please note that your items are not reserved.
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = "/cart";
              }}
              className="mt-4 h-[40px] w-full bg-black text-[15px] font-medium text-white transition hover:bg-[#1a1a1a]"
            >
              Go to Bag
            </button>
          </div>
        </div>
      ),
      {
        duration: 4000,
        position: "top-right",
      }
    );
  };

  return (
    <div className="mx-4 mt-10 h-fit space-y-6 text-sm lg:sticky lg:top-7 lg:mx-10 md:mt-10">
      <div>
        <h1 className={`${bodoni.className} text-2xl uppercase`}>
          {product?.name}
        </h1>
        {(product?.brand || product?.designer?.brandName || product?.designer?.name) && (
          <p className={`${inter.className} mb-2 text-[11px] uppercase tracking-[0.16em] text-[#8D8B9D]`}>
            {product?.brand || product?.designer?.brandName || product?.designer?.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {discountPrice ? (
          <>
            <div className="flex items-center">
              <p className="text-[#656565] line-through">₹{price}</p>
              <span className="bg-[#656565] ml-3 px-[2px] py-[1px] text-xs text-white">
                {Math.round(((price - discountPrice) / price) * 100)}% OFF
              </span>
            </div>
            <p className="text-[15px] font-bold">
              ₹{discountPrice}{isFabric && <span className="text-sm font-normal text-gray-400 ml-1">/ {product.unit || "meter"}</span>}
            </p>
          </>
        ) : (
          <p className="text-[15px] font-bold">
            ₹{price}{isFabric && <span className="text-sm font-normal text-gray-400 ml-1">/ {product.unit || "meter"}</span>}
          </p>
        )}
      </div>

      {(product?.attributes || []).map((attribute: any) => {
        const values = attribute?.values || [];

        if (!values.length) {
          return null;
        }

        return (
          <div key={attribute.name}>
            <p className="mb-2 text-xs text-neutral-600 uppercase">
              Select {attribute.name}:
            </p>

            <div className="grid grid-cols-4 gap-2">
              {values.map((value: string) => {
                const hasAnyVariant = inStockVariants.some((v: any) => {
                  const val = getAttributeValueCaseInsensitive(v.attributes, attribute.name);
                  return val !== undefined && String(val).toLowerCase().trim() === value.toLowerCase().trim();
                });
                const isOutOfStock = !hasAnyVariant;

                const isSelected = (() => {
                  const currentVal = getAttributeValueCaseInsensitive(selectedAttributes, attribute.name);
                  return currentVal !== undefined && String(currentVal).toLowerCase().trim() === value.toLowerCase().trim();
                })();

                return (
                  <button
                    key={`${attribute.name}-${value}`}
                    disabled={isOutOfStock}
                    onClick={() => {
                      const matchedVariant = findBestMatchingVariant(
                        attribute.name,
                        value,
                        selectedAttributes
                      );

                      if (matchedVariant) {
                        const newAttributes = Object.entries(matchedVariant.attributes || {}).reduce(
                          (acc, [k, v]) => ({
                            ...acc,
                            [normalizeKey(k)]: String(v),
                          }),
                          {}
                        );
                        setSelectedAttributes(newAttributes);
                        setSelectedVariant(matchedVariant);
                        onVariantChange?.(matchedVariant);
                      }
                    }}
                    className={`border px-3 py-2 transition ${isSelected
                      ? "border border-black"
                      : "border-gray-200 hover:border-gray-400"
                      } ${isOutOfStock ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

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
          className={`flex items-center justify-center gap-2 border py-2 transition ${isWishlisted ? "bg-black text-white" : "bg-white"
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
          <h3 className={`${inter.className} mb-1 text-sm font-semibold`}>
            PRODUCT DESCRIPTION
          </h3>
          <p className={`${inter.className} text-xs leading-relaxed text-[#5C5A58]`}>
            {product?.description || "No description available"}
          </p>
        </div>

        {product?.keyFeatures?.length > 0 && (
          <div>
            <h3 className={`${inter.className} mb-1 text-sm font-semibold`}>
              KEY FEATURES
            </h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-[#5C5A58]">
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
            <h3 className={`${inter.className} mb-3 text-sm font-semibold uppercase tracking-wider`}>
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 gap-y-2">
              {product.specifications.map((spec: any, index: number) => (
                <div
                  key={index}
                  className={`${inter.className} flex justify-between border-b border-slate-50 py-2 last:border-0`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    {spec.name}
                  </span>
                  <span className="text-[11px] font-black text-[#5C5A58]">
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
              <div className="text-black">
                <Truck className="h-4 w-4" />
              </div>

              <h3 className={`${inter.className} text-sm font-bold uppercase tracking-tight`}>
                Delivery Details
              </h3>
            </div>
            <p className={`${inter.className} pl-9 text-xs leading-relaxed text-[#5C5A58]`}>
              {product.deliveryDetails}
            </p>
          </div>
        )}
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