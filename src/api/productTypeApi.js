import axiosClient from "./axiosClient";

const productTypeApi = {
    getAllProductType: async () => {
        try {
            return await axiosClient.get(`api/v1/productType/list?maxPerPageAll=1`);
        } catch (error) {
            throw error;
        }
    },
    deleteProductTypeById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/productType/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editProductTypeById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/productType/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    createProductType: async (data) => {
        try {
            return await axiosClient.post(`api/v1/productType/create`, data);
        } catch (error) {
            throw error;
        }
    },
    showProductType: async (id) => {
        try {
            return await axiosClient.get(`api/v1/productType/show/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default productTypeApi;
