import axiosInstance from "@/api/axiosInstance"

// export  const signupUser = (data) => {
//   return axiosInstance.post("auth/signup/authority/", data)
// }

// export const verifyOtp = (data)=>{
//     return axiosInstance.post("auth/verify-otp/",data)
// }

// export const resendOtp = (data)=>{
//    return  axiosInstance.post("auth/resend-otp/",data)
// }

export const loginUser = (data) => {
  return axiosInstance.post("auth/login/authority/", data)
}

export const forgotPassword = (data) => {
  return axiosInstance.post("auth/forgot-password/", data)
}



export const resendResetOtp = async (data) => {
    const response = await api.post(
        "/auth/resend-reset-otp/",
        data
    );

    return response.data;
};

export const verifyResetOtp = (data) => {
  return axiosInstance.post("auth/verify-reset-otp/", data)
}

export const resetPassword = (data) => {
  return axiosInstance.post("auth/reset-password/", data)
}


export const setPassword = async (
  token,
  data
) => {

  console.log("INSIDE SERVICE");

  try {

    const response = await axiosInstance.post(
      `auth/set-password/${token}/`,
      data
    );

    console.log("API SUCCESS", response);

    return response;

  } catch (error) {

    console.log("API ERROR", error);

    throw error;
  }

};











