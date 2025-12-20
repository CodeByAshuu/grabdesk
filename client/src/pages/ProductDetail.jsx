import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductReviews from '../components/ProductReviews';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [showDescription, setShowDescription] = useState(true);
    const [showToast, setShowToast] = useState(false);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                // Set initial selections if available
                if (res.data.sizeAvailable && res.data.sizeAvailable.length > 0) {
                    setSelectedSize(res.data.sizeAvailable[0]);
                }
                if (res.data.color) {
                    setSelectedColor(res.data.color);
                }
            } catch (err) {
                console.error("Failed to fetch product", err);
                setError("Product not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const relatedProducts = [
        // Placeholder for related products - could fetch from API later
        // { id: 1, name: "Nike Air Max", price: "₹ 12,499.00", images: [Nike2], rating: 4.5, tag: "NEW" },
    ];

    const handleQuantityChange = (type) => {
        if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'inc' && quantity < 10) setQuantity(quantity + 1);
    };

    const handleZoom = (e) => {
        const image = e.currentTarget;
        const x = e.nativeEvent.offsetX / image.offsetWidth * 100;
        const y = e.nativeEvent.offsetY / image.offsetHeight * 100;
        image.style.transformOrigin = `${x}% ${y}%`;
    };

    const addToCartLogic = () => {
        if (!product) return;

        const cartItem = {
            id: product._id,
            title: product.name,
            price: product.finalPrice,
            originalPrice: product.basePrice,
            image: product.images && product.images.length > 0 ? product.images[0] : "",
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            inStock: product.stock > 0,
            maxQuantity: product.stock || 10
        };

        // Get existing cart
        const savedCart = localStorage.getItem('cart');
        let cart = [];
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
            } catch (e) {
                console.error("Error parsing cart", e);
            }
        }

        // Check if item already exists (same ID, size, color)
        const existingItemIndex = cart.findIndex(item =>
            item.id === cartItem.id &&
            item.size === cartItem.size &&
            item.color === cartItem.color
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const handleAddToCart = () => {
        addToCartLogic();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = () => {
        addToCartLogic();
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f9f5f0]">
                <div className="text-[#452215] text-xl font-bold">Loading...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f9f5f0]">
                <div className="text-red-500 text-xl font-bold">{error || "Product not found"}</div>
            </div>
        );
    }

    return (
        <section className="min-h-screen w-full bg-[#f9f5f0] text-[#5b3d25] pb-20 relative">
            <Navbar />

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 right-5 z-50 bg-[#452215] text-[#E3D5C3] px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-bounce-in transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                        <h4 className="font-bold">Added to Cart!</h4>
                        <p className="text-sm opacity-90">{product.name} ({quantity})</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {/* Product Main Section */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-3/5 flex flex-col-reverse lg:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 lg:h-[600px] scrollbar-hide">
                            {product.images && product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-[#8F5E41]' : 'border-transparent'
                                        }`}
                                >
                                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 relative h-[400px] lg:h-[589px] bg-white rounded-2xl overflow-hidden group cursor-zoom-in border border-[#e6d0bc]">
                            <div
                                className="w-full h-full overflow-hidden"
                                onMouseMove={handleZoom}
                            >
                                <img
                                    src={product.images && product.images[selectedImage]}
                                    alt="Product Main"
                                    className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-150"
                                />
                            </div>
                            {product.discountPercent > 0 && (
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#8F5E41]">
                                    -{product.discountPercent}%
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="w-full lg:w-2/5 flex flex-col gap-6">
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl nunnito-bold font-bold text-[#452215] mb-2">{product.name}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${i < Math.floor(product.ratingAverage || 0) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-[#8F5E41] underline cursor-pointer hover:text-[#452215]">{product.ratingCount || 0} reviews</span>
                            </div>
                            <p className="text-[#6b4c35] leading-relaxed line-clamp-3">{product.description}</p>
                        </div>

                        {/* Price */}
                        <div className="border-y border-[#e6d0bc] py-4">
                            <div className="flex items-end gap-3 mb-1">
                                <span className="text-3xl font-bold text-[#452215]">₹ {product.finalPrice.toLocaleString()}</span>
                                {product.basePrice > product.finalPrice && (
                                    <span className="text-lg text-[#8F5E41]/60 line-through mb-1">₹ {product.basePrice.toLocaleString()}</span>
                                )}
                            </div>
                            <p className="text-xs text-[#6b4c35]">Inclusive of all taxes</p>
                        </div>

                        {/* Variants */}
                        <div className="space-y-4">
                            {product.color && (
                                <div>
                                    <h3 className="tex-sm font-semibold mb-2 text-[#452215]">Color</h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedColor(product.color)}
                                            className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${selectedColor === product.color
                                                ? 'bg-[#452215] text-[#E3D5C3] border-[#452215]'
                                                : 'bg-white text-[#5b3d25] border-[#e6d0bc] hover:border-[#8F5E41]'
                                                }`}
                                        >
                                            {product.color}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {product.sizeAvailable && product.sizeAvailable.length > 0 && (
                                <div>
                                    <h3 className="tex-sm font-semibold mb-2 text-[#452215]">Size</h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {product.sizeAvailable.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[3rem] h-10 px-2 rounded-md border text-sm font-medium transition-all ${selectedSize === size
                                                    ? 'bg-[#452215] text-[#E3D5C3] border-[#452215]'
                                                    : 'bg-white text-[#5b3d25] border-[#e6d0bc] hover:border-[#8F5E41]'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 items-center mt-2">
                            <div className="flex items-center border border-[#8F5E41] rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange('dec')}
                                    className="px-3 py-2 text-[#452215] hover:bg-[#e6d0bc]/20"
                                >-</button>
                                <span className="px-3 font-medium text-[#452215]">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange('inc')}
                                    className="px-3 py-2 text-[#452215] hover:bg-[#e6d0bc]/20"
                                >+</button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock}
                                className={`flex-1 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95 ${product.stock > 0 ? 'bg-[#452215] text-[#E3D5C3] hover:bg-[#5b3d25]' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button className="p-3 border border-[#8F5E41] rounded-lg text-[#8F5E41] hover:bg-[#8F5E41] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                        <button
                            onClick={handleBuyNow}
                            disabled={!product.stock}
                            className={`w-full py-3 font-bold rounded-lg transition-all ${product.stock > 0 ? 'bg-[#E3D5C3] text-[#452215] hover:bg-[#d4c3b0]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Details Section */}
                <div className="mt-16 flex flex-col lg:flex-row gap-12">
                    {/* Description Text */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between cursor-pointer border-b border-[#e6d0bc] pb-2 mb-4" onClick={() => setShowDescription(!showDescription)}>
                            <h2 className="text-2xl font-bold text-[#452215]">Product Description</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transform transition-transform ${showDescription ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {showDescription && (
                            <div className="prose text-[#6b4c35] max-w-none animate-fadeIn">
                                <p className="mb-4 whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tech Specs Table */}
                    <div className="flex-1 lg:max-w-md">
                        <h2 className="text-2xl font-bold text-[#452215] border-b border-[#e6d0bc] pb-2 mb-4">Specifications</h2>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div className="font-semibold text-[#452215]">Brand</div>
                            <div className="text-[#6b4c35]">{product.brand || 'N/A'}</div>
                            <div className="font-semibold text-[#452215]">Model</div>
                            <div className="text-[#6b4c35]">{product.model || 'N/A'}</div>
                            <div className="font-semibold text-[#452215]">Material</div>
                            <div className="text-[#6b4c35]">{product.material || 'N/A'}</div>
                            <div className="font-semibold text-[#452215]">Color</div>
                            <div className="text-[#6b4c35]">{product.color || 'N/A'}</div>
                            <div className="font-semibold text-[#452215]">Category</div>
                            <div className="text-[#6b4c35]">{product.category || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <ProductReviews productId={product._id} />

                {/* Related Products */}
                <div className="mt-16 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#452215] mb-6 sm:mb-8">
                        You May Also Like
                    </h2>

                    <div
                        className="
                        flex lg:grid
                        grid-cols-4
                        gap-4 sm:gap-6 lg:gap-8
                        px-4 sm:px-6 py-4
                        overflow-x-auto lg:overflow-visible
                        snap-x lg:snap-none
                        scrollbar-hide
                        "
                    >
                        {relatedProducts.map((prod) => (
                            <div
                                key={prod.id}
                                className="
                            min-w-[220px] sm:min-w-[260px] lg:min-w-0
                            snap-center
                            "
                            >
                                <ProductCard
                                    namee={prod.name}
                                    pricee={prod.price}
                                    images={prod.images}
                                    rating={prod.rating}
                                    tagg={prod.tag}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
