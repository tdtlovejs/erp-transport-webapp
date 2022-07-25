import axiosClient from "./axiosClient";

const clientApi = {
  getAllClient: async () => {
    try {
        return await axiosClient.get(`api/v1/client/list?maxPerPageAll=1`);
    } catch (error) {
      throw error;
    }
  },
  deleteClientById: async (id) => {
    try {
        return await axiosClient.delete(`api/v1/client/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
  editClientById: async (id, data) => {
    try {
        return await axiosClient.patch(`api/v1/client/edit/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  createClient: async (data) => {
    try {
        return await axiosClient.post(`api/v1/client/create`, data);
    } catch (error) {
      throw error;
    }
  },
  showClient: async (id) => {
    try {
        return await axiosClient.get(`api/v1/client/show/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default clientApi;
