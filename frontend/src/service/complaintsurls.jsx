import axiosInstance from "@/api/axiosInstance";

const complaintApi = {

  // FEED
  getFeed: () => {return axiosInstance.get("complaints/citizen/complaints/feed/")},

  // CREATE
  createComplaint: (formData) => {
    return axiosInstance.post(
      "complaints/citizen/complaints/create/",
      formData
    );
  },

  // UPVOTE
  toggleUpvote: (id) => {return axiosInstance.post(`complaints/complaints/${id}/upvote/`)},

  // COMMENTS
  getComments: (id) => {return axiosInstance.get(`complaints/complaints/${id}/comments/`)},

  createComment: (id, data) => {
    return axiosInstance.post(
      `complaints/complaints/${id}/comment/`,
      data
    );
  }

};

export default complaintApi;