import citizenAxios from "@/api/citizenAxios";



const citizenapi = {

  // AUTH
  // login: (data) => { return citizenAxios.post("auth/login/citizen/") },
  register: (data) => { return citizenAxios.post("/auth/signup/citizen/", data); },
  verifyOTP: (data) => { return citizenAxios.post("auth/verify-otp/", data); },
  // resendOTP: (data) => { return citizenAxios.post("auth/resend-otp/", data); },
  login: (data) => { return citizenAxios.post("auth/login/citizen/", data) },
  logout: () => {
    return citizenAxios.post("auth/logout/");
  },
  resendOTP: (data) => { return citizenAxios.post("auth/resend-otp/", data) },
  getProfile: () => { return citizenAxios.get("citizen/profile/") },
  updateProfile: (data) => { return citizenAxios.patch("citizen/profile/update/", data) },
  // submitVerification: (formData) => {
  //   return citizenAxios.post("citizen/verification/submit/", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data"
  //     }
  //   });
  // },
  getVerificationStatus: () => { return citizenAxios.get("citizen/verification/status/") },
  submitVerification: (formData) => {
    return citizenAxios.post("citizen/verification/submit/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadAvatar: (formData) => {
    return citizenAxios.post("citizen/upload-avatar/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getWards: () => {
    return citizenAxios.get("citizen/wards/");
  },

  changePassword: (data) => {
    return citizenAxios.post("citizen/change-password/", data);
  },

  changeEmail: (data) => {
    return citizenAxios.post("citizen/change-email/", data);
  },

  verifyEmailChange: (token) => {
    return citizenAxios.get(`/citizen/change-email/verify/${token}/`);
  },

  forgotPassword: (data) => {
    return citizenAxios.post("auth/forgot-password/", data);
  },

  verifyResetOtp: (data) => {
    return citizenAxios.post("auth/verify-reset-otp/", data);
  },

  resetPassword: (data) => {
    return citizenAxios.post("auth/reset-password/", data);
  },

  getNotifications: (page = 1) => {
    return citizenAxios.get(
      `notification/notifications/?page=${page}`
    )
  },

  getUnreadCount: () => {
    return citizenAxios.get(
      "notification/notifications/unread-count/"
    )
  },

  markNotificationRead: (id) => {
    return citizenAxios.post(
      `notification/notifications/read/${id}/`
    )
  },

  markAllNotificationsRead: () => {
    return citizenAxios.post(
      "notification/notifications/read-all/"
    )
  },


  // COMPLAINTS

  getComplaints: () => {
    return citizenAxios.get(
      "citizen/complaints/"
    );
  },

  getComplaintDetail: (id) => {
    return citizenAxios.get(
      `complaints/${id}/`
    );
  },


  getComplaintTimeline: (id) => {
    return citizenAxios.get(
      `complaints/complaint/${id}/timeline/`
    );
  },


  me: () => {
    return citizenAxios.get("/auth/me/");
  },


};

export default citizenapi;