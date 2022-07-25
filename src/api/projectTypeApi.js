import axiosClient from "./axiosClient";

const projectTypeApi = {
    getAllProjectType: async () => {
        try {
            return await axiosClient.get(`api/v1/projectType/list?maxPerPageAll=1`);
        } catch (error) {
            throw error;
        }
    },
    deleteProjectTypeById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/projectType/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editProjectTypeById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/projectType/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createProjectType: async (data) => {
        try {
            return await axiosClient.post(`api/v1/projectType/create`, data);
        } catch (error) {
            throw error;
        }
    },
    showProjectType: async (id) => {
        try {
            return await axiosClient.get(`api/v1/projectType/show/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default projectTypeApi;
