import axios from "axios"

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
})

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const signupUser = (data) => {
  return API.post("auth/signup/", data)
}

export const verifyOtp = (data)=>{
    return API.post("auth/verify-otp/",data)
}

export const resendOtp = (data)=>{
   return  API.post("auth/resend-otp/",data)
}

export const loginUser = (data) => {
  return API.post("auth/login/", data)
}
export const getblockverification = () => {
  return API.get("/api/admin/block_verifications/")
}










