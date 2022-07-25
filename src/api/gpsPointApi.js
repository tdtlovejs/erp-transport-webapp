import axiosClient from "./axiosClient";

const gpsPointApi = {
    getAllGpsPoint: async (params) => {
        try {
            const {
                gpsRouteId
            } = params;
            return await axiosClient.get(`api/v1/gpsPoint/list?maxPerPageAll=1&${gpsRouteId ? "&gpsRouteId=" + gpsRouteId : ""}`);
        } catch (error) {
            throw error;
        }
    },
    deleteGpsPointById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/gpsPoint/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editGpsPointById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/gpsPoint/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createGpsPoint: async (data) => {
        try {
            return await axiosClient.post(`api/v1/gpsPoint/create`, data);
        } catch (error) {
            throw error;
        }
    },
    showGpsPoint: async (id) => {
        try {
            return await axiosClient.get(`api/v1/gpsPoint/show/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default gpsPointApi;
