import React from "react";

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  if (!isOpen) return null;

  const [data, setData] = React.useState(product);

  const handleChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-[#5b3d25]">Edit Product</h2>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            value={data.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            value={data.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
          />

          <textarea
            className="w-full border p-2 rounded"
            value={data.description}
            rows="3"
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-[#5b3d25]"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(data)}
            className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
