import axiosClient from "./axiosClient";

const personApi = {
    getAllPerson: async (params) => {
        const all = params?.all;
        const isDriver = params?.isDriver;
        try {
            return await axiosClient.get(`api/v1/person/list?maxPerPageAll=1${all ? '&all=1' : ''}${isDriver ? '&isDriver=1' : ''}`);
        } catch (error) {
            throw error;
        }
    },
    deletePersonById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/person/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editPersonById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/person/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createPerson: async (data) => {
        try {
            return await axiosClient.post(`api/v1/person/create`, data);
        } catch (error) {
            throw error;
        }
    },
    showPerson: async (id) => {
        try {
            return await axiosClient.get(`api/v1/person/show/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default personApi;
