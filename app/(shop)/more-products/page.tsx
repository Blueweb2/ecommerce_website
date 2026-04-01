interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "DIAMOND SOLITAIRE RING",
    price: "₹24,500",
    image: "/home/herosection/hero-center.png",
    description: "Classic round-cut solitaire set in white gold",
  },
  {
    id: 2,
    name: "GOLD PENDANT NECKLACE",
    price: "₹10,500",
    image: "/home/herosection/hero-center.png",
    description: "Elegant pendant on a fine gold chain",
  },
  {
    id: 3,
    name: "DIAMOND STUD EARRINGS",
    price: "₹9,800",
    image: "/home/herosection/hero-center.png",
    description: "Everyday essentials with timeless shine",
  },
  {
    id: 4,
    name: "DIAMOND TENNIS BRACELET",
    price: "₹28,500",
    image: "/home/herosection/hero-center.png",
    description: "Continuous sparkle with a refined look",
  },
  {
    id: 5,
    name: "DIAMOND SOLITAIRE RING",
    price: "₹24,500",
    image: "/home/herosection/hero-center.png",
    description: "Classic round-cut solitaire set in white gold",
  },
  {
    id: 6,
    name: "GOLD PENDANT NECKLACE",
    price: "₹10,500",
    image: "/home/herosection/hero-center.png",
    description: "Elegant pendant on a fine gold chain",
  },
  {
    id: 7,
    name: "DIAMOND STUD EARRINGS",
    price: "₹9,800",
    image: "/home/herosection/hero-center.png",
    description: "Everyday essentials with timeless shine",
  },
  {
    id: 8,
    name: "DIAMOND TENNIS BRACELET",
    price: "₹28,500",
    image: "/home/herosection/hero-center.png",
    description: "Continuous sparkle with a refined look",
  },
  {
    id: 9,
    name: "DIAMOND SOLITAIRE RING",
    price: "₹24,500",
    image: "/home/herosection/hero-center.png",
    description: "Classic round-cut solitaire set in white gold",
  },
  {
    id: 10,
    name: "GOLD PENDANT NECKLACE",
    price: "₹10,500",
    image: "/home/herosection/hero-center.png",
    description: "Elegant pendant on a fine gold chain",
  },
  {
    id: 11,
    name: "DIAMOND STUD EARRINGS",
    price: "₹9,800",
    image: "/home/herosection/hero-center.png",
    description: "Everyday essentials with timeless shine",
  },
  {
    id: 12,
    name: "DIAMOND TENNIS BRACELET",
    price: "₹28,500",
    image: "/home/herosection/hero-center.png",
    description: "Continuous sparkle with a refined look",
  },
];

export default function page() {
  return (
    <section className="bg-[#f8f8f8] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif">Explore All Jewellery</h2>
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
            Crafted with precision and attention to detail, this diamond halo ring
            features a stunning centre stone surrounded by smaller diamonds.
          </p>
        </div>

        {/* Filter + Sort */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
          <button className="flex items-center gap-2">
            ⚲ HIDE FILTERS
          </button>

          <button>SORT BY ▾</button>
        </div>

        {/* Products Grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-6
        ">
          {products.map((product) => (
            <div key={product.id} className="group">

              {/* Image */}
              <div className="bg-[#eae7e2] flex items-center justify-center overflow-hidden h-60">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover group-hover:scale-105 transition duration-300 w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold tracking-wide">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {product.description}
                </p>
                <p className="mt-2 font-medium">{product.price}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}