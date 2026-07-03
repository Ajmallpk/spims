import adminAxios from "@/api/adminAxios";



export const adminapi = {
    login: (email, password) => {
        return adminAxios.post(
            "/admin/login/",
            {
                email: email.trim().toLowerCase(),
                password
            }
        );
    },
    dashboard: () => { return adminAxios.get("/admin/dashboard/") },
    recentVerification: () => { return adminAxios.get("/admin/recent-verifications/") },
    criticalAlert: () => { return adminAxios.get("/admin/critical-alerts/") },
    // panchayathVerificationList: () => { return adminAxios.get("/admin/panchayath-verifications/") },
    panchayathVerificationList: (status = "PENDING") => {
        return adminAxios.get(
            `/admin/panchayath-verifications/?status=${status}`
        );
    },
    approvePanchayath: (id) => { return adminAxios.post(`/admin/panchayath/approve/${id}/`) },
    rejectPanchayath: (id, reason) => { return adminAxios.post(`/admin/panchayath/reject/${id}/`, { reason }) },
    // getPanchayaths: (status, page = 1, search = "") => {return adminAxios.get("/admin/panchayaths/", {params: { status, page, search }});},
    getPanchayaths: (filters) => { return adminAxios.get("/admin/panchayaths/", { params: filters }) },
    suspendPanchayath: (id) => { return adminAxios.post(`/admin/panchayath/suspend/${id}/`) },
    activatePanchayath: (id) => { return adminAxios.post(`/admin/panchayath/activate/${id}/`) },
    getWards: (filters) => {
        return adminAxios.get("/admin/wards/", {
            params: filters
        })
    },
    suspendWard: (id) => { return adminAxios.post(`/admin/ward/suspend/${id}/`) },
    activateWard: (id) => { return adminAxios.post(`/admin/ward/activate/${id}/`) },
    profile: () => { return adminAxios.get("admin/profile/") },
    getVerificationDetail: (id) => { return adminAxios.get(`/admin/panchayath-verifications/${id}/`); },
    getPanchayathDetail: (id) => { return adminAxios.get(`/admin/panchayath/${id}/`); },
    wardDetail: (id) => adminAxios.get(`/admin/wards/${id}/`),
    requestEmailChange: (email) => adminAxios.post("/admin/request-email-change/", { new_email: email }),
    verifyEmailChange: (otp) => adminAxios.post("/admin/verify-email-change/", { otp }),
    changePassword: (data) => adminAxios.post("/admin/change-password/", data),
    getCitizens: (filters) =>
        adminAxios.get("/admin/citizens/", { params: filters }),

    suspendCitizen: (id) =>
        adminAxios.post(`/admin/citizen/suspend/${id}/`),

    activateCitizen: (id) =>
        adminAxios.post(`/admin/citizen/activate/${id}/`),
    citizenDetail: (id) =>
        adminAxios.get(`/admin/citizen/${id}/`),

    complaintDetail: (id) =>
        adminAxios.get(
            `/admin/complaints/${id}/`
        ),

    me: () => adminAxios.get("/admin/auth/me/"),

    getNotifications: (page = 1) => {
        return adminAxios.get(
            `notification/notifications/?page=${page}`
        )
    },

    getUnreadCount: () => {
        return adminAxios.get(
            "notification/notifications/unread-count/"
        )
    },

    markNotificationRead: (id) => {
        return adminAxios.post(
            `notification/notifications/read/${id}/`
        )
    },

    markAllNotificationsRead: () => {
        return adminAxios.post(
            "notification/notifications/read-all/"
        )
    },

    createDistrict: (data) => {
        return adminAxios.post(
            "/admin/locations/create/",
            {
                location_type: "DISTRICT",
                ...data,
            }
        );
    },

    createPanchayath: (data) => {
        return adminAxios.post(
            "/admin/locations/create/",
            {
                location_type: "PANCHAYATH",
                ...data,
            }
        );
    },

    createWard: (data) => {
        return adminAxios.post(
            "/admin/locations/create/",
            {
                location_type: "WARD",
                ...data,
            }
        );
    },

    getLocationDistricts: () => {
        return adminAxios.get(
            "auth/districts/"
        );
    },

    getLocationPanchayaths: (districtId) => {
        return adminAxios.get(
            `auth/panchayaths/?district=${districtId}`
        );
    },


    getLocationRequests: (
        status = "",
        request_type = ""
    ) => {

        return adminAxios.get(
            "/admin/location-requests/",
            {
                params: {
                    status,
                    request_type,
                }
            }
        );

    },

    completeLocationRequest: (id, data) => {
        return adminAxios.post(
            `/admin/location-request/${id}/complete/`,
            data
        );
    },

    holdLocationRequest: (id, data) => {
        return adminAxios.post(
            `/admin/location-request/${id}/hold/`,
            data
        );
    },

    rejectLocationRequest: (id, data) => {
        return adminAxios.post(
            `/admin/location-request/${id}/reject/`,
            data
        );
    },

    getVerificationQueue: () => {
        return adminAxios.get(
            "/admin/verification-queue/"
        );
    },


    getWaitingCitizenDetail: (id) => {
        return adminAxios.get(
            `/admin/verification-queue/citizen/${id}/`
        );
    },

    getWaitingWardDetail: (id) => {
        return adminAxios.get(
            `/admin/verification-queue/ward/${id}/`
        );
    },
}