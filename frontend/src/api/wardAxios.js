import axios from "axios";

const wardAxios = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
});

wardAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "ward";

    return config;
});

export default wardAxios;