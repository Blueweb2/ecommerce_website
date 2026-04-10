"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronRight,
  Package2,
  Search,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { useProductStore } from "@/store/admin/useProductStore";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import {
  getProductImageId,
  getPrimaryProductImage,
  getProductImageUrl,
  getSectionLabel,
  PRODUCT_SECTION_OPTIONS,
} from "@/lib/constants/admin-catalog";

export default function ProductsPage() {
  const {
    products,
    loading,
    fetchProducts,
    deleteProduct,
  } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedProduct((prev) => (prev === id ? null : id));
  };


  const handleCopySKU = (sku?: string) => {
    if (!sku) return;

    navigator.clipboard.writeText(sku);
    toast.success("SKU copied!");
  };



  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const sectionTabs = useMemo(() => {
    const dynamicSections = Array.from(
      new Set(
        products.flatMap((product) => product.sections || []).filter(Boolean)
      )
    );

    return [
      { value: "all", label: "All Products" },
      ...PRODUCT_SECTION_OPTIONS.filter(
        (option) =>
          dynamicSections.includes(option.value) || products.length === 0
      ),
      ...dynamicSections
        .filter(
          (section) =>
            !PRODUCT_SECTION_OPTIONS.some((option) => option.value === section)
        )
        .map((section) => ({
          value: section,
          label: getSectionLabel(section),
        })),
    ];
  }, [products]);

  const handleDeleteImage = async (productId: string, imageId: string) => {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/products/${productId}/image/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      toast.success("Image deleted");

      // 🔥 refresh products
      fetchProducts();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const categoryId =
        typeof product.category === "string"
          ? product.category
          : product.category?._id;

      const matchesSKU =
        product.sku?.toLowerCase().includes(query) ||
        product.variants?.some((v) =>
          v.sku?.toLowerCase().includes(query)
        );

      const matchesQuery =
        !query ||
        matchesSKU ||
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase()?.includes(query);

      const matchesSection =
        activeSection === "all" ||
        (product.sections || []).includes(activeSection);
      const matchesCategory =
        activeCategory === "all" || categoryId === activeCategory;

      return matchesQuery && matchesSection && matchesCategory;
    });
  }, [activeCategory, activeSection, products, searchQuery]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const publishedCount = products.filter((product) => product.isPublished).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
              <Package2 className="h-3.5 w-3.5" />
              Product management
            </div>
          </div>

          <Link
            href="/admin/products/create"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-50"
          >
            + Add Product
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total products</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {products.length}
          </p>
        </article>

        <article className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Published</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-950">
            {publishedCount}
          </p>
        </article>

      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Catalog
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredProducts.length} of {products.length} products visible
                </p>
              </div>

              <label className="flex min-w-[260px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <Search className="h-4 w-4" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, SKU, or description"
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              {sectionTabs.map((section) => (
                <button
                  key={section.value}
                  type="button"
                  onClick={() => setActiveSection(section.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeSection === section.value
                    ? "bg-[#12251a] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveSection("all");
                  setActiveCategory("all");
                }}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No products match the current filters.
          </div>
        ) : (
          <div className="grid gap-4 p-4 xl:grid-cols-2">
            {filteredProducts.map((product) => {
              const primaryImage = getPrimaryProductImage(product.images);
              const primaryImageUrl = getProductImageUrl(primaryImage);

              const categoryName =
                typeof product.category === "string"
                  ? categories.find((c) => c._id === product.category)?.name || "Unknown"
                  : product.category?.name || "Uncategorized";

              const displaySKU =
                product.sku ||
                product.variants?.[0]?.sku ||
                "Pending";

              const variants = product.variants || [];
              const hasVariants = variants.length > 0;

              return (
                <article
                  key={product._id}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex gap-4 p-5">

                    {/* 🔥 IMAGE SECTION */}
                    <div className="flex flex-col gap-2">

                      {/* Primary Image */}
                      <div className="h-28 w-28 overflow-hidden rounded-[22px] bg-slate-100 flex items-center justify-center">
                        {primaryImageUrl ? (
                          <img
                            src={primaryImageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">No Image</span>
                        )}
                      </div>

                      {/* Gallery */}
                      <div className="flex gap-2 flex-wrap">
                        {product.images?.map((img, index) => {
                          const imageUrl = getProductImageUrl(img);
                          const imageId = getProductImageId(img);

                          return (
                            <div
                              key={imageId || `${product._id}-image-${index}`}
                              className="relative"
                            >
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-12 w-12 rounded-md object-cover border"
                              />

                              {/* ❌ Delete Image */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // 🔥 prevent parent click issues
                                  if (imageId) handleDeleteImage(product._id, imageId);
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 🔥 PRODUCT INFO */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {(product.sections || []).map((section) => (
                          <span
                            key={section}
                            className="rounded-full bg-[#12251a] px-3 py-1 text-xs font-semibold text-white"
                          >
                            {getSectionLabel(section)}
                          </span>
                        ))}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {product.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-slate-900">
                        {product.name}
                      </h3>

                      <div className="mt-1 flex flex-col gap-1">

                        {/* 🔥 MAIN SKU + COPY */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            SKU {displaySKU}
                          </p>

                          <button
                            onClick={() => handleCopySKU(displaySKU)}
                            className="text-xs px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                          >
                            Copy
                          </button>
                        </div>

                        {/* 🔽 VARIANT TOGGLE */}
                        {hasVariants && (
                          <button
                            onClick={() => toggleExpand(product._id)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {expandedProduct === product._id
                              ? "Hide variants"
                              : `View ${variants.length} variant SKUs`}
                          </button>
                        )}
                      </div>


                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description || "No description added yet."}
                      </p>

                      {expandedProduct === product._id && hasVariants && (
                        <div className="mt-3 space-y-2 border rounded-lg p-3 bg-slate-50">
                          {variants.map((variant, index) => {
                            const attrLabel = Object.entries(variant.attributes || {})
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" / ");

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white px-3 py-2 rounded border"
                              >
                                <div className="text-xs text-slate-700">
                                  <span className="font-medium">{attrLabel}</span>
                                  <span className="ml-2 text-slate-400">
                                    ({variant.sku || "No SKU"})
                                  </span>
                                </div>

                                {/* COPY BUTTON (next step) */}
                                <button
                                  onClick={() => handleCopySKU(variant.sku)}
                                  className="text-xs px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                                >
                                  Copy
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          {categoryName}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Stock {product.stock ?? 0}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Package2 className="h-4 w-4" />
                          {hasVariants
                            ? `${variants.length} variants`
                            : "No variants"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🔥 FOOTER */}
                  <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                    <p className="text-lg font-semibold text-slate-900">
                      ₹ {product.price}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        View
                        <ChevronRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
