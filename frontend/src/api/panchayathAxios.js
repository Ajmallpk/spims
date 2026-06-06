import axios from "axios";

const panchayathAxios = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
});

panchayathAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "panchayath";

    return config;
});

export default panchayathAxios;