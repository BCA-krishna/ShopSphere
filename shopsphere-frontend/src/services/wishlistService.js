import api from "../api/axiosConfig";

export const addToWishlist = (productId) => {
    return api.post(`/wishlist/${productId}`);
};

export const getWishlist = () => {
    return api.get("/wishlist");
};

export const removeFromWishlist = (productId) => {
    return api.delete(`/wishlist/${productId}`);
};

export const checkWishlist = (productId) => {
    return api.get(`/wishlist/check/${productId}`);
};