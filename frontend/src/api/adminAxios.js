import axios from "axios";

const adminAxios = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
});

adminAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "admin";

    return config;
});

export default adminAxios;