import React, { useState, useEffect } from "react";

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);

  // Auto Slide - 3 sec ke liye
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Image Container - Fixed 1:1 Aspect Ratio */}
      <div className="
        w-full 
        aspect-square 
        flex 
        items-center 
        justify-center 
        bg-white 
        rounded-xl 
        overflow-hidden
        border border-[#E3D5C3]
        shadow-sm
      ">
        <img
          src={images[current]}
          className="
            w-full 
            h-full 
            object-cover 
            transition-opacity 
            duration-500
          "
          alt={`Product view ${current + 1}`}
        />
      </div>

      {/* Indicators */}
      <div className="flex gap-2 mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`
              w-2 
              h-2 
              sm:w-3 
              sm:h-3 
              rounded-full 
              cursor-pointer 
              transition-all 
              duration-300 
              transform
              hover:scale-125
              ${current === index
                ? "bg-[#8F5E41] scale-125"
                : "bg-[#dedddc] hover:bg-[#8F5E41]"
              }
            `}
            onClick={() => setCurrent(index)}
            aria-label={`Go to image ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;