import { useState, useEffect, useRef } from 'react';

const FilterPanel = ({ open, onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState({
    categories: initialFilters?.categories || [],
    brands: [],
    priceRange: [100, 200000],
    rating: null,
    discount: null,
    sortBy: 'Relevance',
    brandSearch: ''
  });

  const [collapsedSections, setCollapsedSections] = useState({
    categories: !initialFilters?.categories?.length, // Open if initial filters exist
    brands: false,
    priceRange: false, // Always false since price range is not collapsible
    rating: false,
    discount: false,
    sort: false
  });

  const collapseOrder = useRef([]); // Track the order of collapsed sections

  const categories = [
    'Electronics', 'Fashion', 'Home & Living', 'Beauty & Personal Care',
    'Sports & Fitness', 'Books & Stationery', 'Grocery', 'Toys & Baby Products'
  ];

  const brands = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Puma', 'Sony',
    'LG', 'Microsoft', 'Canon', 'Dell', 'HP', 'Lenovo'
  ];

  const ratings = [
    { value: 4, label: '4★ & above' },
    { value: 3, label: '3★ & above' },
    { value: 2, label: '2★ & above' }
  ];

  const discounts = [
    { value: 10, label: '10% and above' },
    { value: 20, label: '20% and above' },
    { value: 30, label: '30% and above' },
    { value: 50, label: '50% and above' }
  ];

  const sortOptions = [
    'Relevance',
    'Price: Low → High',
    'Price: High → Low',
    'Newest First'
  ];

  // Smart toggle with max 3 collapsed sections logic
  const toggleSection = (section) => {
    setCollapsedSections(prev => {
      const newState = { ...prev };
      const isCurrentlyCollapsed = newState[section];

      if (!isCurrentlyCollapsed) {
        // We're about to collapse this section
        const currentlyCollapsedCount = Object.values(newState).filter(val => val === true).length;

        if (currentlyCollapsedCount >= 3) {
          // Find the first collapsed section (excluding the one we're trying to collapse)
          const collapsibleSections = ['categories', 'brands', 'rating', 'discount', 'sort'];
          for (const s of collapsibleSections) {
            if (s !== section && newState[s] === true) {
              newState[s] = false; // Open the first found collapsed section

              // Update collapse order
              const index = collapseOrder.current.indexOf(s);
              if (index > -1) {
                collapseOrder.current.splice(index, 1);
              }
              break;
            }
          }
        }

        newState[section] = true;
        collapseOrder.current.push(section);
      } else {
        // We're expanding this section
        newState[section] = false;

        // Remove from collapse order
        const index = collapseOrder.current.indexOf(section);
        if (index > -1) {
          collapseOrder.current.splice(index, 1);
        }
      }

      return newState;
    });
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];

      return { ...prev, categories: newCategories };
    });
  };

  // Handle brand selection
  const handleBrandChange = (brand) => {
    setFilters(prev => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];

      return { ...prev, brands: newBrands };
    });
  };

  // Handle price range change
  const handlePriceChange = (min, max) => {
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  // Handle rating selection
  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? null : rating }));
  };

  // Handle discount selection
  const handleDiscountChange = (discount) => {
    setFilters(prev => ({ ...prev, discount: prev.discount === discount ? null : discount }));
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  // Handle brand search
  const handleBrandSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, brandSearch: searchTerm }));
  };

  // Filter brands based on search
  const filteredBrands = brands.filter(brand =>
    brand.toLowerCase().includes(filters.brandSearch.toLowerCase())
  );

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [100, 200000],
      rating: null,
      discount: null,
      sortBy: 'Relevance',
      brandSearch: ''
    });
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(filters);
  };

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div
      className={`
        bg-[#FFE9D5] p-6 rounded-xl border-2 border-[#452215]
        shadow-[4px_4px_0_#8F5E41] 
        md:w-80
        h-fit sticky top-4 nunito-exbold
        ${open ? "block" : "hidden"}
        md:block
        transition-all duration-300
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#452215] font-bold text-2xl">Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-[#8F5E41] hover:text-[#452215] transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Categories - Collapsible */}
      <div className="mb-6 border-b border-[#8F5E41] pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex justify-between items-center w-full text-[#452215] font-semibold text-lg mb-2 hover:text-[#8F5E41] transition-colors"
        >
          <span>Category</span>
          {collapsedSections.categories ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M200-440v-80h560v80H200Z" />
            </svg>
          )}
        </button>

        <div className={`gowun-dodum-regular overflow-hidden transition-all duration-300 ${collapsedSections.categories ? 'max-h-0' : 'max-h-96'}`}>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-3 w-4 h-4 text-[#8F5E41] bg-[#FFE9D5] border-[#8F5E41] rounded focus:ring-[#8F5E41]"
                />
                <span className="text-[#452215] group-hover:text-[#8F5E41] transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Brand - Collapsible */}
      <div className="mb-6 border-b border-[#8F5E41] pb-4">
        <button
          onClick={() => toggleSection('brands')}
          className="flex justify-between items-center w-full text-[#452215] font-semibold text-lg mb-2 hover:text-[#8F5E41] transition-colors"
        >
          <span>Brand</span>
          {collapsedSections.brands ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M200-440v-80h560v80H200Z" />
            </svg>
          )}
        </button>

        <div className={`gowun-dodum-regular overflow-hidden transition-all duration-300 ${collapsedSections.brands ? 'max-h-0' : 'max-h-96'}`}>
          <input
            type="text"
            placeholder="Search brand..."
            value={filters.brandSearch}
            onChange={(e) => handleBrandSearch(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-[#8F5E41] text-[#452215] bg-[#FFE9D5] 
                     placeholder-[#8F5E41] focus:outline-none focus:border-[#452215] transition-colors mb-3"
          />
          <div className="space-y-2">
            {filteredBrands.map(brand => (
              <label key={brand} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-3 w-4 h-4 text-[#8F5E41] bg-[#FFE9D5] border-[#8F5E41] rounded focus:ring-[#8F5E41]"
                />
                <span className="text-[#452215] group-hover:text-[#8F5E41] transition-colors">
                  {brand}
                </span>
              </label>
            ))}
            {filteredBrands.length === 0 && (
              <p className="text-[#8F5E41] text-sm">No brands found</p>
            )}
          </div>
        </div>
      </div>

      {/* Price Range - NOT Collapsible */}
      <div className="mb-6 border-b border-[#8F5E41] pb-4">
        <div className="flex justify-between items-center w-full text-[#452215] font-semibold text-lg mb-2">
          <span>Price Range</span>
        </div>
        <div className="gowun-dodum-regular">
          <div className="space-y-4 pt-1">
            <input
              type="range"
              min="100"
              max="200000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
              className="w-full h-2 bg-[#8F5E41] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm">
              <span className="text-[#452215] font-medium">₹{filters.priceRange[0].toLocaleString()}</span>
              <span className="text-[#452215] font-medium">₹{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings - Collapsible */}
      <div className="mb-6 border-b border-[#8F5E41] pb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex justify-between items-center w-full text-[#452215] font-semibold text-lg mb-2 hover:text-[#8F5E41] transition-colors"
        >
          <span>Customer Rating</span>
          {collapsedSections.rating ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M200-440v-80h560v80H200Z" />
            </svg>
          )}
        </button>

        <div className={`gowun-dodum-regular overflow-hidden transition-all duration-300 ${collapsedSections.rating ? 'max-h-0' : 'max-h-96'}`}>
          <div className="space-y-2 pt-1">
            {ratings.map(rating => (
              <label key={rating.value} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating.value}
                  onChange={() => handleRatingChange(rating.value)}
                  className="mr-3 w-4 h-4 text-[#8F5E41] bg-[#FFE9D5] border-[#8F5E41] focus:ring-[#8F5E41]"
                />
                <span className="text-[#452215] group-hover:text-[#8F5E41] transition-colors">
                  {rating.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Discounts - Collapsible */}
      <div className="mb-6 border-b border-[#8F5E41] pb-4">
        <button
          onClick={() => toggleSection('discount')}
          className="flex justify-between items-center w-full text-[#452215] font-semibold text-lg mb-2 hover:text-[#8F5E41] transition-colors"
        >
          <span>Discount</span>
          {collapsedSections.discount ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M200-440v-80h560v80H200Z" />
            </svg>
          )}
        </button>

        <div className={`gowun-dodum-regular overflow-hidden transition-all duration-300 ${collapsedSections.discount ? 'max-h-0' : 'max-h-96'}`}>
          <div className="space-y-2 pt-1">
            {discounts.map(discount => (
              <label key={discount.value} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name="discount"
                  checked={filters.discount === discount.value}
                  onChange={() => handleDiscountChange(discount.value)}
                  className="mr-3 w-4 h-4 text-[#8F5E41] bg-[#FFE9D5] border-[#8F5E41] focus:ring-[#8F5E41]"
                />
                <span className="text-[#452215] group-hover:text-[#8F5E41] transition-colors">
                  {discount.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sort - Collapsible */}
      <div className="mb-2">
        <button
          onClick={() => toggleSection('sort')}
          className="flex justify-between items-center w-full text-[#452215] font-semibold text-lg mb-2 hover:text-[#8F5E41] transition-colors"
        >
          <span>Sort By</span>
          {collapsedSections.sort ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#452215">
              <path d="M200-440v-80h560v80H200Z" />
            </svg>
          )}
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${collapsedSections.sort ? 'max-h-0' : 'max-h-96'}`}>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-[#8F5E41] text-[#452215] bg-[#FFE9D5] 
                     focus:outline-none focus:border-[#452215] transition-colors cursor-pointer gowun-dodum-regular"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply Button for Mobile */}
      <button
        onClick={applyFilters}
        className="w-full mt-6 py-3 bg-[#8F5E41] text-white font-semibold rounded-lg
                 border-2 border-[#452215] shadow-[2px_2px_0_#452215]
                 hover:bg-[#7A4F35] hover:shadow-[3px_3px_0_#452215] 
                 active:shadow-[1px_1px_0_#452215] active:translate-x-0.5 active:translate-y-0.5
                 transition-all duration-200 md:hidden"
      >
        Apply Filters
      </button>

      <style >{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #452215;
          cursor: pointer;
          border: 2px solid #8F5E41;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #452215;
          cursor: pointer;
          border: 2px solid #8F5E41;
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;