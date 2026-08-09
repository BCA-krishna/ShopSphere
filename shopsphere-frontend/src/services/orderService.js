import api from "../api/axiosConfig";

export const checkout = (data) => {
    return api.post("/orders/checkout", data);
};

export const placeOrder = (data) => {
    return api.post("/orders", data);
};

export const cancelOrder = (orderId) => {
    return api.put(`/orders/${orderId}/cancel`);
};

export const getMyOrders = () => {
    return api.get("/orders");
};

export const getOrderById = (orderId) => {
    return api.get(`/orders/${orderId}`);
};

// Admin APIs

export const getAllOrders = () => {
    return api.get("/orders/admin");
};

export const updateOrderStatus = (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, {
        status,
    });
};