import axiosInstance from "@/api/axiosInstance"

export const signupUser = (data) => {
  return axiosInstance.post("auth/signup/", data)
}

export const verifyOtp = (data)=>{
    return axiosInstance.post("auth/verify-otp/",data)
}

export const resendOtp = (data)=>{
   return  axiosInstance.post("auth/resend-otp/",data)
}

export const loginUser = (data) => {
  return axiosInstance.post("auth/login/", data)
}
export const getblockverification = () => {
  return axiosInstance.get("/api/admin/block_verifications/")
}










