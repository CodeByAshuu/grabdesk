import React, { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            // Parse and filter out null/undefined/invalid items immediately
            return savedWishlist ? JSON.parse(savedWishlist).filter(item => item && item.id) : [];
        } catch (error) {
            console.error("Failed to parse wishlist from local storage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        if (!product || !product.id) return;
        setWishlist((prev) => {
            if (prev.find((item) => item?.id === product.id)) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((item) => item?.id !== id));
    };

    const isInWishlist = (id) => {
        return wishlist.some((item) => item?.id === id);
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
