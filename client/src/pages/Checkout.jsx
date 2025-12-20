import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import api from "../api/axios";


function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);

    // Form State for new address
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        zipCode: "",
        isPrimary: false
    });

    const [deliveryMethod, setDeliveryMethod] = useState("standard");


    // Load Cart Data and Addresses
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cartRes, userRes] = await Promise.all([
                    api.get('/users/cart'),
                    api.get('/users/me')
                ]);
                setCartItems(cartRes.data);
                const userAddresses = userRes.data.addresses || [];
                setAddresses(userAddresses);

                // Select primary address by default if exists
                const primaryIndex = userAddresses.findIndex(a => a.isPrimary);
                if (primaryIndex > -1) {
                    setSelectedAddressIndex(primaryIndex);
                } else if (userAddresses.length > 0) {
                    setSelectedAddressIndex(0);
                } else {
                    setShowNewAddressForm(true); // No address, show form
                }

                // Prefill user details if available
                if (userRes.data) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: userRes.data.name || "",
                        email: userRes.data.email || "",
                        phone: userRes.data.phone || ""
                    }));
                }

            } catch (error) {
                console.error("Error loading checkout data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculations
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateShipping = () => {
        if (deliveryMethod === 'express') return 15.00;
        return calculateSubtotal() > 50 ? 0 : 5.99;
    };

    const calculateTax = () => calculateSubtotal() * 0.085;

    const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

    // Handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddressSelect = (index) => {
        setSelectedAddressIndex(index);
        setShowNewAddressForm(false);
    };

    const handleAddNewAddressToggle = () => {
        setShowNewAddressForm(true);
        setSelectedAddressIndex(null);
        // Clear address fields but keep user contact info if needed
        setFormData(prev => ({
            ...prev,
            street: "",
            city: "",
            state: "",
            zipCode: ""
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        let shippingAddress;

        if (showNewAddressForm) {
            // Validate new address form
            if (!formData.street || !formData.city || !formData.zipCode) {
                alert("Please fill in all address fields.");
                return;
            }

            // Save new address first
            try {
                const res = await api.post('/users/address', {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zipCode: formData.zipCode,
                    isPrimary: formData.isPrimary
                });
                // The newly added address is usually the last one, or we can use the returned array
                // For simplicity, we assume success means we can use this data
                shippingAddress = {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zipCode: formData.zipCode
                };
                // Refresh addresses list
                setAddresses(res.data);
            } catch (error) {
                console.error("Error saving address:", error);
                alert("Failed to save address. Please try again.");
                return;
            }
        } else {
            if (selectedAddressIndex === null || !addresses[selectedAddressIndex]) {
                alert("Please select a shipping address.");
                return;
            }
            shippingAddress = addresses[selectedAddressIndex];
        }

        // Place Order Logic
        try {
            const orderPayload = {
                items: cartItems.map(item => ({
                    product: item.productId || item.id,
                    name: item.title || item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    country: shippingAddress.country,
                    zipCode: shippingAddress.zipCode
                },
                pricing: {
                    subtotal: calculateSubtotal(),
                    shipping: calculateShipping(),
                    tax: calculateTax(),
                    total: calculateTotal()
                },
                deliveryMethod: deliveryMethod
            };

            const res = await api.post('/orders', orderPayload);

            if (res.data.success) {
                alert("Order placed successfully!");
                navigate("/profile?tab=orders");
            }
        } catch (error) {
            console.error("Error creating order:", error);
            alert(error.response?.data?.message || "Failed to place order. Please try again.");
        }
    };

    const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

    if (loading) return <div className="min-h-screen bg-[#442314] text-[#E3D5C3] flex items-center justify-center">Loading...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#442314] text-[#E3D5C3]">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[80vh] px-4">
                    <h2 className="text-3xl font-bold mb-4 gowun-dodum-regular">Your cart is empty</h2>
                    <Link to="/product">
                        <Button labell="Continue Shopping" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#442314] text-[#5b3d25] font-sans pb-12"
            style={{
                backgroundImage: "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
                backgroundSize: "14px 14px",
            }}
        >
            <Navbar />
            <div className="my-8 sm:my-10 md:my-12 lg:my-14 mx-4 sm:mx-5">
                <h1 className="boldonse-bold text-[#E3D5C3] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                    CHECKOUT
                </h1>
            </div>

            {/* Progress Indicator */}
            {/* <div className="max-w-7xl mx-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center space-x-4 text-[#E3D5C3] text-sm md:text-base gowun-dodum-regular">
                    <span className="opacity-60">Cart</span>
                    <span className="w-8 h-px bg-[#E3D5C3] opacity-40"></span>
                    <span className="font-bold border-b-2 border-[#E3D5C3] pb-1">Checkout</span>
                    <span className="w-8 h-px bg-[#E3D5C3] opacity-40"></span>
                    <span className="opacity-60">Payment</span>
                </div>
            </div> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Shipping & Details */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Shipping Information */}
                        <div className="bg-[#E3D5C3] bg-opacity-95 rounded-lg p-6 sm:p-8 shadow-lg border border-[#5b3d25] border-opacity-20">
                            <h2 className="text-2xl font-bold text-[#442314] mb-6 gowun-dodum-regular border-b border-[#5b3d25] border-opacity-20 pb-2">
                                Shipping Information
                            </h2>

                            {/* Saved Addresses List */}
                            {addresses.length > 0 && (
                                <div className="mb-6 space-y-3">
                                    <h3 className="font-semibold text-[#442314]">Saved Addresses</h3>
                                    {addresses.map((addr, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAddressSelect(index)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressIndex === index && !showNewAddressForm ? 'border-[#5b3d25] bg-[#5b3d25]/10' : 'border-[#d4c5b0] hover:bg-[#5b3d25]/5'}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full border border-[#5b3d25] flex items-center justify-center mt-0.5 ${selectedAddressIndex === index && !showNewAddressForm ? 'bg-[#5b3d25]' : 'bg-transparent'}`}>
                                                    {selectedAddressIndex === index && !showNewAddressForm && <div className="w-2 h-2 rounded-full bg-[#E3D5C3]"></div>}
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-semibold">{addr.isPrimary ? 'Primary Address' : `Address ${index + 1}`}</p>
                                                    <p>{addr.street}</p>
                                                    <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                                    <p>{addr.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Use New Address Toggle */}
                            <div
                                onClick={handleAddNewAddressToggle}
                                className={`p-4 border border-dashed border-[#5b3d25] rounded-lg cursor-pointer mb-6 flex items-center gap-3 transition-colors ${showNewAddressForm ? 'bg-[#5b3d25]/5' : 'hover:bg-[#5b3d25]/5'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border border-[#5b3d25] flex items-center justify-center ${showNewAddressForm ? 'bg-[#5b3d25]' : 'bg-transparent'}`}>
                                    {showNewAddressForm && <div className="w-2 h-2 rounded-full bg-[#E3D5C3]"></div>}
                                </div>
                                <span className="font-semibold text-[#442314]">Add a new address</span>
                            </div>

                            {/* New Address Form */}
                            {showNewAddressForm && (
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                                        <input
                                            type="text" name="fullName" required
                                            value={formData.fullName} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Email</label>
                                        <input
                                            type="email" name="email" required
                                            value={formData.email} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Phone</label>
                                        <input
                                            type="tel" name="phone" required
                                            value={formData.phone} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Street Address</label>
                                        <input
                                            type="text" name="street" required
                                            value={formData.street} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                            placeholder="Street, House No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">City</label>
                                        <input
                                            type="text" name="city" required
                                            value={formData.city} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">State</label>
                                        <input
                                            type="text" name="state" required
                                            value={formData.state} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Country</label>
                                        <select
                                            name="country"
                                            value={formData.country} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                        >
                                            <option value="India">India</option>
                                            <option value="USA">United States</option>
                                            <option value="UK">United Kingdom</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Pincode</label>
                                        <input
                                            type="text" name="zipCode" required
                                            value={formData.zipCode} onChange={handleInputChange}
                                            className="w-full bg-[#fcf8f2] border border-[#d4c5b0] rounded p-3 focus:outline-none focus:border-[#442314] transition-colors"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isPrimary"
                                            name="isPrimary"
                                            checked={formData.isPrimary}
                                            onChange={handleInputChange}
                                            className="rounded border-[#5b3d25] text-[#5b3d25] focus:ring-[#5b3d25]"
                                        />
                                        <label htmlFor="isPrimary" className="text-sm font-semibold">Save as primary address</label>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Delivery Method */}
                        <div className="bg-[#E3D5C3] bg-opacity-95 rounded-lg p-6 sm:p-8 shadow-lg border border-[#5b3d25] border-opacity-20">
                            <h2 className="text-2xl font-bold text-[#442314] mb-6 gowun-dodum-regular border-b border-[#5b3d25] border-opacity-20 pb-2">
                                Delivery Method
                            </h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 border rounded cursor-pointer transition-all ${deliveryMethod === 'standard' ? 'border-[#442314] bg-[#f0e6d9]' : 'border-[#d4c5b0]'}`}>
                                    <input
                                        type="radio" name="deliveryMethod" value="standard"
                                        checked={deliveryMethod === 'standard'}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        className="w-5 h-5 text-[#442314] focus:ring-[#442314]"
                                    />
                                    <div className="ml-4 flex-1">
                                        <span className="block font-semibold">Standard Delivery</span>
                                        <span className="text-sm opacity-80">3–5 business days</span>
                                    </div>
                                    <span className="font-bold">{calculateSubtotal() > 50 ? 'FREE' : '₹5.99'}</span>
                                </label>
                                <label className={`flex items-center p-4 border rounded cursor-pointer transition-all ${deliveryMethod === 'express' ? 'border-[#442314] bg-[#f0e6d9]' : 'border-[#d4c5b0]'}`}>
                                    <input
                                        type="radio" name="deliveryMethod" value="express"
                                        checked={deliveryMethod === 'express'}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        className="w-5 h-5 text-[#442314] focus:ring-[#442314]"
                                    />
                                    <div className="ml-4 flex-1">
                                        <span className="block font-semibold">Express Delivery</span>
                                        <span className="text-sm opacity-80">1–2 business days</span>
                                    </div>
                                    <span className="font-bold">₹15.00</span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Method (Placeholder) */}
                        <div className="bg-[#E3D5C3] bg-opacity-95 rounded-lg p-6 sm:p-8 shadow-lg border border-[#5b3d25] border-opacity-20 opacity-80">
                            <h2 className="text-2xl font-bold text-[#442314] mb-4 gowun-dodum-regular border-b border-[#5b3d25] border-opacity-20 pb-2 flex justify-between items-center">
                                Payment Method
                                <span className="text-xs bg-[#5b3d25] text-[#E3D5C3] px-2 py-1 rounded">Coming Soon</span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Card', 'UPI', 'Wallet', 'COD'].map(method => (
                                    <div key={method} className="border border-[#d4c5b0] rounded p-4 text-center text-gray-400 cursor-not-allowed bg-gray-50 bg-opacity-50">
                                        <span className="block font-semibold">{method}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#E3D5C3] bg-opacity-95 backdrop-blur-sm rounded-lg p-6 sm:p-8 sticky top-24 border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41]">
                            <h2 className="text-2xl font-bold text-[#442314] mb-6 nunito-exbold">Order Summary</h2>

                            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.color}`} className="flex gap-4 items-start">
                                        <div className="w-16 h-16 shrink-0 bg-gray-200 rounded overflow-hidden">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-[#442314] line-clamp-1">{item.title}</p>
                                            <p className="text-sm opacity-75">{item.color} | Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#5b3d25] border-opacity-20 pt-4 space-y-3 text-[#442314]">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(calculateSubtotal())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{calculateShipping() === 0 ? "FREE" : formatCurrency(calculateShipping())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax estimate</span>
                                    <span>{formatCurrency(calculateTax())}</span>
                                </div>
                                <div className="border-t border-[#5b3d25] border-opacity-50 pt-3 flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>

                            {/* Coupon Code - already hai cart pe */}
                            {/* <div className="mt-6 pt-4 border-t border-[#5b3d25] border-opacity-20">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Promo Code"
                                        className="flex-1 bg-[#fcf8f2] border border-[#d4c5b0] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#442314]"
                                    />
                                    <button className="px-4 py-2 bg-[#5b3d25] text-[#E3D5C3] text-sm font-bold rounded hover:bg-[#442314] transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div> */}

                            <div className="mt-8">
                                <Button
                                    labell="Proceed to Payment"
                                    onClick={handlePlaceOrder}
                                    className="w-full text-lg" // Added text-lg to match original look slightly
                                />
                                <p className="text-xs text-center mt-3 opacity-70">
                                    Secure Checkout - SSL Encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;