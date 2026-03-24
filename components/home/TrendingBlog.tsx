import Link from "next/link";

const blogs = [
  {
    title: "How to Style Jewellery for Every Occasion",
    description:
      "Discover simple tips to elevate your look with the right pieces, from casual days to special events.",
    image: "/home/brandsection/card1.png",
    slug: "/home/brandsection/card1.png",
  },
  {
    title: "Top Jewellery Trends You Need to Know",
    description:
      "Explore the latest trends shaping modern jewellery and how to wear them effortlessly.",
    image: "/home/herosection/hero-right-bottom.png",
    slug: "/blog/jewellery-trends",
  },
  {
    title: "Choosing the Perfect Gift",
    description:
      "A guide to finding meaningful jewellery gifts for your loved ones.",
    image: "/home/herosection/hero-right-top.png",
    slug: "/blog/perfect-gift",
  },
  {
    title: "Caring for Your Jewellery",
    description:
      "Keep your pieces shining with these easy care and maintenance tips.",
    image: "/home/categorysection/category-one.png",
    slug: "/home/categorysection/category-one.png",
  },
];

export default function TrendingBlogs() {
  return (
    <section className="bg-[#f5f5f5] py-5 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold mb-10 font-serif">
          Trending Blogs
        </h2>

        {/* BLOG GRID */}
        <div className="flex overflow-x-scroll sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 scrollbar-hide">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="w-[200px] h-[200px] sm:h-auto flex-shrink-0 sm:w-auto bg-white rounded-xl overflow-hidden border border-gray-300 hover:shadow-md transition flex flex-col h-full"
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-[100px]  sm:h-[180px] object-cover hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 text-center flex flex-col flex-grow justify-between">
                
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-gray-500 mb-4 line-clamp-3">
                    {blog.description}
                  </p>
                </div>

                <Link
                  href={blog.slug}
                  className="inline-block border border-gray-300 text-xs px-4 py-2 rounded-full hover:bg-gray-100 transition"
                >
                  READ MORE
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}