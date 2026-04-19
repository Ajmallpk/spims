import axiosInstance from "@/api/axiosInstance"

export  const signupUser = (data) => {
  return axiosInstance.post("auth/signup/authority/", data)
}

export const verifyOtp = (data)=>{
    return axiosInstance.post("auth/verify-otp/",data)
}

export const resendOtp = (data)=>{
   return  axiosInstance.post("auth/resend-otp/",data)
}

export const loginUser = (data) => {
  return axiosInstance.post("auth/login/authority/", data)
}

export const forgotPassword = (data) =>{
  return axiosInstance.post("auth/forgot-password/", data)
}

export const verifyResetOtp = (data) =>{
  return axiosInstance.post("auth/verify-reset-otp/", data)
}

export const resetPassword = (data) =>{
  return axiosInstance.post("auth/reset-password/", data)
}


  
  










