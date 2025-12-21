import React from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import SingleStar from "../components/SingleStar";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import Button from "./Button";
import api from "../api/axios";

function ProductCard(props) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();
    const navigate = useNavigate();

    // Determine final price
    // Priority: props.price (new standard) -> props.priceNum (from Product.jsx) -> parse props.pricee (legacy string)
    let finalPrice = 0;
    if (props.price !== undefined && typeof props.price === 'number') {
        finalPrice = props.price;
    } else if (props.priceNum !== undefined && typeof props.priceNum === 'number') {
        finalPrice = props.priceNum;
    } else if (props.pricee) {
        // Try to parse string like "₹ 4,500"
        finalPrice = parseFloat(String(props.pricee).replace(/[^0-9.]/g, ''));
        if (isNaN(finalPrice)) finalPrice = 0;
    }

    // Determine base price (original price before discount)
    let basePrice = 0;
    if (props.basePrice !== undefined && typeof props.basePrice === 'number') {
        basePrice = props.basePrice;
    } else if (props.originalPrice !== undefined) {
        basePrice = parseFloat(String(props.originalPrice).replace(/[^0-9.]/g, ''));
    }

    // Determine discount
    let discount = 0;
    if (props.discount !== undefined) {
        discount = props.discount;
    } else if (basePrice > finalPrice) {
        discount = Math.round(((basePrice - finalPrice) / basePrice) * 100);
    }

    // Fallback: Calculate basePrice if missing but discount exists
    if ((!basePrice || basePrice === 0) && finalPrice > 0 && discount > 0) {
        basePrice = finalPrice / (1 - (discount / 100));
    }

    // Construct product object correctly from props
    const product = {
        id: props.id,
        name: props.namee || props.name,
        price: finalPrice,
        originalPriceString: props.pricee, // Keep original string for display
        rating: props.rating,
        images: props.images,
        available: true // Default to true as it's not passed in props currently
    };

    const isLiked = isInWishlist(props.id);

    const handleCardClick = () => {
        if (props.id) {
            navigate(`/product/${props.id}`);
        }
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            addToast("Please login to website", "error");
            return;
        }

        if (isLiked) {
            removeFromWishlist(props.id);
            addToast("Removed from wishlist", "info");
        } else {
            addToWishlist(product);
            addToast("Added to wishlist", "success");
        }
    };

    const handleBuyClick = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            addToast("Please login to website", "error");
            navigate('/login');
            return;
        }

        try {
            await api.post('/users/cart', {
                productId: props.id,
                quantity: 1,
                size: "Standard", // Default for quick add
                color: "Standard" // Default for quick add
            });

            if (props.moveToCart) {
                removeFromWishlist(props.id);
                addToast("Moved to cart", "success");
            } else {
                // Redirect to Cart
                navigate('/cart');
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            addToast("Failed to add to cart", "error");
        }
    };

    // Format currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className="w-[310px] max-w-full sm:w-[300px] md:w-[310px] 
                h-auto sm:h-[500px] rounded-md p-3 bg-[#FFE9D5] relative border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 mx-auto text-[#452215] cursor-pointer"
            >

                {(props.tagg || discount > 0) && (
                    <div className="nunito-exbold absolute -top-1 -left-6 bg-[#d19a2c] text-white px-8 py-2 text-sm rounded-xs rotate-[-13deg] shadow-md z-20">
                        {props.tagg || `${discount}% OFF`}
                    </div>
                )}

                {/* image */}
                <ImageSlider images={props.images} />

                <div className="flex justify-end items-baseline ">
                    <div className="flex flex-row gap-5">
                        <SingleStar rating={props.rating || 0} />
                        <button
                            onClick={handleLikeClick}
                            className="p-2 rounded-full transition-transform duration-200 active:scale-90"
                        >
                            <FaHeart
                                className={`text-2xl transition-all duration-300 ${isLiked ? "text-red-500 scale-110" : "text-white"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <h3 className="text-[18px] nunito-exbold">{props.namee || props.name}</h3>

                <div className="flex flex-col">
                    <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-lg">{formatPrice(finalPrice)}</span>
                        {basePrice > finalPrice && (
                            <span className="text-sm line-through opacity-60">{formatPrice(basePrice)}</span>
                        )}
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Button labell={props.buttonText || "Buy Now"} onClick={handleBuyClick} />
                    </div>
                </div>

            </div>
        </>
    );
}

export default ProductCard;