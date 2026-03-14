// import axiosInstance from "@/api/axiosInstance";

// const wardapi = {
//   profile: () => axiosInstance.get("/ward/profile/"),
//   verificationStatus: () => {return axiosInstance.get("/ward/verification-status/")},
//   submitVerification: (formData) => {return axiosInstance.post("/ward/submit-verification/", formData, {headers: { "Content-Type": "multipart/form-data" },})},
//   dashboard: () => {return axiosInstance.get("/ward/dashboard/")},
//   citizenVerificationRequests: () =>{return axiosInstance.get("/ward/citizen-verifications/")},
//   approveCitizen: (id) =>{return axiosInstance.post(`/ward/approve-citizen/${id}/`)},
//   rejectCitizen: (id, reason) =>{return axiosInstance.post(`/ward/reject-citzen/${id}`, { reason })},
//   citizens: (params) =>{return axiosInstance.get("/ward/citizens/", { params })},
//   citizenDetails: (id) =>{return axiosInstance.get(`/ward/citizen/${id}/details/`)},

// };

// export default wardapi;




import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

const wardapi = {
    dashboard: () => axiosInstance.get("/ward/dashboard/"),

    recentVerifications: () =>
        axiosInstance.get("/ward/recent-citizen-verifications/"),

    getCitizens: (page, search) =>
        axiosInstance.get("/ward/citizens/", {
            params: {
                page,
                ...(search ? { search } : {}),
            },
        }),

    getCitizenDetails: (id) =>
        axiosInstance.get(`/ward/citizen/${id}/full-details/`),

    approveCitizen: (id) =>
        axiosInstance.post(`/ward/approve-citizen/${id}/`),

    rejectCitizen: (id, reason) =>
        axiosInstance.post(`/ward/reject-citizen/${id}/`, { reason }),

    submitWardVerification: (data) => {
        return axiosInstance.post(
            "/ward/submit-verification/",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    profile: () => axiosInstance.get("/ward/profile/"),
    getPanchayathDropdown: () => { return axiosInstance.get("ward/panchayath-dropdown/"); },
    verificationStatus: () => axiosInstance.get("/ward/verification-status/"),
    getverificationList: () => axiosInstance.get("/ward/citizen-verifications/"),
    changePassword: (data) => {
        return axiosInstance.post("/ward/change-password/", data);
    },

    changeEmail: (data) => {
        return axiosInstance.post("/ward/change-email/", data);
    },

    verifyEmailChange: (token) => {
        return axiosInstance.get(`/ward/change-email/verify/${token}/`);
    },
    verifyEmailChange: (token) => {
        return axios.get(`http://127.0.0.1:8000/api/ward/change-email/verify/${token}/`);
    },
    getComplaintDetail: (id) => {
        return axiosInstance.get(`/complaints/${id}/`);
    }

};

export default wardapi;