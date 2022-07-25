import axiosClient from "./axiosClient";

const vehicleApi = {
    getAllVehicle: async (params) => {
      const showLastPoint = params?.showLastPoint
        try {
            return await axiosClient.get(`api/v1/vehicle/list?maxPerPageAll=1${showLastPoint ? "&showLastPoint=1": ""}`);
        } catch (error) {
            throw error;
        }
    },
    deleteVehicleById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/vehicle/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editVehicleById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/vehicle/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createVehicle: async (data) => {
        try {
            return await axiosClient.post(`api/v1/vehicle/create`, data);
        } catch (error) {
            throw error;
        }
    },
    showVehicle: async (id) => {
        try {
            return await axiosClient.get(`api/v1/vehicle/show/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default vehicleApi;
