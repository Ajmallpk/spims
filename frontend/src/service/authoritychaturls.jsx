import axiosInstance from "@/api/axiosInstance";

const authoritychatapi = {

  // GET ALL AUTHORITY CHATS
  getInbox: async () => {
    return await axiosInstance.get("chat/authority/inbox/");
  },

  // GET CHAT MESSAGES
  getMessages: async (chatId,page=1) => {
    return await axiosInstance.get(
      `chat/authority/${chatId}/messages/?page=${page}`
    );
  },

  // SEND MESSAGE
  sendMessage: async (chatId, data) => {

    return await axiosInstance.post(
      `chat/authority/send-message/${chatId}/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

  },


  deleteMessage: async (messageId) => {
    return await axiosInstance.delete(
      `chat/authority/delete-message/${messageId}/`
    );
  },

};

export default authoritychatapi;