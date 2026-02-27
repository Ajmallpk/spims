import axiosInstance from "@/api/axiosInstance";


const citizenapi = {
  register: (data) => {return axiosInstance.post("auth/signup/citizen/", data);},
  verifyOTP: (data) => {return axiosInstance.post("/auth/verify-otp/", data);},
  resendOTP: (data) => {return axiosInstance.post("/auth/resend-otp/", data);},
  login:(data) =>{return axiosInstance.post("auth/login/citizen/",data)},
  resendOTP: (data) =>{return axiosInstance.post("auth/resend-otp/", data)},

};

export default citizenapi;