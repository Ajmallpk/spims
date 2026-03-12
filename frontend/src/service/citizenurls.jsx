import axiosInstance from "@/api/axiosInstance";



const citizenapi = {

  // AUTH
  login: (data) => { return axiosInstance.post("auth/login/citizen/") },
  register: (data) => { return axiosInstance.post("/auth/signup/citizen/", data); },
  verifyOTP: (data) => { return axiosInstance.post("auth/verify-otp/", data); },
  resendOTP: (data) => { return axiosInstance.post("auth/resend-otp/", data); },
  login: (data) => { return axiosInstance.post("auth/login/citizen/", data) },
  resendOTP: (data) => { return axiosInstance.post("auth/resend-otp/", data) },
  getProfile: () => { return axiosInstance.get("citizen/profile/") },
  updateProfile: (data) => { return axiosInstance.patch("citizen/profile/update/", data) },
  submitVerification: (formData) => {
    return axiosInstance.post("citizen/verification/submit/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  getVerificationStatus: () => { return axiosInstance.get("citizen/verification/status/") },
  submitVerification: (formData) => {
    return axiosInstance.post("citizen/verification/submit/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadAvatar: (formData) => {
    return axiosInstance.post("citizen/upload-avatar/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getWards: () => {
    return axiosInstance.get("citizen/wards/");
  },

  changePassword: (data) => {
    return axiosInstance.post("citizen/change-password/", data);
  },

  changeEmail: (data) => {
    return axiosInstance.post("citizen/change-email/", data);
  },

  verifyEmailChange: (token) => {
    return axiosInstance.get(`/citizen/change-email/verify/${token}/`);
  },



};

export default citizenapi;