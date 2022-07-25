import axiosClient from "./axiosClient";

const gpsRouteApi = {
    getCurrentRoute: async () => {
        try {
            return await axiosClient.get(`api/v1/gpsRoute/show-current`);
        } catch (error) {
            throw error;
        }
    },
    getAllRoute: async () => {
        try {
            return await axiosClient.get(`api/v1/gpsRoute/list?maxPerPageAll=1`);
        } catch (error) {
            throw error;
        }
    },
    deleteRouteById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/gpsRoute/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editRouteById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/gpsRoute/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createRoute: async (data) => {
        try {
            return await axiosClient.post(`api/v1/gpsRoute/create`, data);
        } catch (error) {
            throw error;
        }
    },
    showRoute: async (id) => {
        try {
            return await axiosClient.get(`api/v1/gpsRoute/show/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default gpsRouteApi;
