//"use client";
import Image from "next/image";

const brands = [
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
  { logo: '/home/brandsection/icon.png' },
];

const loopBrands = [...brands, ...brands];

export default function BrandSection() {

  return (
    <section className="bg-[#f5f5f5] py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-gray-700      font-serif">
            Our Brand
          </h2>
        </div>

        {/* BRAND SLIDER */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll">
            {loopBrands.map((brand, index) => (
              <div
                key={index}
                className="h-[80px] w-[120px] md:h-auto md:min-w-[200px] flex-shrink-0 bg-white rounded-md flex items-center justify-center border border-gray-300 overflow-hidden"
              >
                <Image
                  src={brand.logo}
                  alt="logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PROMO CARDS */}
        <div className="flex overflow-x-auto md:overflow-visible scrollbar-hide md:grid md:grid-cols-3 gap-6 mt-8">

          {/* CARD 1 */}
          <div
            className="relative w-[190px] md:w-auto h-[200px] md:h-[290px] flex-shrink-0 rounded-xl overflow-hidden 
             text-white p-5 flex items-end"
            style={{
              backgroundImage: "url('/home/brandsection/card1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">
                TIFFANY & CO.
              </h3>
              <p className="text-sm text-gray-200">
                Crafted with precision and timeless elegance
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div
            className="relative w-[190px] md:w-auto h-[200px] md:h-[290px] flex-shrink-0 rounded-xl overflow-hidden text-white p-5 flex items-end"
            style={{
              backgroundImage: "url('/home/brandsection/card1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">
                QJ
              </h3>
              <p className="text-sm text-gray-200">
                Known for modern design and refined details
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div
            className="relative w-[190px] md:w-auto h-[200px] md:h-[290px] flex-shrink-0 rounded-xl overflow-hidden text-white p-5 flex items-end"
            style={{
              backgroundImage: "url('/home/brandsection/card1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">
                GRAFF
              </h3>
              <p className="text-sm text-gray-200">
                A legacy of quality and exceptional craftsmanship
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};