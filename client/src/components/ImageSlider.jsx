import React, { useState, useEffect } from "react";

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Image */}
      <img
        src={images[current]}
        className="h-auto w-auto object-contain transition-opacity duration-500 rounded-xl"
      />

      {/* Indicators */}
      <div className="flex gap-2 mt-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              current === index ? "bg-[#8F5E41] scale-110" : "bg-[#dedddc]"
            }`}
            onClick={() => setCurrent(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
