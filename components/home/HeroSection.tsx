import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full bg-[#f5f5f5] py-8 mt-8 md:mt-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT BIG CARD */}
        <div
          className="relative rounded-2xl overflow-hidden min-h-[420px] flex items-end p-6 text-white"
          style={{
            backgroundImage: "url('/home/herosection/hero-left.jpg')", // replace
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-xs">
            <h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-4 
            animate-fadeUp">
              Timeless Jewellery for Every Moment
            </h1>
            <p className="text-sm text-gray-200 mb-5 animate-fadeUp animate-delay-200">
              Fine jewellery designed to be worn, loved, and remembered.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#c9a96e] text-white text-sm px-5 py-2 rounded-full hover:opacity-90 transition animate-fadeUp animate-delay-400"
            >
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* CENTER CARD */}
        <div
          className="relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col justify-between p-6"
          style={{
            backgroundImage: "url('/home/herosection/hero-center.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center mt-2">
            <h2 className="text-2xl font-semibold text-gray-800 animate-fadeUp">
              Elegant Rings
            </h2>
            <p className="text-sm text-gray-600 mt-2 animate-fadeUp animate-delay-200">
              From delicate bands to statement designs, find rings crafted to
              capture every moment beautifully.
            </p>
            <Link
              href="/shop/rings"
              className="inline-block mt-4 bg-[#c9a96e] text-white text-sm px-5 py-2 rounded-full hover:opacity-90 transition animate-fadeUp animate-delay-400"
            >
              SHOP RINGS
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE (2 CARDS) */}
        <div className="flex lg:flex-col gap-6">

          {/* TOP RIGHT */}
          <div
            className="relative rounded-2xl overflow-hidden min-h-[200px] flex items-end p-5 text-white w-full"
            style={{
              backgroundImage: "url('/home/herosection/hero-right-top.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold animate-slide-right">
                Signature Necklaces
              </h3>
              <Link
                href="/shop/necklaces"
                className="text-xs mt-2 inline-flex items-center gap-1 animate-slide-left"
              >
                SHOP NECKLACES →
              </Link>
            </div>
          </div>

          {/* BOTTOM RIGHT */}
          <div
            className="relative rounded-2xl overflow-hidden min-h-[200px] flex items-end p-5 w-full"
            style={{
              backgroundImage: "url('/home/herosection/hero-right-bottom.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800 animate-slide-right">
                Modern Earrings
              </h3>
              <Link
                href="/shop/earrings"
                className="text-xs mt-2 inline-flex items-center gap-1 text-gray-700 animate-slide-left"
              >
                SHOP EARRINGS →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};