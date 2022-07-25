import axiosClient from "./axiosClient";

const equipmentTypeApi = {
  getAllEquipmentType: async () => {
    try {
        return await axiosClient.get(`api/v1/equipmentType/list?maxPerPageAll=1`);
    } catch (error) {
      throw error;
    }
  },
  deleteEquipmentTypeById: async (id) => {
    try {
        return await axiosClient.delete(`api/v1/equipmentType/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
  editEquipmentTypeById: async (id, data) => {
    try {
        return await axiosClient.patch(`api/v1/equipmentType/edit/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  createEquipmentType: async (data) => {
    try {
        return await axiosClient.post(`api/v1/equipmentType/create`, data);
    } catch (error) {
      throw error;
    }
  },
  showEquipmentType: async (id) => {
    try {
        return await axiosClient.get(`api/v1/equipmentType/show/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default equipmentTypeApi;
