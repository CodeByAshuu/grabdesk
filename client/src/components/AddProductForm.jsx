import React, { useState } from "react";

// Allowed categories and brands (must match backend)
const ALLOWED_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Living', 'Beauty & Personal Care',
  'Sports & Fitness', 'Books & Stationery', 'Grocery', 'Toys & Baby Products',
  'Storage', 'Furniture', 'Kitchen', 'Automotive', 'Health', 'Office Supplies'
];

const ALLOWED_BRANDS = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Puma', 'Sony',
  'LG', 'Microsoft', 'Canon', 'Dell', 'HP', 'Lenovo', 'Grabdesk'
];

const AddProductForm = ({ isOpen, onClose, onAdd }) => {
  const [images, setImages] = useState([null, null, null]); // must have 3
  const [form, setForm] = useState({
    name: "",
    category: "Electronics", // Keep for backward compatibility
    categories: ["Electronics"], // NEW: Support multiple categories
    description: "",
    basePrice: "",
    discountPercent: 0,
    stock: "",
    brand: "Grabdesk", // Default to valid brand
    model: "",
    color: "",
    material: "",
    tags: [],
    sizeAvailable: [],
  });



  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (name === "basePrice" || name === "discountPercent" || name === "stock") {
      setForm({ ...form, [name]: value === "" ? "" : Number(value) });
    } else if (name === "tags") {
      // Convert comma-separated string to array
      const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setForm({ ...form, [name]: tagsArray });
    } else if (name === "sizeAvailable") {
      // Convert comma-separated string to array
      const sizesArray = value.split(',').map(size => size.trim()).filter(size => size);
      setForm({ ...form, [name]: sizesArray });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle category checkbox toggle
  const handleCategoryToggle = (category) => {
    setForm(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];

      return {
        ...prev,
        categories: newCategories,
        category: newCategories[0] || 'Electronics' // Sync primary category
      };
    });
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...images];
      updated[index] = reader.result;
      setImages(updated);
    };
    reader.readAsDataURL(file);
  };

  const calculateFinalPrice = () => {
    const basePrice = parseFloat(form.basePrice) || 0;
    const discountPercent = parseFloat(form.discountPercent) || 0;

    if (basePrice > 0 && discountPercent > 0) {
      const discountAmount = basePrice * (discountPercent / 100);
      return (basePrice - discountAmount).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  const handleSubmit = () => {
    if (images.filter(Boolean).length < 1) {
      alert("Please upload at least 1 image.");
      return;
    }

    if (!form.name || !form.basePrice || !form.stock || !form.category) {
      alert("Please fill in all required fields: Name, Category, Base Price, and Stock.");
      return;
    }

    const newProduct = {
      name: form.name,
      description: form.description,
      basePrice: parseFloat(form.basePrice) || 0,
      discountPercent: parseFloat(form.discountPercent) || 0,
      finalPrice: parseFloat(calculateFinalPrice()),
      stock: parseInt(form.stock) || 0,
      isActive: true,
      category: form.categories[0] || form.category, // Primary category
      categories: form.categories.length > 0 ? form.categories : [form.category], // All categories
      tags: form.tags,
      brand: form.brand,
      model: form.model,
      color: form.color,
      material: form.material,
      sizeAvailable: form.sizeAvailable,
      images: images.filter(Boolean),
      ratingAverage: 0,
      ratingCount: 0,
    };

    onAdd(newProduct);

    // Reset form
    setForm({
      name: "",
      category: "Electronics",
      categories: ["Electronics"], // Reset to default
      description: "",
      basePrice: "",
      discountPercent: 0,
      stock: "",
      brand: "Grabdesk",
      model: "",
      color: "",
      material: "",
      tags: [],
      sizeAvailable: [],
    });
    setImages([null, null, null]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#FFE9D5] rounded-xl w-[95%] max-w-3xl p-6 text-[#452215] gowun-dodum-regular">

        <h2 className="text-xl font-bold mb-4 nunito-exbold">Add Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT SIDE — MULTIPLE IMAGES */}
          <div className="border border-[#5b3d25]/30 rounded-xl p-4 space-y-4">
            <p className="text-center font-semibold text-[#5b3d25] gowun-dodum-regular">
              Upload Product Images (min. 1)
            </p>

            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center bg-[#5b3d25]/5 relative border border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] cursor-pointer"
                  onClick={() =>
                    document.getElementById(`uploadImage${index}`).click()
                  }
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-xs text-[#5b3d25]/60">+ Image {index + 1}</p>
                  )}

                  <input
                    id={`uploadImage${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE — FORM FIELDS */}
          <div className="space-y-3">
            {/* First Row: Product Name */}
            <div>
              <input
                name="name"
                value={form.name}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Product Name *"
                onChange={handleChange}
                required
              />
            </div>

            {/* Categories Selection (Checkboxes) */}
            <div className="border border-[#5b3d25]/30 rounded-lg p-3 bg-[#f5f5f5]">
              <label className="block text-sm font-semibold text-[#5b3d25] mb-2">
                Categories * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {ALLOWED_CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-white/50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={form.categories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="w-4 h-4 text-[#8F5E41] bg-white border-[#5b3d25]/30 rounded focus:ring-[#8F5E41]"
                    />
                    <span className="text-sm text-[#5b3d25]">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Second Row: Base Price, Discount, Final Price */}
            <div className="grid grid-cols-3 gap-3">
              <input
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={form.basePrice}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Base Price *"
                onChange={handleChange}
                required
              />
              <input
                name="discountPercent"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.discountPercent}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Discount %"
                onChange={handleChange}
              />
              <input
                type="text"
                value={`Final: ₹${calculateFinalPrice()}`}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2 bg-gray-100"
                placeholder="Final Price"
                readOnly
              />
            </div>

            {/* Third Row: Stock, Brand */}
            <div className="grid grid-cols-2 gap-3">
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Stock *"
                onChange={handleChange}
                required
              />
              <div className="relative">
                <input
                  name="brand"
                  value={form.brand}
                  list="brand-suggestions"
                  className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                  placeholder="Brand (e.g., Apple, Nike...)"
                  onChange={handleChange}
                />
                <datalist id="brand-suggestions">
                  {ALLOWED_BRANDS.map(brand => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
                <p className="text-[10px] text-[#5b3d25]/60 mt-1">Type or select from suggestions</p>
              </div>
            </div>

            {/* Fourth Row: Model, Color, Material */}
            <div className="grid grid-cols-3 gap-3">
              <input
                name="model"
                value={form.model}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Model"
                onChange={handleChange}
              />
              <input
                name="color"
                value={form.color}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Color"
                onChange={handleChange}
              />
              <input
                name="material"
                value={form.material}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Material"
                onChange={handleChange}
              />
            </div>

            {/* Fifth Row: Tags and Sizes */}
            <div className="grid grid-cols-2 gap-3">
              <input
                name="tags"
                value={form.tags.join(', ')}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Tags (comma separated)"
                onChange={handleChange}
              />
              <input
                name="sizeAvailable"
                value={form.sizeAvailable.join(', ')}
                className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
                placeholder="Sizes (comma separated)"
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              className="w-full border border-[#5b3d25]/30 rounded-lg p-2 h-24 resize-none"
              placeholder="Description"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 active:translate-y-1 rounded-lg relative border border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 active:translate-y-1 text-[#452215] border rounded-lg bg-[#F0A322] relative border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
            onClick={handleSubmit}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;