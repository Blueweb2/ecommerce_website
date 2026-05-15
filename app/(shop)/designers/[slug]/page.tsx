import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDesignerDetail } from "@/lib/api/designer.api";
import { productAPI } from "@/lib/api/product.api";
import ExploreGrid from "@/components/explore/ExploreGrid";
import { bodoni, inter } from "@/lib/fonts";
import type { Product } from "@/types/product";

const FALLBACK_BANNER = "/home/herosection/hero-right-top.png";
const FALLBACK_AVATAR = "/placeholder.png";
const FALLBACK_PRODUCT_IMAGE = "/home/categorysection/category-one.png";

type DesignerSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function normalizeProducts(payload: unknown): Product[] {
  if (Array.isArray(payload)) {
    return payload as Product[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "products" in payload &&
    Array.isArray(payload.products)
  ) {
    return payload.products as Product[];
  }

  return [];
}

function normalizeBrand(value?: string) {
  return value?.trim().toLowerCase() || "";
}

async function getDesignerProducts(
  brandName: string,
  initialProducts: Product[]
): Promise<Product[]> {
  if (initialProducts.length) {
    return initialProducts;
  }

  try {
    const response = await productAPI.getAll({ limit: 100 });
    const rawProducts =
      response.data?.data?.products ||
      response.data?.data ||
      response.data?.products ||
      [];

    const products = normalizeProducts(rawProducts);
    const targetBrand = normalizeBrand(brandName);

    return products.filter(
      (product) => normalizeBrand(product.brand) === targetBrand
    );
  } catch (error) {
    console.error("Failed to load designer products", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: DesignerSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { designer } = await getDesignerDetail(slug);

    return {
      title: `${designer.name} | Designers`,
      description: designer.description,
      openGraph: {
        images: designer.bannerImage?.url ? [designer.bannerImage.url] : [],
      },
    };
  } catch {
    return {
      title: "Designer",
    };
  }
}

export default async function DesignerSlugPage({
  params,
}: DesignerSlugPageProps) {
  const { slug } = await params;

  try {
    const { designer, products: apiProducts } = await getDesignerDetail(slug);
    const products = await getDesignerProducts(designer.brandName, apiProducts);

return (
  <section className="min-h-screen bg-white pt-[80px]">

    {/* HERO */}
    <div className="relative h-[520px] overflow-hidden bg-black">

      {/* IMAGE */}
      <div className="absolute inset-0">
        <Image
          src={designer.bannerImage?.url || FALLBACK_BANNER}
          alt={`${designer.name} banner`}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center">
        <div className="w-full px-6 md:px-16">

          {/* FLOATING CARD */}
          <div className="max-w-[670px] bg-white p-10 md:p-14">

            <h1
              className={`${bodoni.className} text-[clamp(42px,6vw,64px)] leading-[0.95] tracking-tight text-black`}
            >
              {designer.name}
            </h1>

            <p
              className={`${inter.className} mt-6 text-[15px] leading-8 text-black/75`}
            >
              {designer.description}
            </p>

            <button className="mt-8 flex items-center gap-3 text-sm text-black/75 transition hover:text-black">
              <span>♡</span>
              Favorite Designer
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* FILTER BAR */}
    <div className="border-b border-black/10 bg-white">
      <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <button className="flex items-center gap-2 border border-black/15 px-4 py-2 text-sm transition hover:border-black">
            <span>⊕</span>
            Filter
          </button>

          <p className="text-sm text-black/60">
            {products.length} Results
          </p>
        </div>

        {/* SORT */}
        <select className="h-[44px] border border-black/15 px-4 text-sm outline-none">
          <option>Recommended</option>
          <option>Newest</option>
          <option>Price Low to High</option>
          <option>Price High to Low</option>
        </select>
      </div>
    </div>

    {/* PRODUCTS */}
    <div className="px-4 py-8 md:px-8">

      <ExploreGrid
        products={products}
        fallbackImage={FALLBACK_PRODUCT_IMAGE}
        categoryTitle={designer.brandName}
      />
    </div>
  </section>
);
  } catch {
    notFound();
  }
}
