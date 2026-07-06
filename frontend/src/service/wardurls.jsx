// import wardAxios from "@/api/wardAxios";

// const wardapi = {
//   profile: () => wardAxios.get("/ward/profile/"),
//   verificationStatus: () => {return wardAxios.get("/ward/verification-status/")},
//   submitVerification: (formData) => {return wardAxios.post("/ward/submit-verification/", formData, {headers: { "Content-Type": "multipart/form-data" },})},
//   dashboard: () => {return wardAxios.get("/ward/dashboard/")},
//   citizenVerificationRequests: () =>{return wardAxios.get("/ward/citizen-verifications/")},
//   approveCitizen: (id) =>{return wardAxios.post(`/ward/approve-citizen/${id}/`)},
//   rejectCitizen: (id, reason) =>{return wardAxios.post(`/ward/reject-citzen/${id}`, { reason })},
//   citizens: (params) =>{return wardAxios.get("/ward/citizens/", { params })},
//   citizenDetails: (id) =>{return wardAxios.get(`/ward/citizen/${id}/details/`)},

// };

// export default wardapi;






import wardAxios from "@/api/wardAxios";

const wardapi = {
    dashboard: () => wardAxios.get("/ward/dashboard/"),

    recentVerifications: () =>
        wardAxios.get("/ward/recent-citizen-verifications/"),

    getCitizens: (page, search) =>
        wardAxios.get("/ward/citizens/", {
            params: {
                page,
                ...(search ? { search } : {}),
            },
        }),

    getCitizenDetails: (id, page = 1) =>
        wardAxios.get(`/ward/citizen/${id}/full-details/?page=${page}`),

    approveCitizen: (id) =>
        wardAxios.post(`/ward/approve-citizen/${id}/`),

    rejectCitizen: (id, reason) =>
        wardAxios.post(`/ward/reject-citizen/${id}/`, { reason }),

    submitWardVerification: (data) => {
        return wardAxios.post(
            "/ward/submit-verification/",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    profile: () => wardAxios.get("/ward/profile/"),
    getPanchayathDropdown: () => { return wardAxios.get("ward/panchayath-dropdown/"); },
    verificationStatus: () => wardAxios.get("/ward/verification-status/"),
    getverificationList: (status) =>
        wardAxios.get(
            "/ward/citizen-verifications/",
            {
                params: { status }
            }
        ),
    changePassword: (data) => {
        return wardAxios.post("/ward/change-password/", data);
    },

    changeEmail: (data) => {
        return wardAxios.post("/ward/change-email/", data);
    },

    verifyEmailChange: (token) => {
        return wardAxios.get(`/ward/change-email/verify/${token}/`);
    },
    verifyEmailChange: (token) => {
        return axios.get(`http://127.0.0.1:8000/api/ward/change-email/verify/${token}/`);
    },
    // getComplaintDetail: (id) => {
    //     return wardAxios.get(`/complaints/${id}/`);
    // },

    getComplaintDetail: (id) => {
        return wardAxios.get(`/ward/complaint/${id}/details/`);
    },

    getComplaints: (params) => {
        return wardAxios.get("/ward/complaints/", { params });
    },

    escalateComplaint: (complaintId, data) => {
        return wardAxios.post(
            `/ward/complaint/${complaintId}/escalate/`,
            data
        );
    },

    holdComplaint: (complaintId, data) => {
        return wardAxios.post(
            `/ward/complaint/${complaintId}/hold/`,
            data
        );
    },


    getReassignedComplaints: (params) => {
        return wardAxios.get("/ward/reassigned-complaints/", { params });
    },

    getReassignedComplaintDetail: (id) => {
        return wardAxios.get(`/ward/reassigned-complaints/${id}/`);
    },

    resolveReassignedComplaint: (id, formData) => {
        return wardAxios.post(
            `/ward/resolve-complaint/${id}/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },


    getNotifications: (page = 1) => {
        return wardAxios.get(
            `/notification/notifications/?page=${page}`
        )
    },

    getUnreadCount: () => {
        return wardAxios.get(
            "/notification/notifications/unread-count/"
        )
    },

    markNotificationRead: (id) => {
        return wardAxios.post(
            `/notification/notifications/read/${id}/`
        )
    },

    markAllNotificationsRead: () => {
        return wardAxios.post(
            "/notification/notifications/read-all/"
        )
    },

    me: () => {
        return wardAxios.get("/ward/auth/me/");
    },

    getDistricts: () => {
        return wardAxios.get("/auth/districts/");
    },

    getPanchayaths: (districtId) => {
        return wardAxios.get(
            `/auth/panchayaths/?district=${districtId}`
        );
    },

    getWards: (panchayathId) => {
        return wardAxios.get(
            `/auth/wards/?panchayath=${panchayathId}`
        );
    },

    createLocationRequest: (data) => {
        return wardAxios.post(
            "/auth/location-request/",
            data
        );
    },


    resumeComplaint: (id) => {
        return wardAxios.post(
            `/ward/complaint/${id}/resume/`
        );
    },

};

export default wardapi;