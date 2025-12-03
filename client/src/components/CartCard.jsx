import { useState } from "react";
import PropTypes from 'prop-types';

function CartCard({ product, onRemove, onUpdateQuantity, index }) {
    const [count, setCount] = useState(product.quantity || 1);
    
    // Handle quantity increment
    const handleIncrement = () => {
        const newCount = count + 1;
        setCount(newCount);
        onUpdateQuantity(product.id, newCount);
    };
    
    // Handle quantity decrement
    const handleDecrement = () => {
        if (count > 1) {
            const newCount = count - 1;
            setCount(newCount);
            onUpdateQuantity(product.id, newCount);
        }
    };
    
    // Calculate total price for this item
    const calculateTotal = () => {
        return (product.price * count).toFixed(2);
    };
    
    // Format price with currency
    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`;
    };

    return (
        <div className="bg-[#FFE9D5] rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Product Image */}
                <div className="md:w-1/4 shrink-0">
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        {/* Product Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {product.title}
                            </h2>
                            
                            <div className="flex items-center gap-4 mb-3">
                                {product.color && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Color:</span>
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
                            
                            <div className="flex items-center gap-4">
                                <div className="text-lg font-bold text-gray-900">
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
                        <div className="flex flex-col items-end gap-4">
                            {/* Remove Button */}
                            <button
                                onClick={() => onRemove(product.id)}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                aria-label={`Remove ${product.title} from cart`}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    height="24px" 
                                    viewBox="0 -960 960 960" 
                                    width="24px" 
                                    fill="#EA3323"
                                >
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                </svg>
                            </button>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={handleDecrement}
                                    disabled={count <= 1}
                                    className={`px-3 py-1 text-lg ${count <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
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
                                    className="w-12 text-center py-1 border-x border-gray-300 focus:outline-none"
                                    aria-label="Item quantity"
                                />
                                
                                <button
                                    onClick={handleIncrement}
                                    disabled={count >= (product.maxQuantity || 99)}
                                    className={`px-3 py-1 text-lg ${count >= (product.maxQuantity || 99) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Item Total:</div>
                                <div className="text-xl font-bold text-gray-900">
                                    ${calculateTotal()}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product Description (Optional) */}
                    {product.description && (
                        <div className="mt-4 text-gray-600 text-sm">
                            {product.description}
                        </div>
                    )}
                    
                    {/* Save for Later (Optional Feature) */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => {/* Implement save for later functionality */}}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Save for later
                        </button>
                    </div>
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