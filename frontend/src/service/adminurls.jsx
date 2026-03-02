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
    suspendPanchayath: (id) => { return axiosInstance.post(`admin/panchayath/suspend/${id}/`) },
    activatePanchayath: (id) => { return axiosInstance.post(`admin/panchayath/activate/${id}/`) },
    getWards: (status, page, search, panchayath) => { return axiosInstance.get("admin/wards/", { params: { status, page, search, panchayath }, }) },
    suspendWard: (id) =>{return axiosInstance.post(`admin/ward/suspend/${id}/`)},
    activateWard: (id) =>{return axiosInstance.post(`admin/ward/activate/${id}/`)},
    profile:()=>{return axiosInstance.get("admin/profile/")},
    getVerificationDetail: (id) => {return axiosInstance.get(`/admin/panchayath-verifications/${id}/`);},
    getPanchayathDetail: (id) => {return axiosInstance.get(`/admin/panchayath/${id}/`);},
}