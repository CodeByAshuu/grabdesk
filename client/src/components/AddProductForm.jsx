import React, { useState } from "react";

const AddProductForm = ({ isOpen, onClose, onAdd }) => {
  const [images, setImages] = useState([null, null, null]); // must have 3
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const handleSubmit = () => {
    if (images.filter(Boolean).length < 3) {
      alert("Please upload at least 3 images.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: form.title,
      category: form.category,
      description: form.description,
      price: form.price,
      stock: form.stock,
      status: "Active",
      images, // <--- all 3 images in array
      image: images[0], // main thumbnail
    };

    onAdd(newProduct);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#FFE9D5] rounded-xl w-[95%] max-w-3xl p-6 text-[#452215] gowun-dodum-regular">

        <h2 className="text-xl font-bold mb-4 nunito-exbold">Add Product</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* LEFT SIDE — MULTIPLE IMAGES */}
          <div className="border border-[#5b3d25]/30 rounded-xl p-4 space-y-4">
            <p className="text-center font-semibold text-[#5b3d25] gowun-dodum-regular">
              Upload Minimum 3 Images
            </p>

            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="w-20 h-20 sm:w-24 sm:h-24  rounded-lg flex items-center justify-center bg-[#5b3d25]/5  relative border border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41]  cursor-pointer"
                  onClick={() =>
                    document.getElementById(`uploadImage${index}`).click()
                  }
                >
                  {img ? (
                    <img
                      src={img}
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
            <input
              name="title"
              className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
              placeholder="Title"
              onChange={handleChange}
            />

            <input
              name="category"
              className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
              placeholder="Category"
              onChange={handleChange}
            />

            <textarea
              name="description"
              className="w-full border border-[#5b3d25]/30 rounded-lg p-2 h-20 resize-none"
              placeholder="Description"
              onChange={handleChange}
            />

            <input
              name="price"
              className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
              placeholder="Price"
              onChange={handleChange}
            />

            <input
              name="stock"
              className="w-full border border-[#5b3d25]/30 rounded-lg p-2"
              placeholder="Stock"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg relative border border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2  text-[#452215] border rounded-lg bg-[#F0A322]  relative border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
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
