import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

// WishlistHeader Component
const WishlistHeader = ({ itemCount, onClearAll, onSortChange }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* TITLE */}
        <div className="my-8 sm:my-10 md:my-12 lg:my-14 mx-4 sm:mx-5">
          <h1 className="boldonse-bold text-[#E3D5C3] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            WISHLIST
          </h1>
        </div>

        <div className="flex gap-3">
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#5a2f1f] text-[#FFE9D5] px-4 py-2 rounded-lg border-2 border-[#8F5E41] focus:outline-none focus:ring-2 focus:ring-[#d4a574] cursor-pointer"
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>

          <button
            onClick={onClearAll}
            className="bg-[#8F5E41] hover:bg-[#6b4a3f] text-white px-4 py-2 rounded-lg border-2 border-[#5a2f1f] transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

// Main WishlistPage Component
const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [sortBy, setSortBy] = useState('default');
  const navigate = useNavigate();

  const getSortedItems = () => {
    let sorted = [...wishlist];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  };

  const items = getSortedItems();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div className="min-h-screen bg-[#452215] text-[#f5e6d3]">
      <Navbar />
      <div className="w-full pr-16">
        <WishlistHeader
          itemCount={items.length}
          onClearAll={handleClearAll}
          onSortChange={handleSortChange}
        />

        {items.length === 0 ? (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-[#8F5E41] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#FFE9D5] mb-2">Your wishlist is empty</h2>
            <p className="text-[#d4a574] mb-6">Start adding items you love!</p>
            <button
              onClick={() => navigate("/product")}
              className="bg-[#FFE9D5] text-[#452215] px-6 py-3 rounded-lg font-semibold hover:bg-[#f5d4b0] transition-colors duration-200">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {items.map(item => (
              <ProductCard
                key={item.id}
                id={item.id}
                images={item.images}
                tagg={item.tag}
                rating={item.rating}
                namee={item.name}
                pricee={item.originalPriceString || `₹ ${item.price?.toFixed(2)}`}
                priceNum={item.price}
                buttonText="Move to Cart"
                moveToCart={true}
              />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="py-12 text-center">
            <div className="inline-block bg-[#5a2f1f] px-6 py-4 rounded-lg border-2 border-[#8F5E41]">
              <p className="text-[#FFE9D5] font-semibold">
                Total Wishlist Value: <span className="text-2xl text-[#d4a574]">₹ {items.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    < Footer/>
    </div>
  );
};

export default WishlistPage;