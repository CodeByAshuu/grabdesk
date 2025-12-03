import React, { useState } from "react";

function FilterBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden w-full px-4 mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full bg-[#F0A322] text-white py-2 rounded-xl 
          border-2 border-[#452215] shadow-[3px_3px_0_#452215]
          active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          Filters ⬇
        </button>
      </div>

      {/* FILTER PANEL */}
      <div
        className={`
          bg-[#FFE9D5] p-4 rounded-xl border-2 border-[#452215]
          shadow-[4px_4px_0_#8F5E41] 
          md:w-64
          ${open ? "block" : "hidden"}
          md:block
        `}
      >
        <h2 className="text-[#452215] font-bold text-xl mb-4">Filters</h2>

        {/* Universal Categories */}
        <div className="mb-5">
          <h3 className="text-[#452215] font-semibold mb-2">Category</h3>
          <div className="flex flex-col gap-1 text-[#452215]">
            <label><input type="checkbox" className="mr-2" /> Electronics</label>
            <label><input type="checkbox" className="mr-2" /> Fashion</label>
            <label><input type="checkbox" className="mr-2" /> Home & Living</label>
            <label><input type="checkbox" className="mr-2" /> Beauty & Personal Care</label>
            <label><input type="checkbox" className="mr-2" /> Sports & Fitness</label>
            <label><input type="checkbox" className="mr-2" /> Books & Stationery</label>
            <label><input type="checkbox" className="mr-2" /> Grocery</label>
            <label><input type="checkbox" className="mr-2" /> Toys & Baby Products</label>
          </div>
        </div>

        {/* Brand */}
        <div className="mb-5">
          <h3 className="text-[#452215] font-semibold mb-2">Brand</h3>
          <input
            type="text"
            placeholder="Search brand..."
            className="w-full p-2 rounded-md border border-[#452215] text-[#452215] bg-[#FFE9D5]"
          />
          <div className="mt-2 flex flex-col gap-1 text-[#452215] h-24 overflow-y-auto">
            <label><input type="checkbox" className="mr-2" /> Apple</label>
            <label><input type="checkbox" className="mr-2" /> Samsung</label>
            <label><input type="checkbox" className="mr-2" /> Nike</label>
            <label><input type="checkbox" className="mr-2" /> Adidas</label>
            <label><input type="checkbox" className="mr-2" /> Puma</label>
            <label><input type="checkbox" className="mr-2" /> Sony</label>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <h3 className="text-[#452215] font-semibold mb-2">Price Range</h3>
          <input type="range" min="100" max="200000" className="w-full" />
          <div className="flex justify-between text-sm text-[#452215]">
            <span>₹100</span>
            <span>₹2,00,000</span>
          </div>
        </div>

        {/* Customer Ratings */}
        <div className="mb-5">
          <h3 className="text-[#452215] font-semibold mb-2">Customer Rating</h3>
          <div className="flex flex-col gap-1 text-[#452215]">
            <label><input type="radio" name="rating" className="mr-2" /> 4★ & above</label>
            <label><input type="radio" name="rating" className="mr-2" /> 3★ & above</label>
            <label><input type="radio" name="rating" className="mr-2" /> 2★ & above</label>
          </div>
        </div>

        {/* Discounts */}
        <div className="mb-5">
          <h3 className="text-[#452215] font-semibold mb-2">Discount</h3>
          <div className="flex flex-col gap-1 text-[#452215]">
            <label><input type="radio" name="discount" className="mr-2" /> 10% and above</label>
            <label><input type="radio" name="discount" className="mr-2" /> 20% and above</label>
            <label><input type="radio" name="discount" className="mr-2" /> 30% and above</label>
            <label><input type="radio" name="discount" className="mr-2" /> 50% and above</label>
          </div>
        </div>

        {/* Sort */}
        <div className="mb-2">
          <h3 className="text-[#452215] font-semibold mb-2">Sort By</h3>
          <select className="w-full p-2 rounded-md border border-[#452215] text-[#452215] bg-[#FFE9D5]">
            <option>Relevance</option>
            <option>Price: Low → High</option>
            <option>Price: High → Low</option>
            <option>Newest First</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default FilterBar;
