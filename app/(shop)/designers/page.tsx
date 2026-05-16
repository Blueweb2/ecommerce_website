import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDesigners } from "@/lib/api/designer.api";
import { bodoni, inter } from "@/lib/fonts";
import type { Designer } from "@/types/designer";

const FALLBACK_AVATAR = "/placeholder.png";
const FALLBACK_BANNER = "/home/herosection/hero-right-top.png";

type DesignersPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Designers",
  description:
    "Explore the featured designers and brands shaping the ZENFAZ collection.",
};

function getDesignerHref(designer: Designer) {
  if (designer.slug) {
    return `/designers/${designer.slug}`;
  }

  return `/designers/${designer.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function getDesignerAvatar(designer: Designer) {
  return designer.avatar?.url || FALLBACK_AVATAR;
}

function getDesignerBanner(designer: Designer) {
  return designer.bannerImage?.url || FALLBACK_BANNER;
}

function groupDesigners(designers: Designer[]) {
  return designers.reduce<Record<string, Designer[]>>((accumulator, designer) => {
    const letter = designer.name.charAt(0).toUpperCase();

    if (!accumulator[letter]) {
      accumulator[letter] = [];
    }

    accumulator[letter].push(designer);
    return accumulator;
  }, {});
}

export default async function DesignersPage({
  searchParams,
}: DesignersPageProps) {
  const { search = "" } = await searchParams;
  const designers = (await getDesigners({
    isActive: true,
    search: search || undefined,
  })).sort((first, second) => first.name.localeCompare(second.name));

  const featuredDesigners = designers
    .filter((designer) => designer.isFavorite)
    .sort((first, second) => first.name.localeCompare(second.name));
  const groupedDesigners = groupDesigners(designers);
  const letters = Object.keys(groupedDesigners).sort();

  return (
    <section className="min-h-screen bg-[#f7f4ee] pb-20 pt-20">
      <div className="mx-auto max-w-[2000px] px-4 md:px-20">
        <div className="overflow-hidden rounded-[36px] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.06)]">
          {/* <div className="relative min-h-[340px] overflow-hidden border-b border-black/6 bg-[#ece5da] px-6 py-12 md:px-12 md:py-16">
            <div className="absolute inset-0">
              <Image
                src={featuredDesigners[0]?.bannerImage?.url || FALLBACK_BANNER}
                alt="Designers editorial banner"
                fill
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(245,239,229,0.8))]" />
            </div>

            <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                  Designer Directory
                </p>
                <h1
                  className={`${bodoni.className} mt-4 max-w-4xl text-[clamp(42px,6vw,78px)] leading-[0.95] tracking-tight text-neutral-700`}
                >
                  Discover the creative voices behind every signature silhouette.
                </h1>
                <p
                  className={`${inter.className} mt-5 max-w-2xl text-sm leading-7 text-[#8D8B9D] md:text-[15px]`}
                >
                  Browse our favorite designers, editorial brand worlds, and the stories behind the labels shaping this season’s collection.
                </p>
              </div>

              <form
                action="/designers"
                method="get"
                className="rounded-[28px] border border-black/8 bg-white/85 p-5 backdrop-blur"
              >
                <label
                  htmlFor="designer-search"
                  className="text-[11px] uppercase tracking-[0.22em] text-black/45"
                >
                  Search Designers
                </label>
                <div className="mt-3 flex gap-3">
                  <input
                    id="designer-search"
                    name="search"
                    defaultValue={search}
                    placeholder="Search by designer or brand"
                    className="min-w-0 flex-1 rounded-full border border-black/10 bg-[#faf8f2] px-4 py-3 text-sm text-black outline-none transition focus:border-black/35"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/85"
                  >
                    Search
                  </button>
                </div>
                <p className="mt-3 text-xs text-black/45">
                  {designers.length} designer{designers.length === 1 ? "" : "s"} found
                </p>
              </form>
            </div>
          </div> */}

          {/* {featuredDesigners.length ? (
            <div className="border-b border-black/6 px-6 py-10 md:px-12">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">
                    Editor’s Favorites
                  </p>
                  <h2
                    className={`${bodoni.className} mt-2 text-[clamp(28px,4vw,44px)] tracking-tight text-neutral-700`}
                  >
                    Featured brands to know now
                  </h2>
                </div>

                <Link
                  href="#designer-index"
                  className="hidden text-sm font-medium text-[#8D8B9D] underline transition hover:text-black md:inline-block"
                >
                  Browse full index
                </Link>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {featuredDesigners.slice(0, 3).map((designer) => (
                  <Link
                    key={designer._id || designer.slug || designer.name}
                    href={getDesignerHref(designer)}
                    className="group overflow-hidden rounded-[28px] border border-black/8 bg-[#faf7f1] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
                  >
                    <div className="relative h-56 overflow-hidden bg-[#ebe2d5]">
                      <Image
                        src={getDesignerBanner(designer)}
                        alt={`${designer.name} banner`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                      <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-black">
                        Favorite
                      </span>
                    </div>

                    <div className="flex items-start gap-4 p-6">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white">
                        <Image
                          src={getDesignerAvatar(designer)}
                          alt={designer.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`${bodoni.className} text-[30px] leading-none tracking-tight text-neutral-700`}
                        >
                          {designer.name}
                        </h3>
                        <p
                          className={`${inter.className} mt-2 text-xs uppercase tracking-[0.2em] text-[#8D8B9D]`}
                        >
                          {designer.brandName}
                        </p>
                        <p
                          className={`${inter.className} mt-4 line-clamp-3 text-sm leading-7 text-[#8D8B9D]`}
                        >
                          {designer.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null} */}

     <div
  id="designer-index"
  className="px-6 py-12 md:px-12"
>
  {/* TITLE */}
  <div className="border-b border-black/10 pb-8">
    <h2
      className={`${bodoni.className} text-[42px] tracking-tight text-black`}
    >
      Designers
    </h2>

    {/* LETTER NAVIGATION */}
    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-black/10 pt-8 text-sm tracking-[0.2em] text-black/80">
      {letters.map((letter) => (
        <a
          key={letter}
          href={`#designer-letter-${letter}`}
          className="transition hover:opacity-50"
        >
          {letter}
        </a>
      ))}
    </div>
  </div>

  {/* DESIGNER GROUPS */}
  <div className="mt-14 space-y-20">
    {letters.length ? (
      letters.map((letter) => (
        <section
          key={letter}
          id={`designer-letter-${letter}`}
        >
          {/* LETTER HEADING */}
          <div className="mb-10 border-b border-black/10 pb-4">
            <h3
              className={`${bodoni.className} text-[40px] text-black`}
            >
              {letter}
            </h3>
          </div>

          {/* DESIGNERS GRID */}
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-20">
            {groupedDesigners[letter].map((designer) => (
              <Link
                key={designer._id || designer.slug || designer.name}
                href={getDesignerHref(designer)}
                className="group flex items-start gap-3"
              >
                {/* MINI BRAND ICON */}
                <div className="relative mt-1 h-5 w-5 shrink-0 overflow-hidden rounded-full border border-black/10 bg-white">
                  <Image
                    src={getDesignerAvatar(designer)}
                    alt={designer.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div>
                  <h4 className="text-[15px] font-medium tracking-wide text-black transition group-hover:opacity-60">
                    {designer.name}
                  </h4>

                  {designer.isFavorite && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#8D8B9D]">
                      Featured
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))
    ) : (
      <div className="py-20 text-center">
        <h2
          className={`${bodoni.className} text-[34px] tracking-tight text-black`}
        >
          No designers found
        </h2>

        <p
          className={`${inter.className} mt-3 text-sm leading-7 text-[#8D8B9D]`}
        >
          Try another search keyword.
        </p>
      </div>
    )}
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
