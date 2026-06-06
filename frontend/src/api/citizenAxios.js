import axios from "axios";

const citizenAxios = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
});

citizenAxios.interceptors.request.use((config) => {

    config.headers["X-Role"] = "citizen";

    return config;
});

export default citizenAxios;