import axiosClient from "./axiosClient";

const projectApi = {
    getAllProject: async () => {
        try {
            return await axiosClient.get(`api/v1/project/list?maxPerPageAll=1`);
        } catch (error) {
            throw error;
        }
    },
  deleteProjectById: async (id) => {
    try {
        return await axiosClient.delete(`api/v1/project/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
  editProjectById: async (id, data) => {
    try {
        return await axiosClient.patch(`api/v1/project/edit/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  createProject: async (data) => {
    try {
        return await axiosClient.post(`api/v1/project/create`, data);
    } catch (error) {
      throw error;
    }
  },
  showProject: async (id) => {
    try {
        return await axiosClient.get(`api/v1/project/show/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default projectApi;
