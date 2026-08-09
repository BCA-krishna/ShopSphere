import api from "../api/axiosConfig";

// ============================
// Admin APIs
// ============================

export const createCoupon = (coupon) => {
    return api.post("/admin/coupons", coupon);
};

export const getAllCoupons = () => {
    return api.get("/admin/coupons");
};

export const updateCoupon = (id, coupon) => {
    return api.put(`/admin/coupons/${id}`, coupon);
};

export const deleteCoupon = (id) => {
    return api.delete(`/admin/coupons/${id}`);
};

// ============================
// Customer API
// ============================

export const applyCoupon = (data) => {
    return api.post("/coupons/apply", data);
};