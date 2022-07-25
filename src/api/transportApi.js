import axiosClient from "./axiosClient";

const transportApi = {
    getAllTransport: async (params) => {
        try {
            const {
                status
            } = params
            return await axiosClient.get(`api/v1/transportOrder/list?maxPerPageAll=1${status ? "&status="+status : ""}`);
        } catch (error) {
            throw error;
        }
    },
    deleteTransportById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/transportOrder/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editTransportById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/transportOrder/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createTransport: async (data) => {
        try {
            return await axiosClient.post(`api/v1/transportOrder/create`, data);
        } catch (error) {
            throw error;
        }
    },
    changeStatusTransportById: async (id, data) => {
        try {
            return await axiosClient.post(`api/v1/transportOrder/change-status/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createInvoiceById: async (id) => {
        try {
            return await axiosClient.get(`api/v1/transportOrder/create-invoice/${id}`);
        } catch (error) {
            throw error;
        }
    },
    showTransport: async (id) => {
        try {
            return await axiosClient.get(`api/v1/transportOrder/show/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default transportApi;
