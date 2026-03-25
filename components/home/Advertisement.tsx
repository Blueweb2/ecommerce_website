import Link from "next/link";

export default function AdvertisementSection() {
  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">

        {/* TOP 2 CARDS */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">

          {/* LEFT CARD */}
          <div
            className="relative rounded-2xl overflow-hidden h-[180px] sm:h-[220px] md:h-[260px] flex items-center p-3 sm:p-4 md:p-6"
            style={{
              backgroundImage: "url('/home/herosection/hero-right-bottom.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white/70"></div>

            <div className="relative max-w-[140px] sm:max-w-xs">
              <h3 className="text-sm sm:text-lg md:text-2xl font-semibold mb-1 sm:mb-2 md:mb-3">
                Bridal Collection
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 mb-2 sm:mb-3 md:mb-4 line-clamp-2 sm:line-clamp-none">
                Celebrate your special moments with timeless pieces designed to shine.
              </p>

              <Link
                href="/collections/bridal"
                className="inline-block bg-[#c9a96e] text-white text-[10px] sm:text-xs md:text-sm px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full"
              >
                EXPLORE COLLECTION
              </Link>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div
            className="relative rounded-2xl overflow-hidden h-[180px] sm:h-[220px] md:h-[260px] flex items-center justify-end p-3 sm:p-4 md:p-6"
            style={{
              backgroundImage: "url('/home/herosection/hero-right-top.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white/70"></div>

            <div className="relative max-w-[140px] sm:max-w-xs text-right">
              <h3 className="text-sm sm:text-lg md:text-2xl font-semibold mb-1 sm:mb-2 md:mb-3">
                Everyday Elegance
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-2 sm:line-clamp-none">
                Delicate jewellery crafted to elevate your daily style.
              </p>

              <Link
                href="/shop"
                className="inline-block bg-[#c9a96e] text-white text-[10px] sm:text-xs md:text-sm px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full"
              >
                SHOP NOW
              </Link>
            </div>
          </div>

        </div>


        {/* BOTTOM FULL WIDTH */}
        <div
          className="relative rounded-2xl overflow-hidden h-[300px] flex items-center p-8 text-white"
          style={{
            backgroundImage: "url('/home/herosection/hero-left.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative max-w-md">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Mid-Season Sale
            </h2>
            <p className="text-sm text-gray-200 mb-6">
              Enjoy up to 30% off on selected jewellery pieces
            </p>

            <div className="flex gap-3">
              <Link
                href="/sale"
                className="bg-[#c9a96e] text-white text-sm px-5 py-2 rounded-full"
              >
                SHOP SALE
              </Link>

              <Link
                href="/deals"
                className="bg-white text-black text-sm px-5 py-2 rounded-full"
              >
                GRAB THE DEALS
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}