import Link from "next/link";

const products = [
  {
    name: "FASHION",
    image: "/home/herosection/hero-right-top.png",
    description:
      "A timeless halo design featuring a brilliant center stone, crafted for elegant everyday wear.",
  },
  {
    name: "FASHION",
    image: "/home/herosection/hero-right-top.png",
    description:
      "A delicate gold pendant designed to add subtle sophistication to any outfit.",
  },
  {
    name: "FASHION",
    image: "/home/herosection/hero-right-top.png",
    description:
      "Vibrant emerald stones paired with fine detailing for a graceful, eye-catching look.",
  },
  {
    name: "FASHION",
    image: "/home/herosection/hero-right-top.png",
    description:
      "A refined bracelet with a continuous line of brilliance, perfect for any occasion.",
  },
  {
    name: "FASHION",
    image: "/home/herosection/hero-right-top.png",
    description:
      "A refined bracelet with a continuous line of brilliance, perfect for any occasion.",
  },
  {
    name: "FASHION",
    image: "/home/herosection/hero-right-top.png",
    description:
      "A refined bracelet with a continuous line of brilliance, perfect for any occasion.",
  },
];

export default function ShopSection() {

  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="max-w-[2000px] mx-auto px-4 md:px-8">

        {/* TITLE */}
        <h2 className="text-2xl font-semibold border-t-2 py-5 border-gray-300">
          TOP STORIES ON
        </h2>

        {/* PRODUCTS */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-14 border-b-2 border-gray-300">

          {products?.map((product, index) => (
            <div
              key={index}
              className="w-[200px] flex flex-col justify-between flex-shrink-0 rounded-xl"
            >
              {/* IMAGE */}
              <Link 
                href="/product/3"
                className="flex justify-center h-56 mb-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full object-cover w-full"
                />
              </Link>

              {/* CONTENT */}
              <div >
                <h3 className="text-sm font-semibold mb-2 text-gray-500">
                  {product.name}
                </h3>
                <p className="text-xs ">
                  {product.description}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};