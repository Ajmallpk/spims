import axiosInstance from "@/api/axiosInstance";


export const adminapi = {
    
    getBlockVerifications: () =>axiosInstance.get("admin/block-verifications/"),
    handleapprove :(id)=> axiosInstance.post(`admin/block-approve/${id}/`),
    handlereject :(id,reason) => axiosInstance.post(`admin/block-reject/${id}/`,{
        reason:reason
    }),
    getBlocks :()=> axiosInstance.get("admin/blocks/"),
    suspendBlock:(id)=> axiosInstance.post("admin/block-suspend/"),
    activateBlock:(id)=> axiosInstance.post("admin/block-activate"),
}