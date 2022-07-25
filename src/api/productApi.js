import axiosClient from "./axiosClient";

const productApi = {
  getAllProduct: async () => {
    try {
        return await axiosClient.get(`api/v1/product/list?maxPerPageAll=1`);
    } catch (error) {
      throw error;
    }
  },
  deleteProductById: async (id) => {
    try {
        return await axiosClient.delete(`api/v1/product/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
  editProductById: async (id, data) => {
    try {
        return await axiosClient.patch(`api/v1/product/edit/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  createProduct: async (data) => {
    try {
        return await axiosClient.post(`api/v1/product/create`, data);
    } catch (error) {
      throw error;
    }
  },
  showProduct: async (id) => {
    try {
        return await axiosClient.get(`api/v1/product/show/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default productApi;
