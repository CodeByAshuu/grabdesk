import React from "react";

const ProductPreviewDrawer = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <> 
      {/* UNIFIED BACKDROP WRAPPER (handles outside click) */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn flex items-center justify-center px-4"
        onClick={onClose}  // CLICK OUTSIDE WILL CLOSE
      >

        {/* MODAL BOX */}
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#5b3d25]/20 overflow-hidden animate-scaleIn relative"
          onClick={(e) => e.stopPropagation()}  // PREVENT CLICK INSIDE FROM CLOSING
        >

          {/* FLOATING CLOSE BUTTON */}
          <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-md border border-[#5b3d25]/20 text-[#5b3d25] text-lg hover:bg-[#5b3d25]/10 transition"
            onClick={onClose}
          >
            ✕
          </button>

          {/* HEADER */}
          <div className="p-5 bg-linear-to-r from-[#5b3d25] to-[#3a2718] text-white shadow-md rounded-t-2xl">
            <h2 className="text-lg font-semibold tracking-wide">
              Product Details
            </h2>
          </div>

          {/* CONTENT */}
          {product && (
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* IMAGE */}
              <div className="overflow-hidden rounded-xl border border-[#5b3d25]/20 shadow-md">
                <img
                  src={product.image || "https://via.placeholder.com/200"}
                  className="w-full h-48 sm:h-56 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold text-[#5b3d25] leading-tight drop-shadow-sm">
                {product.name}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-[#5b3d25]/70 text-sm leading-relaxed">
                {product.description || "No description available."}
              </p>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Category", product.category],
                  ["Price", `₹ ${product.price}`],
                  ["Stock", product.stock],
                  [
                    "Status",
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>,
                  ],
                ].map(([label, value], index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#5b3d25]/5 rounded-xl border border-[#5b3d25]/10 shadow-sm"
                  >
                    <p className="text-[12px] text-[#5b3d25]/60">{label}</p>
                    <p className="font-semibold mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </>
  );
};

export default ProductPreviewDrawer;
