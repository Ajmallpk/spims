import axiosInstance from "@/api/axiosInstance";


export const adminapi = {
    login: (email, password) => { return axiosInstance.post("/admin/login/", { email: email.trim().toLowerCase(), password }); },
    dashboard: () => { return axiosInstance.get("/admin/dashboard/") },
    recentVerification: () => { return axiosInstance.get("/admin/recent-verifications/") },
    criticalAlert: () => { return axiosInstance.get("/admin/critical-alerts/") },
    panchayathVerificationList: () => { return axiosInstance.get("/admin/panchayath-verifications/") },
    approvePanchayath: (id) => { return axiosInstance.post(`/admin/panchayath/approve/${id}/`) },
    rejectPanchayath: (id, reason) => { return axiosInstance.post(`/admin/panchayath/reject/${id}/`, { reason }) },
    // getPanchayaths: (status, page = 1, search = "") => {return axiosInstance.get("/admin/panchayaths/", {params: { status, page, search }});},
    getPanchayaths: (filters) => { return axiosInstance.get("/admin/panchayaths/", { params: filters }) },
    suspendPanchayath: (id) => { return axiosInstance.post(`/admin/panchayath/suspend/${id}/`) },
    activatePanchayath: (id) => { return axiosInstance.post(`/admin/panchayath/activate/${id}/`) },
    getWards: (filters) => {
        return axiosInstance.get("/admin/wards/", {
            params: filters
        })
    },
    suspendWard: (id) => { return axiosInstance.post(`/admin/ward/suspend/${id}/`) },
    activateWard: (id) => { return axiosInstance.post(`/admin/ward/activate/${id}/`) },
    profile: () => { return axiosInstance.get("admin/profile/") },
    getVerificationDetail: (id) => { return axiosInstance.get(`/admin/panchayath-verifications/${id}/`); },
    getPanchayathDetail: (id) => { return axiosInstance.get(`/admin/panchayath/${id}/`); },
    wardDetail: (id) => axiosInstance.get(`/admin/wards/${id}/`),
    requestEmailChange: (email) => axiosInstance.post("/admin/request-email-change/", { new_email: email }),
    verifyEmailChange: (otp) => axiosInstance.post("/admin/verify-email-change/", { otp }),
    changePassword: (data) => axiosInstance.post("/admin/change-password/", data),
    getCitizens: (filters) =>
        axiosInstance.get("/admin/citizens/", { params: filters }),

    suspendCitizen: (id) =>
        axiosInstance.post(`/admin/citizen/suspend/${id}/`),

    activateCitizen: (id) =>
        axiosInstance.post(`/admin/citizen/activate/${id}/`),
    citizenDetail: (id) =>
        axiosInstance.get(`/admin/citizen/${id}/`),
}