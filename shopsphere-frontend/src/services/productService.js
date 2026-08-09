import api from "../api/axiosConfig";

export const getAllProducts = () => {
    return api.get("/products");
};

export const addProduct = (formData) => {
    return api.post("/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateProduct = (id, formData) => {
    return api.put(`/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};

export const getProductById = (id) => {
    return api.get(`/products/${id}`);
};

export const searchProducts = (keyword) => {
    return api.get(`/products/search?keyword=${keyword}`);
};

export const getProductsByCategory = (category) => {
    return api.get(`/products/category/${category}`);
};

export const getCategories = () => {
    return api.get("/products/categories");
};