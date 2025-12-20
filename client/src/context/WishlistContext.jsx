/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { addToast } = useToast();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setWishlist([]);
                return;
            }
            const res = await api.get('/users/wishlist');
            setWishlist(res.data);
        } catch (error) {
            // Silently ignore 401 errors (user not logged in) - this is expected
            if (error.response?.status !== 401) {
                console.error("Failed to fetch wishlist", error);
            }
        }
    };

    const addToWishlist = async (product) => {
        if (!product || !product.id) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                addToast("Please login to add to wishlist", "error");
                return;
            }
            if (isInWishlist(product.id)) {
                addToast("Item already in wishlist", "info");
                return;
            }

            const res = await api.post('/users/wishlist', { productId: product.id });
            setWishlist(res.data);
            addToast("Added to wishlist", "success");
        } catch (error) {
            console.error("Failed to add to wishlist", error);
            addToast("Failed to add to wishlist", "error");
        }
    };

    const removeFromWishlist = async (id) => {
        try {
            const res = await api.delete(`/users/wishlist/${id}`);
            setWishlist(res.data);
            addToast("Removed from wishlist", "success");
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
            addToast("Failed to remove from wishlist", "error");
        }
    };

    const isInWishlist = (id) => {
        return wishlist.some((item) => item._id === id || item.id === id);
    };

    const clearWishlist = async () => {
        try {
            await api.delete('/users/wishlist');
            setWishlist([]);
            addToast("Wishlist cleared", "success");
        } catch (error) {
            console.error("Failed to clear wishlist", error);
            addToast("Failed to clear wishlist", "error");
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
