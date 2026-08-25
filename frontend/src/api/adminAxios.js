import axios from "axios";

const adminAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true,
});

adminAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "admin";

    return config;
});

export default adminAxios;