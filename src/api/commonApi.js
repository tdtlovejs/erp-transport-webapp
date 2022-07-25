import axiosClient from "./axiosClient";

const commonApi = {
    getListAddressProvinces: async () => {
        try {
            return await axiosClient.get('https://tonytran99.github.io/address-vn-api/province.json');
        } catch (error) {
            throw error;
        }
    },
    getListAddressDistricts: async () => {
        try {
            return await axiosClient.get('https://tonytran99.github.io/address-vn-api/district.json');
        } catch (error) {
            throw error;
        }
    },
    getListAddressWardsByDistrict : async (districtUid) => {
        try {
            return await axiosClient.get(`https://tonytran99.github.io/address-vn-api/district/${districtUid}.json`);
        } catch (error) {
            throw error;
        }
    },
    // statis
    showStatis: async () => {
        try {
            return await axiosClient.get(`api/v1/common/statis`);
        } catch (error) {
            throw error;
        }
    },
};

export default commonApi;
