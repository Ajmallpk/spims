import axiosInstance from "@/api/axiosInstance";


const citizenapi = {
  login:(data) => {return axiosInstance.post("auth/login/citizen/")},
  register:  (data) => {return axiosInstance.post("/auth/signup/citizen/", data);},
  verifyOTP: (data) => {return axiosInstance.post("auth/verify-otp/", data);},
  resendOTP: (data) => {return axiosInstance.post("auth/resend-otp/", data);},
  login:     (data) => {return axiosInstance.post("auth/login/citizen/",data)},
  resendOTP: (data) =>  {return axiosInstance.post("auth/resend-otp/", data)},
  getProfile: () => {return axiosInstance.get("citizen/profile/")},
  updateProfile: (data) => {return axiosInstance.put("citizen/profile/update/", data)},
  uploadAvatar: (formData) => {return axiosInstance.post("citizen/upload-avatar/", formData)},
  getVerificationStatus: () => {return axiosInstance.get("citizen/verification/status/")},
  submitVerification: (formData) => {return axiosInstance.post("citizen/verification/submit/", formData)}

};

export default citizenapi;