import axios from "axios";

const citizenAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true,
});

citizenAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "citizen";

    return config;
});

export default citizenAxios;