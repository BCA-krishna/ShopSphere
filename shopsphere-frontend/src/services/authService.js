import api from "../api/axiosConfig";

export const login = (loginData) => {

    return api.post("/auth/login", loginData);

};