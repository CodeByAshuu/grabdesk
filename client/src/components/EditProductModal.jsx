import React from "react";

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  if (!isOpen) return null;

  const [data, setData] = React.useState(product);

  // Sync state when product prop changes
  React.useEffect(() => {
    setData(product);
  }, [product]);

  const handleChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Replace the first image or add if empty
        const currentImages = data.images ? [...data.images] : [];
        if (currentImages.length > 0) {
          currentImages[0] = reader.result;
        } else {
          currentImages.push(reader.result);
        }
        handleChange("images", currentImages);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-[#452215] gowun-dodum-regular bg-black/50 backdrop-blur-sm">
      <div className="bg-[#FFE9D5] rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-[#452215] nunito-exbold">Edit Product</h2>

        <div className="space-y-4">
          {/* Image Preview & Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-[#5b3d25]/20 bg-white">
              <img
                src={(data.images && data.images[0]) || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3eadc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%235b3d25' text-anchor='middle' dy='.3em'%3EPreview%3C/text%3E%3C/svg%3E"}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3eadc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%235b3d25' text-anchor='middle' dy='.3em'%3EPreview%3C/text%3E%3C/svg%3E"}
              />
            </div>
            <label className="cursor-pointer px-3 py-1.5 text-xs bg-[#5b3d25] text-[#E3D5C3] rounded hover:bg-[#4a3120] transition-colors">
              Change Image
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Name</label>
            <input
              className="w-full border p-2 rounded border-[#452215] bg-white/50 focus:bg-white transition-colors outline-none focus:border-[#F0A322]"
              value={data.name || ''}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold block mb-1">Price (₹)</label>
              <input
                type="number"
                className="w-full border p-2 rounded border-[#452215] bg-white/50 focus:bg-white transition-colors outline-none focus:border-[#F0A322]"
                value={data.basePrice || data.price || 0}
                onChange={(e) => handleChange("basePrice", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold block mb-1">Stock</label>
              <input
                type="number"
                className="w-full border p-2 rounded border-[#452215] bg-white/50 focus:bg-white transition-colors outline-none focus:border-[#F0A322]"
                value={data.stock || 0}
                onChange={(e) => handleChange("stock", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Description</label>
            <textarea
              className="w-full border p-2 rounded border-[#452215] bg-white/50 focus:bg-white transition-colors outline-none focus:border-[#F0A322]"
              value={data.description || ''}
              rows="3"
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#5b3d25]/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border nunito-bold flex items-center border-[#452215] shadow-[4px_4px_0_#8F5E41] text-[#452215] hover:shadow-[2px_2px_0_#8F5E41] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all cursor-pointer bg-[#FFE9D5]"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(data)}
            className="px-4 py-2 rounded-lg bg-[#F0A322] border nunito-bold flex items-center border-[#452215] shadow-[4px_4px_0_#8F5E41] text-[#452215] hover:shadow-[2px_2px_0_#8F5E41] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
