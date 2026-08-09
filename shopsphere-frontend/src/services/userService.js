import api from "../api/axiosConfig";

export const getAllUsers = (page = 0, size = 10) => {
    return api.get(`/users?page=${page}&size=${size}`);
};;

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};

export const registerUser = (data) => {
    return api.post("/auth/register", data);
};