
import panchayathAxios from "@/api/panchayathAxios";


const panchayathApi = {

  dashboard: () => { return panchayathAxios.get("/panchayath/dashboard/"); },
  profile: () => { return panchayathAxios.get("/panchayath/profile/"); },
  verificationStatus: () => { return panchayathAxios.get("/panchayath/verification-status/"); },
  wardVerifications: () => { return panchayathAxios.get("/panchayath/ward-verifications/"); },
  submitVerification: (formData) => { return panchayathAxios.post("/panchayath/submit-verification/", formData, { headers: { "Content-Type": "multipart/form-data", }, }); },
  approveWard: (id) => { return panchayathAxios.post(`/panchayath/approve-ward/${id}/`); },
  rejectWard: (id, reason) => { return panchayathAxios.post(`/panchayath/reject-ward/${id}/`, { reason: reason }) },
  listWard: (params) => panchayathAxios.get("/panchayath/wards/", { params }),
  wardDetail: (id) => { return panchayathAxios.get(`/panchayath/ward/${id}/`) },
  handleAuthError: (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/login";
    }
  },

  changePassword: (data) => {
    return panchayathAxios.post("/panchayath/change-password/", data)
  },

  requestEmailChange: (data) => {
    return panchayathAxios.post("/panchayath/request-email-change/", data)
  },

  verifyEmailChange: (token) => {
    return panchayathAxios.post(`/panchayath/confirm-email-change/${token}/`)
  },


  getEscalatedComplaints: (params) => {
    return panchayathAxios.get("/panchayath/complaints/", { params });
  },

  getComplaintDetail: (id) => {
    return panchayathAxios.get(`/panchayath/complaints/${id}/`)
  },

  startWork: (id) =>
    panchayathAxios.post(`/panchayath/complaints/${id}/`, {
      action: "START_WORK"
    }),


  resolveComplaint: (id, formData) => {
    return panchayathAxios.post(
      `/panchayath/complaints/${id}/resolve/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  reassignComplaint: (id, data) => {
    return panchayathAxios.post(
      `/panchayath/complaints/${id}/reassign/`,
      data
    );
  },


  getNotifications: (page = 1) => {

    return panchayathAxios.get(

      `/notification/notifications/?page=${page}`

    )

  },

  getUnreadCount: () => {

    return panchayathAxios.get(

      "/notification/notifications/unread-count/"

    )

  },

  markNotificationRead: (id) => {

    return panchayathAxios.post(

      `/notification/notifications/read/${id}/`

    )

  },

  markAllNotificationsRead: () => {

    return panchayathAxios.post(

      "/notification/notifications/read-all/"

    )

  },


  me: () => {
    return panchayathAxios.get(
      "/panchayath/auth/me/"
    )
  },

  wardComplaints: (id) => {
    return panchayathAxios.get(
      `/panchayath/ward/${id}/complaints/`
    )
  },



  getComplaintFullDetail: (id) => {
    return panchayathAxios.get(
      `/panchayath/complaint/${id}/full-details/`
    )
  },

};


export default panchayathApi;