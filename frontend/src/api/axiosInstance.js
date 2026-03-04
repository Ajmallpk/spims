// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access");

//   const isAuthRoute =
//     config.url.includes("auth/signup") ||
//     config.url.includes("auth/login") ||
//     config.url.includes("auth/verify-otp") ||
//     config.url.includes("auth/resend-otp");

//   if (token && !isAuthRoute) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });





// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       const refresh = localStorage.getItem("refresh");

//       if (!refresh) {
//         localStorage.clear();
//         window.location.href = "/";
//         return Promise.reject(error);
//       }

//       try {
//         const response = await axios.post(
//           "http://127.0.0.1:8000/api/auth/token/refresh/",
//           { refresh }
//         );

//         const newAccess = response.data.access;
//         localStorage.setItem("access", newAccess);

//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         localStorage.clear();
//         window.location.href = "/";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );


// export default axiosInstance




import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const isAuthRoute =
    config.url.includes("auth/login") ||
    config.url.includes("auth/signup") ||
    config.url.includes("auth/verify-otp") ||
    config.url.includes("auth/resend-otp") ||
    config.url.includes("auth/forgot-password") ||
    config.url.includes("auth/verify-reset-otp") ||
    config.url.includes("auth/reset-password");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest.url.includes("auth/login") ||
      originalRequest.url.includes("auth/signup") ||
      originalRequest.url.includes("auth/verify-otp") ||
      originalRequest.url.includes("auth/resend-otp") ||
      originalRequest.url.includes("auth/forgot-password") ||
      originalRequest.url.includes("auth/verify-reset-otp") ||
      originalRequest.url.includes("auth/reset-password");

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
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
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;