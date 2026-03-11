// import axiosInstance from "@/api/axiosInstance";

// const complaintapi = {

//   // Complaint feed
//   getComplaintFeed: () => {
//     return axiosInstance.get("/complaints/feed/");
//   },

//   // Citizen complaints
//   getMyComplaints: () => {
//     return axiosInstance.get("/complaints/my/");
//   },

//   // Create complaint
//   createComplaint: (formData) => {
//     return axiosInstance.post(
//       "/complaints/create/",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//   },

//   // Upvote complaint
//   toggleUpvote: (complaintId) => {
//     return axiosInstance.post(`complaints/${complaintId}/upvote/`);
//   },

//   // Comments
//   getComments: (complaintId) => {
//     return axiosInstance.get(`complaints/${complaintId}/comments/`);
//   },

//   createComment: (complaintId, data) => {
//     return axiosInstance.post(`complaints/${complaintId}/comment/`, data);
//   },

//   // Complaint detail
//   getComplaintDetail: (complaintId) => {
//     return axiosInstance.get(`complaints/${complaintId}/`);
//   },

//   // Chat
//   getChatMessages: (complaintId) => {
//     return axiosInstance.get(`complaints/${complaintId}/chat/`);
//   },

//   sendChatMessage: (complaintId, data) => {
//     return axiosInstance.post(`complaints/${complaintId}/chat/send/`, data);
//   },

//   // Inbox
//   getCitizenInbox: () => {
//     return axiosInstance.get("citizen/messages/");
//   },

//   // Notifications
//   getNotifications: () => {
//     return axiosInstance.get("citizen/notifications/");
//   },

//   markNotificationRead: (notificationId) => {
//     return axiosInstance.post(`notifications/${notificationId}/read/`);
//   },

// };

// export default complaintapi;














import axiosInstance from "@/api/axiosInstance";

const complaintapi = {

  // Complaint feed
  getComplaintFeed: () => {
    return axiosInstance.get("/complaints/feed/");
  },

  // My complaints
  getMyComplaints: () => {
    return axiosInstance.get("/complaints/my/");
  },

  // Create complaint
  createComplaint: (formData) => {
    return axiosInstance.post(
      "/complaints/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Upvote
  toggleUpvote: (complaintId) => {
    return axiosInstance.post(`/complaints/${complaintId}/upvote/`);
  },

  // Comments
  getComments: (complaintId) => {
    return axiosInstance.get(`/complaints/${complaintId}/comments/`);
  },

  createComment: (complaintId, data) => {
    return axiosInstance.post(`/complaints/${complaintId}/comment/`, data);
  },

  // Complaint detail
  getComplaintDetail: (complaintId) => {
    return axiosInstance.get(`/complaints/${complaintId}/`);
  },

  // Chat
  getChatMessages: (complaintId) => {
    return axiosInstance.get(`/complaints/${complaintId}/chat/`);
  },

  sendChatMessage: (complaintId, data) => {
    return axiosInstance.post(`/complaints/${complaintId}/chat/send/`, data);
  },

  // Inbox
  getCitizenInbox: () => {
    return axiosInstance.get("/complaints/messages/");
  },

  // Notifications
  getNotifications: () => {
    return axiosInstance.get("/complaints/notifications/");
  },

  markNotificationRead: (notificationId) => {
    return axiosInstance.post(`/complaints/notifications/${notificationId}/read/`);
  },

};

export default complaintapi;