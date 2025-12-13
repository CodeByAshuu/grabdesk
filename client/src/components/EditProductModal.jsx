import React from "react";

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  if (!isOpen) return null;

  const [data, setData] = React.useState(product);

  const handleChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-[#452215] gowun-dodum-regular ">
      <div className="bg-[#FFE9D5] rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-[#452215] nunito-exbold">Edit Product</h2>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded border-[#452215]"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <input
            className="w-full border p-2 rounded border-[#452215]"
            value={data.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <input
            className="w-full border p-2 rounded border-[#452215]"
            value={data.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
          />

          <textarea
            className="w-full border p-2 rounded border-[#452215]"
            value={data.description}
            rows="3"
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5 ">
          <button
            onClick={onClose}
            className="px-4 py-2  rounded-lg  border nunito-bold  flex items-center relative border-[#452215] shadow-[4px_4px_0_#8F5E41]  text-[#452215]  gap-2 transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(data)}
            className="px-4 py-2   rounded-lg  bg-[#F0A322]  border nunito-bold  flex items-center relative border-[#452215] shadow-[4px_4px_0_#8F5E41]  text-[#452215]  gap-2 transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
