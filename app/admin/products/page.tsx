"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useProductStore } from "@/store/admin/useProductStore";
import { useCategoryStore } from "@/store/admin/useCategoryStore";

import {
  getSectionLabel,
  PRODUCT_SECTION_OPTIONS,
} from "@/lib/constants/admin-catalog";

import ProductHeader from "@/components/admin/products/mainpage/ProductHeader";
import ProductStats from "@/components/admin/products/mainpage/ProductStats";
import ProductFilters from "@/components/admin/products/mainpage/ProductFilters";
import ProductList from "@/components/admin/products/mainpage/ProductList";

export default function ProductsPage() {
  //  STORES
  const {
    products,
    loading,
    fetchProducts,
    deleteProduct,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();

  // STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [saleFilter, setSaleFilter] = useState("all"); // all | sale

  //  FETCH DATA
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  //  SECTION TABS
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
            !PRODUCT_SECTION_OPTIONS.some(
              (option) => option.value === section
            )
        )
        .map((section) => ({
          value: section,
          label: getSectionLabel(section),
        })),
    ];
  }, [products]);

  //  FILTERED PRODUCTS
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

      const matchesSale =
        saleFilter === "all" || product.isOnSale === true;

      return (
        matchesQuery &&
        matchesSection &&
        matchesCategory &&
        matchesSale
      );
    });
  }, [products, searchQuery, activeSection, activeCategory, saleFilter]);

  //  DELETE PRODUCT
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  // DELETE IMAGE
  const handleDeleteImage = async (
    productId: string,
    imageId: string
  ) => {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/products/${productId}/image/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      toast.success("Image deleted");
      fetchProducts(); // refresh
    } catch {
      toast.error("Failed to delete image");
    }
  };

  //  STATS
  const publishedCount = products.filter(
    (p) => p.isPublished
  ).length;

  //  RETURN
  return (
    <div className="space-y-6">
      <ProductHeader />

      <ProductStats
        products={products}
      />

      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        saleFilter={saleFilter}
        setSaleFilter={setSaleFilter}
        categories={categories}
        sectionTabs={sectionTabs}
      />

      <ProductList
        products={filteredProducts}
        loading={loading}
        categories={categories}
        onDelete={handleDelete}
        onDeleteImage={handleDeleteImage}
      />
    </div>
  );
}