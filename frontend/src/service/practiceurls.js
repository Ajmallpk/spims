import axiosInstance from "@/api/axiosInstance";

const practiceApi = {
  getDeployment: () => {
    return axiosInstance.get("/practice/deployment/");
  },
};

export default practiceApi;