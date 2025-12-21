import { useState } from "react";
import PropTypes from 'prop-types';
import { FaHeart, FaTrash } from "react-icons/fa";

function CartCard({ product, onRemove, onUpdateQuantity }) {
    const [count, setCount] = useState(product.quantity || 1);
    const [liked, setLiked] = useState(false);

    const handleIncrement = () => {
        const newCount = count + 1;
        setCount(newCount);
        onUpdateQuantity(product.id, newCount);
    };

    const handleDecrement = () => {
        if (count > 1) {
            const newCount = count - 1;
            setCount(newCount);
            onUpdateQuantity(product.id, newCount);
        }
    };

    const calculateTotal = () => {
        return (product.price * count).toFixed(2);
    };

    const formatPrice = (price) => {
        return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="bg-[#FFE9D5] rounded-xl p-4 mb-4 relative border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 mx-auto w-full">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 sm:h-32 shrink-0 bg-white rounded-lg overflow-hidden border border-[#e6d0bc]">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#452215] nunito-exbold leading-tight mb-1">
                                {product.title}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b4c35] mb-2">
                                {product.size && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">Size:</span> {product.size}
                                    </div>
                                )}
                                {product.color && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">Color:</span> {product.color}
                                    </div>
                                )}
                            </div>
                            {product.inStock !== undefined && (
                                <div className={`text-xs font-medium ${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </div>
                            )}
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-bold text-[#452215]">
                                {formatPrice(product.price)}
                            </div>
                            {product.originalPrice > product.price && (
                                <div className="text-xs text-[#8F5E41] line-through">
                                    {formatPrice(product.originalPrice)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#452215]/10">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-white rounded-lg border border-[#e6d0bc] h-9">
                            <button
                                onClick={handleDecrement}
                                disabled={count <= 1}
                                className="px-3 h-full text-[#452215] hover:bg-[#FFE9D5] disabled:opacity-50 disabled:hover:bg-transparent rounded-l-lg transition-colors"
                            >
                                −
                            </button>
                            <div className="w-10 text-center font-medium text-[#452215] text-sm">
                                {count}
                            </div>
                            <button
                                onClick={handleIncrement}
                                disabled={count >= (product.maxQuantity || 10)}
                                className="px-3 h-full text-[#452215] hover:bg-[#FFE9D5] disabled:opacity-50 disabled:hover:bg-transparent rounded-r-lg transition-colors"
                            >
                                +
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setLiked(!liked)}
                                className={`p-2 rounded-full text-xl transition-all ${liked ? 'text-red-500 bg-red-50' : 'text-[#8F5E41] hover:bg-[#FFE9D5]'}`}
                                title="Add to Wishlist"
                            >
                                <FaHeart className={liked ? "fill-current" : ""} />
                            </button>
                            <button
                                onClick={() => onRemove(product.id)}
                                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                            >
                                <FaTrash className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

CartCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string,
        color: PropTypes.string,
        size: PropTypes.string,
        quantity: PropTypes.number,
        originalPrice: PropTypes.number,
        inStock: PropTypes.bool,
        maxQuantity: PropTypes.number,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
};

export default CartCard;