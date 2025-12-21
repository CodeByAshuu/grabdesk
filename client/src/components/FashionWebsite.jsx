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
  const [newsletterEmail, setNewsletterEmail] = useState('');

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
      {/* Top Bar */}
      <div className="text-xs py-2 px-4 text-center" style={{ backgroundColor: '#5a2f1f', color: '#FFE9D5' }}>
        Sign up and get 20% off your first order. Sign Up Now
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#FFE9D5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="py-12">
              <p className="text-sm tracking-[0.3em] text-gray-600 mb-4">{heroSlides[currentSlide].tagline}</p>
              <h2 className="text-6xl md:text-7xl font-serif mb-2">{heroSlides[currentSlide].title}</h2>
              <h2 className="text-6xl md:text-7xl font-serif italic mb-8">{heroSlides[currentSlide].subtitle}</h2>
              <button onClick={() => navigate('/product')} className="px-8 py-3 rounded-sm transition mb-4" style={{ backgroundColor: '#5a2f1f', color: '#FFE9D5' }}>
                SHOP NOW
              </button>
              <div className="text-sm text-gray-600">
                MORE PRODUCTS →
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[600px]">
              <img
                src={heroSlides[currentSlide].image}
                alt="Fashion Model"
                className="absolute right-0 h-full w-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={() => setCurrentSlide(currentSlide === 0 ? 1 : 0)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide(currentSlide === 0 ? 1 : 0)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Casual Wear Section */}
      <div className="py-16" style={{ backgroundColor: '#FFF6EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif text-center mb-12">CASUAL WEAR</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {casualWear.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-[3/4]" style={{ backgroundColor: '#FFE9D5', border: '2px solid #452215', boxShadow: '4px 4px 0 #8F5E41' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const token = localStorage.getItem('token');
                      if (!token) {
                        addToast("Please login to website", "error", 1000);
                        return;
                      }

                      const prod = {
                        id: item.id,
                        name: item.name,
                        originalPriceString: item.price,
                        price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
                        rating: item.rating || 4.0,
                        images: [item.image],
                        available: true,
                      };

                      if (isInWishlist(item.id)) {
                        removeFromWishlist(item.id);
                        addToast(`${item.name} removed from wishlist`, 'info');
                      } else {
                        addToWishlist(prod);
                        addToast(`${item.name} added to wishlist`, 'success');
                      }
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    aria-label="Toggle wishlist"
                    style={{ backgroundColor: 'rgba(209,154,44,0.95)', color: 'white' }}
                  >
                    <FaHeart className={`w-4 h-4 ${isInWishlist(item.id) ? 'text-red-500' : 'text-white'}`} />
                  </button>
                </div>
                <h4 className="font-medium text-center mb-1" style={{ color: '#452215' }}>{item.name}</h4>
                <p className="text-gray-600 text-center text-sm">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Section */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-80">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop"
                alt="Collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white flex items-center justify-center p-12">
              <div className="text-center">
                <h3 className="text-4xl font-serif mb-4">Spring Collection</h3>
                <p className="text-5xl font-bold" style={{ color: '#8F5E41' }} mb-6>30% OFF</p>
                <button onClick={() => navigate('/product')} className="border-2 px-8 py-3 hover:bg-[#6b4a3f] hover:text-white transition" style={{ borderColor: '#8F5E41', backgroundColor: '#FFE9D5', color: '#452215' }}>
                  SHOP NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Trends */}
      <div className="py-16" style={{ backgroundColor: '#FFF6EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif text-center mb-12">CUSTOMER TRENDS</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {customerTrends.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3 aspect-[3/4]" style={{ backgroundColor: '#FFE9D5', border: '2px solid #452215', boxShadow: '4px 4px 0 #8F5E41' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h4 className="font-medium text-center text-sm mb-1" style={{ color: '#452215' }}>{item.name}</h4>
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-center text-sm">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <Footer />

    </div>
  );
}