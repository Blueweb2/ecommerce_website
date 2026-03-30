import { useState } from "react";

type CarouselProps = {
  setZooming: React.Dispatch<React.SetStateAction<boolean>>;
};

const images = [
  "/home/categorysection/category-one.png",
  "/home/herosection/hero-center.png",
  "/home/shopsection/shop-one.png",
  "/home/herosection/hero-right-bottom.png",
];

const Carousel = ({ setZooming }: CarouselProps) => {

  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [hideCursor, setHideCursor] = useState(false);
  const [indexx, setIndex] = useState(0);

  const nextSlide = () => {
    if (indexx < images.length - 1) {
      setIndex(indexx + 1);
    };
  };

  const prevSlide = () => {
    if (indexx > 0) {
      setIndex(indexx - 1);
    };
  };

  return (
    <div className="flex items-center justify-center h-[400px] lg:min-h-screen" 
      onClick={()=>setZooming(false)}
    >
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setLeftPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        className="relative w-full max-w-7xl mx-auto overflow-hidden cursor-none group"
      >
      
        {/* Slides */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${indexx * 100}%)`,
          }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-full">
              <img
                src={img}
                alt=""
                className="w-full h-full lg:h-[600px]  object-cover"
              />
            </div>
          ))}
        </div>

        {/* Left Button */}
        <button
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={(e) => {
            e.stopPropagation()
            prevSlide()
          }}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ◀
        </button>

        {/* Right Button */}
        <button
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ▶
        </button>

        {/* Custom Cursor */}
        <div
          className={`pointer-events-none absolute w-10 h-10 bg-black/60 rounded-full 
          ${hideCursor ? "opacity-0" : "opacity-0 group-hover:opacity-100"} 
          transition flex items-center justify-center leading-none text-white`}
          style={{
            left: leftPos.x - 20,
            top: leftPos.y - 20,
          }}
        >
          <span className="scale-190">&times;</span>
        </div>

        {/* buttons */}
        <div
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={(e) => e.stopPropagation()}
          className="flex gap-3 items-center justify-center h-6 lg:h-12 cursor-auto"
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setIndex(index)
              }}
              className={`rounded-full transform transition-all duration-300 ease-out ${
                indexx === index
                  ? "w-4 h-4 bg-black scale-125"
                  : "w-2.5 h-2.5 bg-gray-400 scale-100 hover:bg-black"
              }`}
            />
          ))}
        </div>

      </div>
   </div> 
  )
}

export default Carousel;