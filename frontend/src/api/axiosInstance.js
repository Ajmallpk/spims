import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const isAuthRoute =
    config.url.includes("auth/signup") ||
    config.url.includes("auth/login") ||
    config.url.includes("auth/verify-otp") ||
    config.url.includes("auth/resend-otp");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       const refresh = localStorage.getItem("refresh");

//       if (refresh) {
//         try {
//           const response = await axios.post(
//             "http://127.0.0.1:8000/api/auth/token/refresh/",
//             { refresh }
//           );

//           localStorage.setItem("access", response.data.access);

//           error.config.headers.Authorization =
//             `Bearer ${response.data.access}`;

//           return axiosInstance(error.config);
//         } catch (refreshError) {
//           localStorage.clear();
//           window.location.href = "/";
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          { refresh }
        );

        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance