import { useState, useEffect } from "react";

function RelatedProducts({ currentProduct, onProductSelect }) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch related products based on current product
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                // Example: `/api/products/related/${currentProduct.category}/${currentProduct.id}`
                const response = await fetch(`/api/products/related?category=${currentProduct.category}&exclude=${currentProduct.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch related products');
                }
                
                const data = await response.json();
                setRelatedProducts(data.slice(0, 4)); // Take first 4 related products
            } catch (err) {
                setError(err.message);
                console.error('Error fetching related products:', err);
                // Fallback to sample data if API fails
                setRelatedProducts(generateSampleProducts());
            } finally {
                setLoading(false);
            }
        };

        if (currentProduct) {
            fetchRelatedProducts();
        }
    }, [currentProduct]);

    // Sample data generator for fallback
    const generateSampleProducts = () => {
        return [
            { id: 1, name: "Coffee Mug Premium", price: 24.99, image: "/images/mug-1.jpg" },
            { id: 2, name: "Espresso Cup Set", price: 34.99, image: "/images/mug-2.jpg" },
            { id: 3, name: "Travel Coffee Mug", price: 29.99, image: "/images/mug-3.jpg" },
            { id: 4, name: "Ceramic Coffee Mug", price: 19.99, image: "/images/mug-4.jpg" },
        ];
    };

    // Handle product click
    const handleProductClick = (product) => {
        if (onProductSelect) {
            onProductSelect(product);
        }
        // You could also navigate to product detail page
        // router.push(`/product/${product.id}`);
    };

    // Format price
    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">You may also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="bg-[#E3D5C3] bg-opacity-10 rounded-lg p-4 animate-pulse"
                        >
                            <div className="h-32 bg-gray-300 rounded mb-3"></div>
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && relatedProducts.length === 0) {
        return (
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">You may also like</h3>
                <div className="text-center p-8 bg-red-50 rounded-lg">
                    <p className="text-red-600">Failed to load related products</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">You may also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="bg-[#E3D5C3] bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer group"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleProductClick(product);
                            }
                        }}
                    >
                        <div className="h-32 bg-gray-100 rounded mb-3 overflow-hidden flex items-center justify-center">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-400 text-sm">No Image</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-700 mb-1 line-clamp-1">{product.name}</p>
                        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                        
                        {/* Optional: Add rating or other details */}
                        {product.rating && (
                            <div className="flex items-center mt-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-sm">
                                            {i < Math.floor(product.rating) ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Prop types for better development experience
RelatedProducts.propTypes = {
    currentProduct: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        category: PropTypes.string.isRequired,
        // Add other product properties you need
    }).isRequired,
    onProductSelect: PropTypes.func,
};

export default RelatedProducts;