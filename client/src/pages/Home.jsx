import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Nike1 from "../assets/Nike1.png";
import Nike2 from "../assets/Nike2.png";
import Nike3 from "../assets/Nike3.png";
import Hero from "../assets/hero-banner.png";
import Button from "../components/Button";
import Banner from "../components/Banner";

// Mock Data
const categories = [
  {
    name: "Electronics",
    image:
      "../src/assets/cat-electronics.png",
  },
  {
    name: "Home",
    image:
      "../src/assets/cat-home.png",
  },
  {
    name: "Fashion",
    image:
      "../src/assets/cat-electronics.png",
  },
  {
    name: "Beauty",
    image:
      "../src/assets/cat-electronics.png",
  },
  {
    name: "Fitness",
    image:
      "../src/assets/cat-electronics.png",
  },
  {
    name: "Books",
    image:
      "../src/assets/cat-electronics.png",
  },
];

const recommendations = [
  { id: 1, name: "Vintage Lamp", price: "₹ 4,500", rating: 4.8, image: Nike1 },
  { id: 2, name: "Ergo Chair", price: "₹ 12,000", rating: 4.9, image: Nike2 },
  { id: 3, name: "Wooden Desk", price: "₹ 25,000", rating: 4.7, image: Nike3 },
  {
    id: 4,
    name: "Leather Notebook",
    price: "₹ 1,200",
    rating: 4.6,
    image: Nike1,
  },
  { id: 5, name: "Brass Pen", price: "₹ 850", rating: 4.5, image: Nike2 },
];

const topDeals = [
  {
    id: 1,
    name: "Noise Cancelling Headphones",
    price: "₹ 8,999",
    rating: 4.8,
    tag: "HOT",
    image: Nike3,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: "₹ 6,500",
    rating: 4.9,
    tag: "SALE",
    image: Nike1,
  },
  {
    id: 3,
    name: "Monitor Stand",
    price: "₹ 2,500",
    rating: 4.5,
    tag: "NEW",
    image: Nike2,
  },
  {
    id: 4,
    name: "Desk Organizer",
    price: "₹ 1,500",
    rating: 4.6,
    tag: "BEST",
    image: Nike3,
  },
];

function Home() {
  const heroImages = [Hero, Nike1, Nike2, Nike3];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-[#5b3d25] bg-[#f3eadc]">
      <div
        className="w-full"
        style={{
          backgroundColor: "#f3eadc",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 14px",
        }}
      >
        <Navbar />
        {/* ========== HERO SECTION ========== */}
        <section className="relative w-full min-h-[600px] md:h-screen flex flex-col md:flex-row items-center justify-center px-6 pt-20 md:pt-0">
          {/* Text Content */}
          <div className="w-full md:w-1/2 z-10 flex flex-col items-center md:items-start text-center md:text-left mb-10 md:mb-0">
            <h1
              className="boldonse-bold text-[#F0A322] text-[15vw] md:text-[10vw] lg:text-[8rem] leading-[0.8]"
              style={{
                textShadow:
                  "4px 4px 0 #5b3d25, 8px 8px 0 rgba(91, 61, 37, 0.45)",
              }}
            >
              GRABDESK
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-md font-medium text-[#5b3d25]">
              Your curated vintage and workspace essentials. Find desks, chairs,
              lighting, and unique decor that tell a story.
            </p>
            <div className="mt-8">
              <Link to="/product">
                <Button labell="START SHOPPING" />
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-1/2 relative flex justify-center items-center">
            <div className="relative w-[280px] sm:w-[400px] md:w-[500px] lg:w-[600px]">
              <div className="absolute inset-0 bg-[#f0a224] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
              <img
                src={heroImages[currentHeroIndex]}
                alt="Hero Banner"
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-all duration-500"
                key={currentHeroIndex}
              />
            </div>
          </div>
        </section>

        {/* ========== TRENDING CATEGORIES ========== */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="boldonse-bold text-3xl md:text-5xl mb-10 text-center text-[#5b3d25]">
            TRENDING <span className="text-[#f0a224]">CATEGORIES</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <Link
                to="/product"
                key={index}
                className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-[4px_4px_0_#8F5E41] hover:shadow-xl transition-all"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 group-hover:bg-black/10 transition-colors"></div>
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-[#f3eadc] text-xl font-bold uppercase tracking-wider border-2 border-[#f3eadc] px-4 py-2">
                    {cat.name}
                  </h3>
                </div> */}
              </Link>
            ))}
          </div>
        </section>

        {/* ========== PERSONALIZED RECOMMENDATIONS ========== */}
        <section className="py-16 bg-[#442314] text-[#f3eadc] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="boldonse-bold text-3xl md:text-5xl mb-2">
                  RECOMMENDED FOR YOU
                </h2>
                <p className="text-[#dab590] text-sm md:text-base">
                  Curated picks based on your style.
                </p>
              </div>
              <Link
                to="/product"
                className="hidden md:block text-[#f0a224] hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-16 justify-items-center">
              {[...recommendations, ...recommendations, ...recommendations.slice(0, 2)].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="w-full flex justify-center"
                >
                  <ProductCard
                    images={[item.image, item.image, item.image]}
                    tagg="FOR YOU"
                    rating={item.rating}
                    namee={item.name}
                    pricee={item.price}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== TOP DEALS ========== */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="boldonse-bold text-3xl md:text-5xl mb-10 text-center text-[#5b3d25]">
            TOP <span className="text-[#f0a224]">DEALS</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {topDeals.map((item) => (
              <ProductCard
                key={item.id}
                images={[item.image, item.image, item.image]}
                tagg={item.tag}
                rating={item.rating}
                namee={item.name}
                pricee={item.price}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/product">
              <Button labell="VIEW ALL DEALS" />
            </Link>
          </div>
        </section>

        {/* ========== PROMO BANNERS (change kr skte hain) ========== */}
        <Banner />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
