import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductReviews from '../components/ProductReviews';
import ProductCard from '../components/ProductCard';
import Nike1 from '../assets/Nike1.png';
import Nike2 from '../assets/Nike2.png';
import Nike3 from '../assets/Nike3.png';

const ProductDetail = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('brown');
    const [pincode, setPincode] = useState('');
    const [showDescription, setShowDescription] = useState(true);
    const [showToast, setShowToast] = useState(false);

    const product = {
        id: 101,
        title: "Nike Dunk Low Retro SE",
        shortDesc: "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors.",
        price: 10257,
        originalPrice: 12999,
        discount: 21,
        rating: 4.5,
        reviews: 128,
        images: [Nike1, Nike2, Nike3, Nike1],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'brown', hex: '#8F5E41' },
            { name: 'cream', hex: '#E3D5C3' },
            { name: 'black', hex: '#222222' }
        ]
    };

    const relatedProducts = [
        { id: 1, name: "Nike Air Max", price: "₹ 12,499.00", images: [Nike2], rating: 4.5, tag: "NEW" },
        { id: 2, name: "Nike Jordan 1", price: "₹ 15,999.00", images: [Nike3], rating: 4.8, tag: "SALE" },
        { id: 3, name: "Nike Blazer", price: "₹ 8,499.00", images: [Nike1], rating: 4.3, tag: "HOT" },
        { id: 4, name: "Nike Zoom", price: "₹ 11,299.00", images: [Nike2], rating: 4.6, tag: "NEW" },
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
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            inStock: true,
            maxQuantity: 10
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
                        <p className="text-sm opacity-90">{product.title} ({quantity})</p>
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
                            {product.images.map((img, idx) => (
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
                                    src={product.images[selectedImage]}
                                    alt="Product Main"
                                    className="w-full h-full object-contain transition-transform duration-200 ease-out group-hover:scale-150"
                                />
                            </div>
                            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#8F5E41]">
                                -{product.discount}%
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="w-full lg:w-2/5 flex flex-col gap-6">
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl nunnito-bold font-bold text-[#452215] mb-2">{product.title}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-[#8F5E41] underline cursor-pointer hover:text-[#452215]">{product.reviews} reviews</span>
                            </div>
                            <p className="text-[#6b4c35] leading-relaxed">{product.shortDesc}</p>
                        </div>

                        {/* Price */}
                        <div className="border-y border-[#e6d0bc] py-4">
                            <div className="flex items-end gap-3 mb-1">
                                <span className="text-3xl font-bold text-[#452215]">₹ {product.price.toLocaleString()}</span>
                                <span className="text-lg text-[#8F5E41]/60 line-through mb-1">₹ {product.originalPrice.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-[#6b4c35]">Inclusive of all taxes</p>
                        </div>

                        {/* Variants */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="tex-sm font-semibold mb-2 text-[#452215]">Color</h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-8 h-8 rounded-full border-2 ring-2 ring-offset-2 transition-all ${selectedColor === color.name ? 'ring-[#8F5E41] border-white' : 'ring-transparent border-transparent'
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            aria-label={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="tex-sm font-semibold mb-2 text-[#452215]">Size</h3>
                                <div className="flex gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-10 rounded-md border text-sm font-medium transition-all ${selectedSize === size
                                                ? 'bg-[#452215] text-[#E3D5C3] border-[#452215]'
                                                : 'bg-white text-[#5b3d25] border-[#e6d0bc] hover:border-[#8F5E41]'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                                className="flex-1 bg-[#452215] text-[#E3D5C3] py-3 rounded-lg font-bold hover:bg-[#5b3d25] transition-all shadow-lg active:scale-95"
                            >
                                Add to Cart
                            </button>
                            <button className="p-3 border border-[#8F5E41] rounded-lg text-[#8F5E41] hover:bg-[#8F5E41] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                        <button
                            onClick={handleBuyNow}
                            className="w-full py-3 bg-[#E3D5C3] text-[#452215] font-bold rounded-lg hover:bg-[#d4c3b0] transition-all"
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
                                <p className="mb-4">
                                    The Nike Dunk Low Retro SE channels vintage hoops style back onto the streets.
                                    Padded, low-cut collar lets you take your game anywhere—in comfort.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mb-6">
                                    <li>Crisp leather upper has a slight sheen, ages to soft perfection.</li>
                                    <li>Durable foam midsole offers lightweight, responsive cushioning.</li>
                                    <li>Rubber outsole with classic pivot circle adds durability, tractions and heritage style.</li>
                                    <li>Displayed color: Sail/Dark Marina Blue/University Gold</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Tech Specs Table */}
                    <div className="flex-1 lg:max-w-md">
                        <h2 className="text-2xl font-bold text-[#452215] border-b border-[#e6d0bc] pb-2 mb-4">Specifications</h2>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div className="font-semibold text-[#452215]">Brand</div>
                            <div className="text-[#6b4c35]">Nike</div>
                            <div className="font-semibold text-[#452215]">Model</div>
                            <div className="text-[#6b4c35]">Dunk Low SE</div>
                            <div className="font-semibold text-[#452215]">Material</div>
                            <div className="text-[#6b4c35]">Leather & Synthetic</div>
                            <div className="font-semibold text-[#452215]">Weight</div>
                            <div className="text-[#6b4c35]">850g</div>
                            <div className="font-semibold text-[#452215]">Origin</div>
                            <div className="text-[#6b4c35]">Vietnam</div>
                            <div className="font-semibold text-[#452215]">Warranty</div>
                            <div className="text-[#6b4c35]">3 Months Manufacturing</div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <ProductReviews />

                {/* Related Products */}
                <div className="mt-16 mb-8">
                    <h2 className="text-3xl font-bold text-[#452215] mb-8">You May Also Like</h2>
                    <div className="flex gap-8 px-6 py-6 scrollbar-hide snap-x">
                        {relatedProducts.map(prod => (
                            <div key={prod.id} className="min-w-[280px] snap-center">
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
