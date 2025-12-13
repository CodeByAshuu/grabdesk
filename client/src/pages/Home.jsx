import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Nike1 from "../assets/Nike1.png";
import Nike2 from "../assets/Nike2.png";
import Nike3 from "../assets/Nike3.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import beauty from "../assets/Home-slider/beauty.jpg";
import books from "../assets/Home-slider/books.jpg";
import electronic from "../assets/Home-slider/electronic.jpg";
import fashion from "../assets/Home-slider/fashion.jpg";
import fitness from "../assets/Home-slider/fitness.jpg";
import home from "../assets/Home-slider/home.jpg";
import Button from "../components/Button";
import Banner from "../components/Banner";

// Mock Data
const categories = [
  {
    name: "Electronic",
    image: "/trending-cat/cat-electronic.avif",
  },
  {
    name: "Home",
    image: "/trending-cat/cat-furniture.avif",
  },
  {
    name: "Fashion",
    image: "/trending-cat/cat-fashion.jpg",
  },
  {
    name: "Beauty",
    image: "/trending-cat/cat-beauty.avif",
  },
  {
    name: "Fitness",
    image: "/trending-cat/cat-fitness.avif",
  },
  {
    name: "Books",
    image: "/trending-cat/cat-books.jpg",
  },
];

const recommendations = [
  { id: 1, name: "Vintage Lamp", price: "₹ 4,500", rating: 4.8, image: Nike1, Nike2, Nike3 },
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
    image: Nike1,
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
  const navigate = useNavigate();

  const heroSlides = [
    { img: fashion, title: "Fashion", category: "Fashion" },
    { img: home, title: "Home & Living", category: "Home & Living" },
    { img: beauty, title: "Beauty & Personal Care", category: "Beauty & Personal Care" },
    { img: books, title: "Books & Stationery", category: "Books & Stationery" },
    { img: electronic, title: "Electronics", category: "Electronics" },
    { img: fitness, title: "Sports & Fitness", category: "Sports & Fitness" }

  ];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleHeroClick = (category) => {
    navigate('/product', { state: { category } });
  };

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
        {/* ========== HERO SECTION (FULL SCREEN SLIDER) ========== */}
        <section className="relative w-full h-[90vh] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${index === currentHeroIndex ? "opacity-100 z-0 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              onClick={() => handleHeroClick(slide.category)}
            >
              <img
                src={slide.img}
                alt={`Hero Slide ${index + 1}`}
                className="w-full h-full object-cover z-0"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all hover:bg-black/20 z-10">
                <div className="text-center">
                  <h2 className="text-[#f3eadc] text-4xl md:text-6xl boldonse-bold drop-shadow-lg tracking-wider mb-4 opacity-200 animate-fadeIn"
                    style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                    {slide.title}
                  </h2>
                  <button className="px-6 py-2 border-2 border-[#f3eadc] text-[#f3eadc] font-bold uppercase tracking-widest hover:bg-[#f3eadc] hover:text-[#5b3d25] transition-all">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentHeroIndex ? "bg-[#f0a224] scale-125" : "bg-white/50 hover:bg-white"
                  }`}
              />
            ))}
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
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-[#f3eadc] text-xl md:text-2xl boldonse-bold tracking-wider drop-shadow-md">
                    {cat.name}
                  </h3>
                </div>
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
                    id={item.id}
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
                id={item.id}
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
