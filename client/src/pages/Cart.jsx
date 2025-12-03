import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CartCard from "../components/CartCard";

function Cart() {
    // Sample real data - in production, you'd fetch this from an API
    const initialCartProducts = [
        {
            id: 1,
            title: "Artisan Coffee Beans",
            price: 24.99,
            originalPrice: 29.99,
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
            color: "Dark Roast",
            size: "1lb",
            quantity: 2,
            description: "Premium Arabica beans, sourced from Colombia",
            inStock: true,
            maxQuantity: 10
        },
        {
            id: 2,
            title: "Ceramic Pour Over",
            price: 34.99,
            image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e7",
            color: "Terracotta",
            size: "Standard",
            quantity: 1,
            inStock: true,
            maxQuantity: 5
        },
        {
            id: 3,
            title: "Coffee Grinder",
            price: 89.99,
            originalPrice: 109.99,
            image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
            color: "Brushed Steel",
            size: "Professional",
            quantity: 1,
            description: "Adjustable burr grinder with 15 settings",
            inStock: true,
            maxQuantity: 3
        }
    ];

    const [cartProducts, setCartProducts] = useState(initialCartProducts);
    const [loading, setLoading] = useState(false);

    // Remove item from cart
    const RemoveCart = (itemId) => {
        setCartProducts(prev => prev.filter(item => item.id !== itemId));
    };

    // Update quantity
    const UpdateQuantity = (itemId, newQuantity) => {
        setCartProducts(prev => 
            prev.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
        return cartProducts.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    // Calculate shipping (free over $50, otherwise $5.99)
    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal > 50 ? 0 : 5.99;
    };

    // Calculate tax (8.5% example)
    const calculateTax = () => {
        return calculateSubtotal() * 0.085;
    };

    // Calculate total
    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping() + calculateTax();
    };

    // Clear entire cart
    const clearCart = () => {
        setCartProducts([]);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    // Load cart data (in production, fetch from API)
    useEffect(() => {
        // Example: Fetch cart data from localStorage or API
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartProducts(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);

    // Save cart data (in production, sync with API)
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }, [cartProducts]);

    return (
        <>
            <section 
                className="min-h-screen w-full overflow-hidden text-[#5b3d25]"
                style={{
                    backgroundColor: "#442314",
                    backgroundImage: "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
                    backgroundSize: "14px 14px",
                }}
            >
                <Navbar />
                
                <div className="my-8 sm:my-10 md:my-12 lg:my-14 mx-4 sm:mx-6 lg:mx-8">
                    <h1 className="boldonse-bold text-[#E3D5C3] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                        CART
                    </h1>
                </div>

                <div className="px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Products */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-[#E3D5C3]">
                                    Your Items ({cartProducts.length})
                                </h2>
                                {cartProducts.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-[#E3D5C3] hover:text-[#FFE9D5] text-sm transition-colors"
                                    >
                                        Clear All Items
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E3D5C3]"></div>
                                </div>
                            ) : cartProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {cartProducts.map((product) => (
                                        <CartCard
                                            key={product.id}
                                            product={product}
                                            onRemove={RemoveCart}
                                            onUpdateQuantity={UpdateQuantity}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#E3D5C3] bg-opacity-10 rounded-lg p-8 text-center">
                                    <div className="text-6xl mb-4">🛒</div>
                                    <h3 className="text-xl font-semibold text-[#E3D5C3] mb-2">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-[#FFE9D5] mb-6">
                                        Add some delicious coffee products to get started!
                                    </p>
                                    <Link
                                        to="/products"
                                        className="inline-block bg-[#5b3d25] hover:bg-[#442314] text-[#E3D5C3] font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        {cartProducts.length > 0 && (
                            <div className="lg:col-span-1">
                                <div className="bg-[#E3D5C3] bg-opacity-10 backdrop-blur-sm rounded-lg p-6 sticky top-6">
                                    <h2 className="font-bold text-2xl text-[#E3D5C3] mb-6">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-[#FFE9D5]">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(calculateSubtotal())}</span>
                                        </div>
                                        
                                        <div className="flex justify-between text-[#FFE9D5]">
                                            <span>Shipping</span>
                                            <span>
                                                {calculateShipping() === 0 
                                                    ? "FREE" 
                                                    : formatCurrency(calculateShipping())}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between text-[#FFE9D5]">
                                            <span>Tax</span>
                                            <span>{formatCurrency(calculateTax())}</span>
                                        </div>
                                        
                                        <div className="border-t border-[#5b3d25] pt-4">
                                            <div className="flex justify-between text-[#E3D5C3] font-bold text-xl">
                                                <span>Total</span>
                                                <span>{formatCurrency(calculateTotal())}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {calculateSubtotal() < 50 && (
                                        <div className="mb-6 p-3 bg-[#5b3d25] bg-opacity-20 rounded text-center">
                                            <p className="text-sm text-[#FFE9D5]">
                                                <span className="font-semibold">
                                                    Spend {formatCurrency(50 - calculateSubtotal())} more
                                                </span> to get free shipping!
                                            </p>
                                        </div>
                                    )}

                                    <button className="w-full bg-[#5b3d25] hover:bg-[#442314] text-[#E3D5C3] font-bold py-3 rounded-lg transition-colors mb-4">
                                        Proceed to Checkout
                                    </button>

                                    <Link
                                        to="/products"
                                        className="block text-center text-[#FFE9D5] hover:text-[#E3D5C3] text-sm transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>

                                    <div className="mt-6 pt-6 border-t border-[#5b3d25] border-opacity-30">
                                        <h3 className="text-[#E3D5C3] font-semibold mb-3">
                                            Secure Checkout
                                        </h3>
                                        <div className="flex space-x-2">
                                            {["visa", "mastercard", "paypal", "applepay"].map((method) => (
                                                <div 
                                                    key={method}
                                                    className="w-10 h-6 bg-[#FFE9D5] bg-opacity-20 rounded flex items-center justify-center"
                                                >
                                                    <span className="text-xs text-[#FFE9D5]">
                                                        {method.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-[#FFE9D5] mt-3">
                                            Your payment information is encrypted and secure
                                        </p>
                                    </div>
                                </div>

                                {/* Promo Code Section */}
                                <div className="mt-6 bg-[#E3D5C3] bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                                    <h3 className="font-semibold text-[#E3D5C3] mb-3">
                                        Have a promo code?
                                    </h3>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            className="flex-1 bg-transparent border border-[#5b3d25] text-[#E3D5C3] px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#FFE9D5]"
                                        />
                                        <button className="bg-[#5b3d25] hover:bg-[#442314] text-[#E3D5C3] px-4 py-2 rounded-r-lg transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recommended Products (Optional) */}
                    {cartProducts.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-semibold text-[#E3D5C3] mb-6">
                                You might also like
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div 
                                        key={item}
                                        className="bg-[#E3D5C3] bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer"
                                    >
                                        <div className="h-32 bg-[#5b3d25] bg-opacity-20 rounded mb-3"></div>
                                        <p className="text-[#FFE9D5] text-sm">Coffee Mug</p>
                                        <p className="text-[#E3D5C3] font-semibold">$19.99</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default Cart;