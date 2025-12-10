import React from 'react';

const ProductReviews = () => {
    return (
        <div className="mt-12 border-t border-[#8F5E41]/20 pt-10">
            <h2 className="text-3xl font-bold text-[#452215] mb-6">Customer Reviews</h2>
            <div className="bg-[#fff8f0] p-8 rounded-xl border border-[#e6d0bc] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#e6d0bc] rounded-full flex items-center justify-center mb-4 text-[#8F5E41]">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor">
                        <path d="M480-80q-83 0-156-31.5T196-196q-54-54-85-127T80-480q0-83 31.5-156T196-764q54-54 127-85t157-31q83 0 156 31t127 85q54 54 85 127t31 157q0 83-31 156t-85 127q-54 54-127 85T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93T160-480q0 134 93 227t227 93Z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#5b3d25] mb-2">No Reviews Yet</h3>
                <p className="text-[#8F5E41] max-w-md">Be the first to review this product and help other customers make their decision.</p>
                <button className="mt-6 px-6 py-2 bg-[#442314] text-[#E3D5C3] rounded-lg hover:bg-[#5b3d25] transition-colors font-medium">
                    Write a Review
                </button>
            </div>
        </div>
    );
};

export default ProductReviews;
