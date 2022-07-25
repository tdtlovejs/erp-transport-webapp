import axiosClient from "./axiosClient";

const equipmentApi = {
  getAllEquipment: async () => {
    try {
        return await axiosClient.get(`api/v1/equipment/list?maxPerPageAll=1`);
    } catch (error) {
      throw error;
    }
  },
  deleteEquipmentById: async (id) => {
    try {
        return await axiosClient.delete(`api/v1/equipment/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
  editEquipmentById: async (id, data) => {
    try {
        return await axiosClient.patch(`api/v1/equipment/edit/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  createEquipment: async (data) => {
    try {
        return await axiosClient.post(`api/v1/equipment/create`, data);
    } catch (error) {
      throw error;
    }
  },
  showEquipment: async (id) => {
    try {
        return await axiosClient.get(`api/v1/equipment/show/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default equipmentApi;
