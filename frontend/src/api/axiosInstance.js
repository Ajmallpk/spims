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



import toast from "react-hot-toast";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

axiosInstance.interceptors.request.use((config) => {
  NProgress.start();
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
  (response) => {
    NProgress.done();
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    const isAuthRoute =
      url.includes("auth/login") ||
      url.includes("auth/signup") ||
      url.includes("auth/verify-otp") ||
      url.includes("auth/resend-otp") ||
      url.includes("auth/forgot-password") ||
      url.includes("auth/verify-reset-otp") ||
      url.includes("auth/reset-password");

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
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
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const status = error.response.status;

      if (status === 403) {
        toast.error("You don't have permission to perform this action.");
      }

      else if (status === 404) {
        toast.error("Requested resource not found.");
      }

      else if (status === 500) {
        toast.error("Server error. Please try again later.");
      }

      else if (status !== 401) {
        toast.error(error.response.data?.detail || "Request failed.");
      }

    } else {
      toast.error("Network error. Please check your internet connection.");
    }

    NProgress.done();
    return Promise.reject(error);
  }
);

export default axiosInstance;