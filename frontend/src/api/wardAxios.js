import axios from "axios";

const wardAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true,
});

wardAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "ward";

    return config;
});

export default wardAxios;