import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function FashionWebsite() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const casualWear = [
    { id: 1, name: 'Casual Wear', price: '$99.00', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop' },
    { id: 2, name: 'Elegant Dress', price: '$129.00', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop' },
    { id: 3, name: 'Elegant Dress', price: '$119.00', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop' },
    { id: 4, name: 'Workwear', price: '$149.00', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop' },
    { id: 5, name: 'Season Trends', price: '$139.00', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop' }
  ];

  const customerTrends = [
    { id: 1, name: 'Soul Wave', price: '$69.00', rating: 4, image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&h=400&fit=crop' },
    { id: 2, name: 'Soot Sweater', price: '$89.00', rating: 5, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=400&fit=crop' },
    { id: 3, name: 'Winter Warm', price: '$99.00', rating: 4, image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=300&h=400&fit=crop' },
    { id: 4, name: 'Spring Yellow', price: '$79.00', rating: 5, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop' },
    { id: 5, name: 'Little Topaz', price: '$109.00', rating: 4, image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=300&h=400&fit=crop' },
    { id: 6, name: 'Brown Coat', price: '$129.00', rating: 5, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop' }
  ];

  const heroSlides = [
    {
      title: "Elevate Your",
      subtitle: "Style!",
      tagline: "HELLO GORGEOUS",
      image: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=800&h=600&fit=crop"
    },
    {
      title: "New Season",
      subtitle: "Arrivals",
      tagline: "FRESH & STYLISH",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF6EE' }}>

      {/* ✅ Navbar */}
      <Navbar />

      {/* Top Bar */}
      <div
        className="text-xs py-2 px-4 text-center"
        style={{ backgroundColor: '#5a2f1f', color: '#FFE9D5' }}
      >
        Sign up and get 20% off your first order. Sign Up Now
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#FFE9D5' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[600px]">
            <div className="py-12">
              <p className="text-sm tracking-[0.3em] text-gray-600 mb-4">
                {heroSlides[currentSlide].tagline}
              </p>
              <h2 className="text-6xl font-serif mb-2">
                {heroSlides[currentSlide].title}
              </h2>
              <h2 className="text-6xl font-serif italic mb-8">
                {heroSlides[currentSlide].subtitle}
              </h2>
              <button
                onClick={() => navigate('/product')}
                className="px-8 py-3 rounded-sm mb-4"
                style={{ backgroundColor: '#5a2f1f', color: '#FFE9D5' }}
              >
                SHOP NOW
              </button>
            </div>

            <div className="relative h-[600px]">
              <img
                src={heroSlides[currentSlide].image}
                alt="Model"
                className="absolute right-0 h-full w-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Casual Wear */}
      <div className="py-16">
        <h3 className="text-3xl font-serif text-center mb-12">CASUAL WEAR</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-7xl mx-auto px-4">
          {casualWear.map(item => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img src={item.image} alt={item.name} />

                <button
                  onClick={() => {
                    if (isInWishlist(item.id)) {
                      removeFromWishlist(item.id);
                      addToast('Removed from wishlist', 'info');
                    } else {
                      addToWishlist({ ...item, price: Number(item.price.replace('$','')) });
                      addToast('Added to wishlist', 'success');
                    }
                  }}
                  className="absolute top-4 right-4 bg-yellow-500 p-2 rounded-full"
                >
                  <FaHeart className={isInWishlist(item.id) ? 'text-red-500' : 'text-white'} />
                </button>
              </div>

              <h4 className="text-center">{item.name}</h4>
              <p className="text-center text-sm">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Trends */}
      <div className="py-16">
        <h3 className="text-3xl font-serif text-center mb-12">CUSTOMER TRENDS</h3>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
