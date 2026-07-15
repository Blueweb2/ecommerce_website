import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDesigners } from "@/lib/api/designer.api";
import { bodoni, inter } from "@/lib/fonts";
import { resolveImageSrc } from "@/lib/utils/image";
import type { Designer } from "@/types/designer";

const FALLBACK_AVATAR = "/placeholder.png";

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
  return resolveImageSrc(designer.avatar?.url, FALLBACK_AVATAR);
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

  const groupedDesigners = groupDesigners(designers);
  const letters = Object.keys(groupedDesigners).sort();

  return (
    <section className="min-h-screen pb-20 pt-10 md:pt-32">
      <div className="mx-auto max-w-[2000px] px-4 md:px-10 lg:px-20">
        <div>

          <div
            id="designer-index"
            className="py-12"
          >
            {/* TITLE */}
            <div className="sticky top-0 z-50 border-b border-black/10 pb-8 bg-white pt-10 -mt-10">
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
                          <div className="relative mt-1 h-5 w-5 shrink-0 overflow-hidden rounded-full border border-black/10">
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
