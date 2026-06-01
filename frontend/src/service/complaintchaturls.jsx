import axiosInstance from "@/api/axiosInstance";



export const complaintchatapi = {

    getInbox() {
        return axiosInstance.get(
            "/chat/complaint/inbox/"
        );
    },

    getMessages(complaintId,page = 1) {
        return axiosInstance.get(
            `/chat/complaint/${complaintId}/messages/?page=${page}`
        );
    },

    startChat(complaintId) {
        return axiosInstance.post(
            `/chat/complaint/${complaintId}/start/`
        );
    },

    sendMessage(complaintId, data) {
        return axiosInstance.post(
            `/chat/complaint/${complaintId}/send/`,
            data
        );
    },

    toggleChat(complaintId) {
        return axiosInstance.post(
            `/chat/complaint/${complaintId}/toggle/`
        );
    },



    deleteMessage(messageId) {
        return axiosInstance.post(
            `chat/complaint/delete-message/${messageId}/`
        );
    }

};

