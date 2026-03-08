
import axiosInstance from "@/api/axiosInstance";

const panchayathApi = {

  dashboard: () => {return axiosInstance.get("/panchayath/dashboard/");},
  profile: () => {return axiosInstance.get("/panchayath/profile/");},
  verificationStatus: () => {return axiosInstance.get("/panchayath/verification-status/");},
  wardVerifications: () => {return axiosInstance.get("/panchayath/ward-verifications/");},
  submitVerification: (formData) => {return axiosInstance.post("/panchayath/submit-verification/",formData,{headers: {"Content-Type": "multipart/form-data",},});},
  approveWard: (id) => {return axiosInstance.post(`/panchayath/approve-ward/${id}/`);},
  rejectWard: (id, reason) =>{return axiosInstance.post(`/panchayath/reject-ward/${id}/`, {reason: reason})},
  listWard: (params) => axiosInstance.get("/panchayath/wards/", { params }),
  wardDetail: (id) =>{return axiosInstance.get(`/panchayath/ward/${id}/`)},
  handleAuthError:(err) => {
  if (err.response?.status === 401) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    window.location.href = "/login";
  }
}

};


export default panchayathApi;