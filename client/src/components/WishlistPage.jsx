import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

// WishlistHeader Component
const WishlistHeader = ({ itemCount, onClearAll, onSortChange }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="inline-flex items-center gap-3 bg-[#5a2f1f] ring-2 ring-[#8F5E41] text-white px-6 py-3 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FFE9D5]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <div className="text-left">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#FFE9D5]">My Wishlist</h1>
            <div className="text-xs text-[#d4a574]">{itemCount} {itemCount === 1 ? 'item' : 'items'} saved</div>
          </div>
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

// WishlistItem Component
const WishlistItem = ({ item, onRemove }) => {
  const { addToast } = useToast();
  const [liked, setLiked] = useState(true);
  const availabilityClass = item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const availabilityText = item.available ? 'In Stock' : 'Out of Stock';

  // Handle both image URL (dummy data style) or images array (real data style)
  const displayImage = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : null);

  const initials = item.name ? item.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : 'PD';

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (liked) {
      setTimeout(() => onRemove(item.id), 300);
    }
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (item.available) {
      addToast(`Adding ${item.name} to cart!`, "success");
    } else {
      addToast(`${item.name} is currently out of stock`, "error");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToast(`${item.name} added to cart!`, "success");
  };

  return (
    <div
      className="w-[310px] max-w-full sm:w-[300px] md:w-[310px] h-auto rounded-lg p-4 bg-[#FFE9D5] relative border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[7px_7px_0_#8F5E41] hover:-translate-y-1 mx-auto text-[#452215] cursor-pointer group"
      onClick={() => { /* navigate to product page */ }}
    >
      {/* Remove button */}
      <button
        onClick={handleLike}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 transition-all duration-200 active:scale-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-5 h-5 transition-all duration-300 ${liked ? 'text-red-500' : 'text-gray-400'}`} fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      {/* Availability Badge */}
      <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold ${availabilityClass}`}>
        {availabilityText}
      </div>

      {/* Image placeholder or real image */}
      <div className="w-full h-52 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4 mt-6 group-hover:scale-105 transition-transform duration-300">
        {displayImage ? (
          <img src={displayImage} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-5xl text-[#452215] font-extrabold opacity-30">{initials}</div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 20 20" className={`w-4 h-4 ${i < Math.round(item.rating || 0) ? 'fill-current' : 'fill-current opacity-20'}`}>
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-[#6b4a3f] font-semibold">{item.rating?.toFixed(1) || '0.0'}</span>
      </div>

      {/* Product Name */}
      <h3 className="text-lg font-extrabold mb-3 line-clamp-2 min-h-[3.5rem]">{item.name}</h3>

      {/* Price and Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-[#6b4a3f] uppercase tracking-wide">Price</p>
            <p className="text-2xl font-bold text-[#452215]">
              {/* Display original string if available, otherwise formatted number */}
              {item.originalPriceString || `₹ ${item.price?.toFixed(2)}`}
            </p>
          </div>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#8F5E41] hover:bg-[#6b4a3f] text-white py-2.5 rounded-lg shadow-md transition-colors duration-200 font-semibold text-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuy}
            disabled={!item.available}
            className={`flex-1 py-2.5 rounded-lg shadow-md transition-colors duration-200 font-semibold text-sm ${item.available
              ? 'bg-[#452215] hover:bg-[#5a2f1f] text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Buy Now
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
    <div className="min-h-screen py-12 px-6 bg-[#452215] text-[#f5e6d3]">
      <div className="max-w-6xl mx-auto">
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
              <WishlistItem key={item.id} item={item} onRemove={removeFromWishlist} />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-block bg-[#5a2f1f] px-6 py-4 rounded-lg border-2 border-[#8F5E41]">
              <p className="text-[#FFE9D5] font-semibold">
                Total Wishlist Value: <span className="text-2xl text-[#d4a574]">₹ {items.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;