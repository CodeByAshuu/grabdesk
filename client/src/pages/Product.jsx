import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import FilterPanel from "../components/FilterPannel";
import api from "../api/axios";

function Product() {
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pages, setPages] = useState(1);
  const location = useLocation();
  const initialCategory = location.state?.category;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products?pageNumber=${pageNumber}`);
        // Handle paginated response structure
        const { products, page, pages } = res.data;

        console.log("Raw API Response:", products); // Debug log

        const formattedProducts = products.map(p => {
          // Normalize data with robust fallbacks
          return {
            id: p._id || p.id,
            name: p.productName || p.name || "No Name",
            price: p.formattedPrice || p.originalPriceString || (p.price ? `₹ ${p.price}` : "₹ 0"),
            priceNumber: p.discountedPrice || p.finalPrice || p.price || 0,
            basePrice: p.basePrice || 0,
            rating: p.stars || p.ratingAverage || p.rating || 0,
            tag: (Array.isArray(p.tags) && p.tags.length > 0) ? (p.tags[0].value || p.tags[0]) : (p.tag || "New"),
            images: (p.images && p.images.length > 0) ? p.images : [],
            category: p.category || "General",
            brand: p.brand || "Generic",
            discount: p.discountPercent || p.discount || 0
          };
        });

        console.log("Normalized Products:", formattedProducts); // Debug log
        setProducts(formattedProducts);
        setPages(pages);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber]);

  const initialFilters = useMemo(() => ({
    categories: initialCategory ? [initialCategory] : []
  }), [initialCategory]);

  const [activeFilters, setActiveFilters] = useState(initialFilters);

  // Handle filter changes from FilterPanel
  const handleFilterChange = (filters) => {
    console.log('Applied filters:', filters);
    setActiveFilters(filters);
  };

  // Apply search and filters to products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      filtered = filtered.filter(product =>
        activeFilters.categories.includes(product.category)
      );
    }

    // Apply brand filter
    if (activeFilters.brands && activeFilters.brands.length > 0) {
      filtered = filtered.filter(product =>
        activeFilters.brands.includes(product.brand)
      );
    }

    // Apply price range filter
    if (activeFilters.priceRange) {
      const [minPrice, maxPrice] = activeFilters.priceRange;
      filtered = filtered.filter(product => {
        return product.priceNumber >= minPrice && product.priceNumber <= maxPrice;
      });
    }

    // Apply rating filter
    if (activeFilters.rating) {
      filtered = filtered.filter(product =>
        product.rating >= activeFilters.rating
      );
    }

    // Apply discount filter
    if (activeFilters.discount) {
      filtered = filtered.filter(product =>
        product.discount >= activeFilters.discount
      );
    }

    // Apply sort
    if (activeFilters.sortBy) {
      switch (activeFilters.sortBy) {
        case 'Price: Low → High':
          filtered.sort((a, b) => a.priceNumber - b.priceNumber);
          break;
        case 'Price: High → Low':
          filtered.sort((a, b) => b.priceNumber - a.priceNumber);
          break;
        case 'Newest First':
          filtered.sort((a, b) => b.id - a.id);
          break;
        default:
          // Relevance - keep original order
          break;
      }
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <>
      <section
        className="min-h-screen w-full overflow-hidden text-[#5b3d25]"
        style={{
          backgroundColor: "#442314",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 14px",
        }}
      >
        <Navbar />

        {/* TITLE */}
        <div className="my-8 sm:my-10 md:my-12 lg:my-14 mx-4 sm:mx-5">
          <h1 className="boldonse-bold text-[#E3D5C3] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            PRODUCTS
          </h1>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 items-start px-4 md:px-6 lg:px-8 mt-5">
          <div className="w-full flex justify-center items-center gap-3">
            <div className="flex-1 max-w-2xl">
              <Searchbar
                value={search}
                onChange={setSearch}
                width="100%"
                height="45px"
                placeholder="Search products, categories, brands..."
              />
            </div>


            <button
              onClick={() => {
                console.log("Search clicked with:", search);
              }}
              className="hidden sm:flex h-12 rounded-md border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] bg-[#FFE9D5] items-center justify-center px-3 gap-2 hover:bg-[#f5dec9] 
              active:shadow-none active:translate-x-1 active:translate-y-1 
         transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#452215]"
                viewBox="0 -960 960 960"
                fill="#452215">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109
         0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5
         T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>

            </button>


            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden bg-[#8F5E41] text-white px-4 sm:px-6 py-3 sm:py-3 rounded-lg 
               border-2 border-[#452215] shadow-[2px_2px_0_#452215]
               hover:bg-[#7A4F35] transition-all duration-200 font-semibold text-sm"
            >
              {isFilterOpen ? 'Filters' : 'Filters'}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">

          {/* Filter Panel - Desktop */}
          <div className="hidden lg:block lg:w-80 shrink-0">
            <FilterPanel
              open={true}
              onFilterChange={handleFilterChange}
              initialFilters={initialFilters}
            />
          </div>

          {/* Mobile Filter Panel - Only when toggled */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Overlay */}
              <div
                className="flex-1 bg-black bg-opacity-50"
                onClick={() => setIsFilterOpen(false)}
              />

              {/* Filter Panel Slide-in */}
              <div className="w-4/5 max-w-xs h-full overflow-y-auto bg-[#FFE9D5]">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#452215] font-bold text-2xl">Filters</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-[#8F5E41] hover:text-[#452215] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <FilterPanel
                    open={isFilterOpen}
                    onFilterChange={handleFilterChange}
                    initialFilters={initialFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 sm:mb-6 px-2">
              <p className="text-[#E3D5C3] gowun-dodum-regular text-sm sm:text-base">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                {search && ` for "${search}"`}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#E3D5C3] text-lg gowun-dodum-regular">
                  No products found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-2 
                xl:grid-cols-3 
                gap-4 
                sm:gap-6
                lg:gap-6 
                xl:gap-8 
                justify-items-center
              ">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      images={product.images}
                      tagg={product.tag}
                      rating={product.rating}
                      namee={product.name}
                      pricee={product.price}
                      priceNum={product.priceNumber}
                      basePrice={product.basePrice}
                      discount={product.discount}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    {[...Array(pages).keys()].map((x) => (
                      <button
                        key={x + 1}
                        onClick={() => setPageNumber(x + 1)}
                        className={`px-4 py-2 rounded-md font-bold transition-colors ${pageNumber === x + 1
                          ? "bg-[#f0a224] text-[#442314]"
                          : "bg-[#FFE9D5] text-[#442314] hover:bg-[#f0a224] hover:text-[#442314]"
                          }`}
                      >
                        {x + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8 sm:h-12 lg:h-16"></div>
      </section>
    </>
  );
}

export default Product;