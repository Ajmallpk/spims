import axios from "axios";

const panchayathAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true,
});

panchayathAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "panchayath";

    return config;
});

export default panchayathAxios;