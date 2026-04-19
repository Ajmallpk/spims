



// import toast from "react-hot-toast";
// import axios from "axios";
// import NProgress from "nprogress";
// import "nprogress/nprogress.css";

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
// });

// axiosInstance.interceptors.request.use((config) => {
//   NProgress.start();
//   const token = localStorage.getItem("access");

//   const isAuthRoute =
//     config.url.includes("auth/login") ||
//     config.url.includes("auth/signup") ||
//     config.url.includes("auth/verify-otp") ||
//     config.url.includes("auth/resend-otp") ||
//     config.url.includes("auth/forgot-password") ||
//     config.url.includes("auth/verify-reset-otp") ||
//     config.url.includes("auth/reset-password");

//   if (token && !isAuthRoute) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });


// axiosInstance.interceptors.response.use(
//   (response) => {
//     NProgress.done();
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const url = originalRequest?.url || "";

//     const isAuthRoute =
//       url.includes("auth/login") ||
//       url.includes("auth/signup") ||
//       url.includes("auth/verify-otp") ||
//       url.includes("auth/resend-otp") ||
//       url.includes("auth/forgot-password") ||
//       url.includes("auth/verify-reset-otp") ||
//       url.includes("auth/reset-password");

//     if (isAuthRoute) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refresh = localStorage.getItem("refresh");

//       if (!refresh) {
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         window.location.href = "/login";
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
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     if (error.response) {

//       const data = error.response?.data;

//       if (
//         data?.error === "ACCOUNT_SUSPENDED" ||
//         data?.message?.toLowerCase().includes("suspended")
//       ) {

//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");

//         window.dispatchEvent(new Event("ACCOUNT_SUSPENDED"));

//         return Promise.reject(error);
//       }

//       const status = error.response.status;

//       const message =
//         error.response?.data?.error ||
//         error.response?.data?.detail ||
//         error.response?.data?.message ||
//         Object.values(error.response?.data || {})[0];

//       if (status === 401) {
//         // handled by refresh logic
//       }
//       else if (status === 403) {
//         toast.error(message || "You don't have permission to perform this action.");
//       }
//       else if (status === 404) {
//         toast.error(message || "Requested resource not found.");
//       }
//       else if (status === 500) {
//         toast.error("Server error. Please try again later.");
//       }
//       else {
//         toast.error(message || "Request failed.");
//       }

//     } else {
//       toast.error("Network error. Please check your internet connection.");
//     }

//     NProgress.done();
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;






import toast from "react-hot-toast";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { triggerSuspension } from "@/utils/suspensionHandler";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
  xsrfCookieName: "csrftoken",        
  xsrfHeaderName: "X-CSRFToken",
});

axiosInstance.interceptors.request.use((config) => {
  NProgress.start();

  // const token = localStorage.getItem("access");

  // const isAuthRoute =
  //   config.url.includes("auth/login") ||
  //   config.url.includes("auth/signup") ||
  //   config.url.includes("auth/verify-otp") ||
  //   config.url.includes("auth/resend-otp") ||
  //   config.url.includes("auth/forgot-password") ||
  //   config.url.includes("auth/verify-reset-otp") ||
  //   config.url.includes("auth/reset-password");

  // if (token && !isAuthRoute) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },

  async (error) => {

    const data = error.response?.data;

    if (
      data?.error?.includes("ACCOUNT_SUSPENDED") ||
      data?.message?.[0]?.toLowerCase().includes("suspended")
    ) {
      console.log("ACCOUNT SUSPENDED DETECTED");

      // localStorage.removeItem("access");
      // localStorage.removeItem("refresh");

      triggerSuspension();

      NProgress.done();
      return Promise.reject(error);
    }

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

    // Skip auth route errors
    if (isAuthRoute) {
      NProgress.done();
      return Promise.reject(error);
    }

    // TOKEN REFRESH
    // if (error.response?.status === 401 && !originalRequest._retry) {

    //   originalRequest._retry = true;

    //   const refresh = localStorage.getItem("refresh");

    //   if (!refresh) {
    //     localStorage.removeItem("access");
    //     localStorage.removeItem("refresh");
    //     window.location.href = "/login";
    //     return Promise.reject(error);
    //   }

    //   try {

    //     const response = await axios.post(
    //       "http://127.0.0.1:8000/api/auth/token/refresh/",
    //       { refresh }
    //     );

    //     const newAccess = response.data.access;

    //     localStorage.setItem("access", newAccess);

    //     originalRequest.headers.Authorization = `Bearer ${newAccess}`;

    //     return axiosInstance(originalRequest);

    //   } catch (refreshError) {

    //     localStorage.removeItem("access");
    //     localStorage.removeItem("refresh");

    //     window.location.href = "/login";

    //     return Promise.reject(refreshError);
    //   }
    // }

    // OTHER ERRORS
    if (error.response) {

      const status = error.response.status;

      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        Object.values(error.response?.data || {})[0];

      if (status === 403) {
        toast.error(message || "You don't have permission to perform this action.");
      }
      else if (status === 404) {
        toast.error(message || "Requested resource not found.");
      }
      else if (status === 500) {
        toast.error("Server error. Please try again later.");
      }
      else {
        toast.error(message || "Request failed.");
      }

    } else {
      toast.error("Network error. Please check your internet connection.");
    }

    NProgress.done();
    return Promise.reject(error);
  }
);

export default axiosInstance;