// import axiosInstance from "@/api/axiosInstance";


// const panchayathapi = {

//   verifiationStatus:() => {return axiosInstance.get("/panchayath/verification-status/")},
//   profile:()=> {return axiosInstance.get("/panchayath/profile/")},
//   verifiationStatus:()=> {return axiosInstance.get("/panchayath/verification-status/")},
//   submitVerification:()=> {return axiosInstance.post("/panchayath/submit-verification/",formData)},

// };

// export default panchayathapi;



import axiosInstance from "@/api/axiosInstance";

const panchayathApi = {

  dashboard: () => {return axiosInstance.get("/panchayath/dashboard/");},
  profile: () => {return axiosInstance.get("/panchayath/profile/");},
  verificationStatus: () => {return axiosInstance.get("/panchayath/verification-status/");},
  wardVerifications: () => {return axiosInstance.get("/panchayath/ward-verifications/");},
  submitVerification: (formData) => {return axiosInstance.post("/panchayath/submit-verification/",formData,{headers: {"Content-Type": "multipart/form-data",},});},
  approveWard: (id) => {return axiosInstance.post(`/panchayath/approve-ward/${id}/`);},
  rejectWard: (id, reason) => {return axiosInstance.post(`/panchayath/reject-ward/${id}/`, {reason,});},
  listWard:()=> {return axiosInstance.get("/panchayath/wards/")}

};


export default panchayathApi;