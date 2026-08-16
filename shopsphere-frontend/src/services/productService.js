import api from "../api/axiosConfig";

// Generic paginated fetch — used by the Products page (with real
// pagination controls) and can be reused anywhere else that needs a
// specific page/size.
export const getAllProducts = (page = 0, size = 20, sortBy = "id", direction = "asc") => {
    return api.get("/products", {
        params: { page, size, sortBy, direction },
    });
};

// Home page shows a fixed set of "Featured products" — just the first
// 50, not the whole catalog.
export const getFeaturedProducts = () => {
    return api.get("/products", {
        params: { page: 0, size: 50 },
    });
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