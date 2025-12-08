import { useState } from "react";
import PropTypes from 'prop-types';
import { FaHeart } from "react-icons/fa";

function CartCard({ product, onRemove, onUpdateQuantity, index }) {
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
        return `₹${price.toFixed(2)}`;
    };

    return (
        <div className="bg-[#FFE9D5] rounded-lg p-3 sm:p-4 mb-4 relative border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 mx-auto">
            {/* Mobile Layout - Stacked */}
            <div className="md:hidden">
                <div className="flex justify-between items-start mb-3">
                    {/* Product Title and Info */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1 nunito-exbold">
                            {product.title}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            {product.color && (
                                <div className="flex items-center gap-1">
                                    <div
                                        className="w-3 h-3 rounded-full border border-gray-300"
                                        style={{ backgroundColor: product.colorCode || product.color }}
                                    />
                                    <span className="text-xs">{product.color}</span>
                                </div>
                            )}
                            
                            {product.size && (
                                <div className="text-xs text-gray-600">
                                    Size: <span className="font-medium">{product.size}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Price Row */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-base font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <div className="text-xs text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                </div>
                            )}
                        </div>
                        
                        {product.inStock !== undefined && (
                            <div className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                        )}
                    </div>
                    
                    {/* Heart and Remove Buttons */}
                    <div className="flex items-center gap-2 ml-2">
                        <FaHeart
                            onClick={() => setLiked(!liked)}
                            className={`text-lg cursor-pointer transition-all duration-300 ${liked ? "text-red-500 scale-110" : "text-gray-100 hover:text-red-200"}`}
                        />
                        
                        <button
                            onClick={() => onRemove(product.id)}
                            className="p-1 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                            aria-label={`Remove ${product.title} from cart`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#EA3323"
                                className="w-4 h-4"
                            >
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Product Image for Mobile */}
                <div className="mb-3">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                    )}
                </div>
                
                {/* Quantity Controls and Item Total - Side by side on mobile */}
                <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={handleDecrement}
                            disabled={count <= 1}
                            className={`px-2 py-1 text-sm ${count <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        
                        <input
                            type="number"
                            value={count}
                            min="1"
                            max={product.maxQuantity || 99}
                            onChange={(e) => {
                                const value = Math.max(1, Math.min(product.maxQuantity || 99, parseInt(e.target.value) || 1));
                                setCount(value);
                                onUpdateQuantity(product.id, value);
                            }}
                            className="w-8 text-center py-1 border-x border-gray-300 focus:outline-none text-sm"
                            aria-label="Item quantity"
                        />
                        
                        <button
                            onClick={handleIncrement}
                            disabled={count >= (product.maxQuantity || 99)}
                            className={`px-2 py-1 text-sm ${count >= (product.maxQuantity || 99) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                        <div className="text-xs text-gray-600">Item Total:</div>
                        <div className="text-base font-bold text-gray-900">
                            ₹{calculateTotal()}
                        </div>
                    </div>
                </div>
                
                {/* Product Description (Optional) */}
                {product.description && (
                    <div className="mt-3 text-gray-600 text-xs gowun-dodum-regular pt-3 border-t border-gray-200">
                        {product.description}
                    </div>
                )}
            </div>
            
            {/* Desktop Layout - Keep exactly as before */}
            <div className="hidden md:flex flex-col md:flex-row gap-4">
                {/* Product Image */}
                <div className="md:w-1/4 shrink-0">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-auto max-h-64 md:h-52 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start gowun-dodum-regular gap-4">
                        {/* Product Info */}
                        <div className="flex-1">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 nunito-exbold">
                                {product.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                {product.color && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: product.colorCode || product.color }}
                                            />
                                            <span className="text-sm">{product.color}</span>
                                        </div>
                                    </div>
                                )}

                                {product.size && (
                                    <div className="text-gray-600">
                                        Size: <span className="font-medium">{product.size}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="text-base md:text-lg font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                </div>

                                {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="text-sm text-gray-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                    </div>
                                )}
                            </div>

                            {product.inStock !== undefined && (
                                <div className={`text-sm mt-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                            {/* Heart and Remove Buttons - Fixed alignment */}
                            <div className="flex items-center justify-end gap-4 md:gap-5 w-full">
                                <FaHeart
                                    onClick={() => setLiked(!liked)}
                                    className={`text-xl md:text-2xl cursor-pointer transition-all duration-300 ${liked ? "text-red-500 scale-110" : "text-gray-100 hover:text-red-200"}`}
                                />
                                
                                <button
                                    onClick={() => onRemove(product.id)}
                                    className="p-2 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                                    aria-label={`Remove ${product.title} from cart`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#EA3323"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    >
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={handleDecrement}
                                    disabled={count <= 1}
                                    className={`px-3 py-1 text-base md:text-lg ${count <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>

                                <input
                                    type="number"
                                    value={count}
                                    min="1"
                                    max={product.maxQuantity || 99}
                                    onChange={(e) => {
                                        const value = Math.max(1, Math.min(product.maxQuantity || 99, parseInt(e.target.value) || 1));
                                        setCount(value);
                                        onUpdateQuantity(product.id, value);
                                    }}
                                    className="w-10 md:w-12 text-center py-1 border-x border-gray-300 focus:outline-none"
                                    aria-label="Item quantity"
                                />

                                <button
                                    onClick={handleIncrement}
                                    disabled={count >= (product.maxQuantity || 99)}
                                    className={`px-3 py-1 text-base md:text-lg ${count >= (product.maxQuantity || 99) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right w-full md:w-auto">
                                <div className="text-sm text-gray-600">Item Total:</div>
                                <div className="text-lg md:text-xl font-bold text-gray-900">
                                    ₹{calculateTotal()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description (Optional) */}
                    {product.description && (
                        <div className="mt-4 text-gray-600 text-sm gowun-dodum-regular">
                            {product.description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Prop types for better development experience
CartCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string,
        color: PropTypes.string,
        colorCode: PropTypes.string,
        size: PropTypes.string,
        quantity: PropTypes.number,
        originalPrice: PropTypes.number,
        description: PropTypes.string,
        inStock: PropTypes.bool,
        maxQuantity: PropTypes.number,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
    index: PropTypes.number,
};

export default CartCard;