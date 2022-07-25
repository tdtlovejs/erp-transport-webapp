import axiosClient from "./axiosClient";

const addressApi = {
    initVnAddress: async () => {
        try {
            return await axiosClient.get(`api/v1/address/initVnAddress`);
        } catch (error) {
            throw error;
        }
    },
    getListVnProvince: async () => {
        try {
            return await axiosClient.get(`api/v1/address/listVnProvince`);
        } catch (error) {
            throw error;
        }
    },
    getListVnDistrictByProvince: async (province) => {
        try {
            return await axiosClient.get(`api/v1/address/listVnDistrictByProvince?province=${province}`);
        } catch (error) {
            throw error;
        }
    },
    getListVnWardByDistrict: async (district) => {
        try {
            return await axiosClient.get(`api/v1/address/listVnWardByDistrict?district=${district}`);
        } catch (error) {
            throw error;
        }
    },
};

export default addressApi;
