import api from "../api/axiosConfig";

export const addToCart = (data) => {
    return api.post("/cart/add", data);
};

export const getCart = () => {
    return api.get("/cart");
};

export const updateCartItem = (cartItemId, data) => {
    return api.put(`/cart/items/${cartItemId}`, data);
};

export const removeCartItem = (cartItemId) => {
    return api.delete(`/cart/items/${cartItemId}`);
};

export const getCartCount = () => {
    return api.get("/cart/count");
};