import api from "../api/axiosConfig";

export const getDashboard = () => {
    return api.get("/admin/dashboard");
};