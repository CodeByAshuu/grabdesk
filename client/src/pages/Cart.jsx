import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import CartCard from "../components/CartCard";
import UPI from "../assets/upi.png";
import Mastercard from "../assets/Mastercard.png";
import NetBanking from "../assets/net.png";
import Paypal from "../assets/paypal.png";
import Button from "../components/Button";
import Footer from '../components/Footer';
import { ButtonDark } from "../components/ButtonDark";
import ProductCard from '../components/ProductCard';
import Nike1 from '../assets/Nike1.png';
import Nike2 from '../assets/Nike2.png';
import Nike3 from '../assets/Nike3.png';

function Cart() {
    // Sample real data - in production, you'd fetch this from an API
    // Sample real data - in production, you'd fetch this from an API
    // const initialCartProducts = []; // Removed unused mock data

    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart data from API
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get('/users/cart');
                setCartProducts(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Remove item from cart
    const RemoveCart = async (itemId) => {
        try {
            await api.delete(`/users/cart/${itemId}`);
            // Optimistic update
            setCartProducts(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Failed to remove item");
        }
    };

    // Update quantity
    const UpdateQuantity = async (itemId, newQuantity) => {
        try {
            await api.put(`/users/cart/${itemId}`, { quantity: newQuantity });
            // Optimistic update
            setCartProducts(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("Failed to update quantity");
        }
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
    const clearCart = async () => {
        try {
            await api.delete('/users/cart');
            setCartProducts([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
            alert("Failed to clear cart");
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const paymentIcons = {
        UPI: UPI,
        Mastercard: Mastercard,
        NetBanking: NetBanking,
        Paypal: Paypal
    };

    const relatedProducts = [
        { id: 1, name: "Nike Air Max", price: "₹ 12,499.00", images: [Nike2], rating: 4.5, tag: "NEW" },
        { id: 2, name: "Nike Jordan 1", price: "₹ 15,999.00", images: [Nike3], rating: 4.8, tag: "SALE" },
        { id: 3, name: "Nike Blazer", price: "₹ 8,499.00", images: [Nike1], rating: 4.3, tag: "HOT" },
        { id: 4, name: "Nike Zoom", price: "₹ 11,299.00", images: [Nike2], rating: 4.6, tag: "NEW" },
    ];

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
                                <h2 className="text-2xl font-semibold text-[#E3D5C3] gowun-dodum-regular">
                                    Your Items ({cartProducts.length})
                                </h2>
                                {cartProducts.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-[#E3D5C3] hover:text-[#FFE9D5] text-sm transition-colors gowun-dodum-regular"
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
                                // Add wrapper div to show only 3 products at a time with scroll
                                <div
                                    className="space-y-4 overflow-y-auto p-2"
                                    style={{
                                        maxHeight: 'calc(3 * 256px)', // Adjust based on your card height
                                        scrollbarWidth: 'none', // Firefox
                                        msOverflowStyle: 'none', // IE/Edge
                                    }}
                                >
                                    {/* Hide scrollbar for Chrome/Safari */}
                                    <style>
                                        {`
                                            .overflow-y-auto::-webkit-scrollbar {
                                                display: none;
                                            }
                                        `}
                                    </style>
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
                                <div className="bg-[#E3D5C3] bg-opacity-10 rounded-lg p-8 text-center gowun-dodum-regular">
                                    <div className="text-6xl mb-4"></div>
                                    <h3 className="text-xl font-semibold text-[#E3D5C3] mb-2">
                                        Your cart is empty
                                    </h3>
                                    <p className="txt-lg mb-6">
                                        Add some products to get started!
                                    </p>
                                    <Link
                                        to="/product"
                                        className="" >
                                        <Button labell={"Browse Products"} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        {cartProducts.length > 0 && (
                            <div className="lg:col-span-1">
                                <div className="bg-[#E3D5C3] bg-opacity-10 backdrop-blur-sm rounded-lg p-6 sticky top-6 gowun-dodum-regular border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41]">
                                    <h2 className="font-bold text-4xl text-[#452215] mb-6 text-center nunito-exbold">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-[#452215]">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(calculateSubtotal())}</span>
                                        </div>

                                        <div className="flex justify-between text-[#452215]">
                                            <span>Shipping</span>
                                            <span>
                                                {calculateShipping() === 0
                                                    ? "FREE"
                                                    : formatCurrency(calculateShipping())}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-[#452215]">
                                            <span>Tax</span>
                                            <span>{formatCurrency(calculateTax())}</span>
                                        </div>

                                        <div className="border-t border-[#5b3d25] pt-4">
                                            <div className="flex justify-between text-[#452215] font-bold text-xl">
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

                                    <Link to="/Checkout" className="">
                                        <Button labell={"Proceed to Checkout"} />
                                    </Link>

                                    <Link
                                        to="/product"
                                        className="block text-center text- hover:text-[#F0A322] text-sm transition-colors mt-3"
                                    >
                                        Continue Shopping
                                    </Link>


                                    <div className="mt-6 pt-6 border-t border-[#5b3d25] border-opacity-30">
                                        <h3 className="font-semibold mb-3">
                                            Have a promo code?
                                        </h3>
                                        <div className="flex pb-6">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                className="flex-1 bg-transparent border border-[#5b3d25] text-[#E3D5C3] px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#FFE9D5]"
                                            />
                                            <button className="bg-[#5b3d25] hover:bg-[#442314] text-[#E3D5C3] px-4 py-2 rounded-r-lg transition-colors">
                                                Apply
                                            </button>
                                        </div>
                                        <h3 className=" font-semibold mb-3">
                                            Secure Checkout
                                        </h3>
                                        <div className="flex space-x-2 ">
                                            {["UPI", "Mastercard", "NetBanking", "Paypal"].map((method) => (
                                                <div
                                                    key={method}
                                                    className="w-10 h-6 bg-[#FFE9D5] bg-opacity-20 rounded flex items-center justify-center overflow-hidden py-0.5"
                                                >
                                                    <img
                                                        src={paymentIcons[method]}
                                                        alt={method}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            ))}

                                        </div>
                                        <p className="text-xs mt-3">
                                            Your payment information is encrypted and secure
                                        </p>
                                    </div>
                                </div>

                                {/* Promo Code Section */}
                                {/* <div className="mt-6 bg-[#E3D5C3] bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41]">
                                    
                                </div> */}
                            </div>
                        )}
                    </div>

                    {/* Recommended Products (Optional) */}
                    {/* {cartProducts.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-semibold text-[#E3D5C3] mb-6 gowun-dodum-regular ">
                                You might also like
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gowun-dodum-regular">
                                {relatedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-[#E3D5C3] bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer group"
                                        onClick={() => {
                                            console.log('Product selected:', product);

                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                console.log('Product selected:', product);
                                            }
                                        }}
                                    >
                                        <div className="h-32 bg-gray-100 bg-opacity-20 rounded mb-3 overflow-hidden flex items-center justify-center">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p className="text-sm mb-1 nunito-bold">{product.name}</p>
                                        <p className="font-semibold ">₹{product.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                    {/* Related Products */}
                    <div className="mt-16 mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#E3D5C3] mb-6 sm:mb-8">
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
                <Footer />
            </section>
        </>
    );
}

export default Cart;