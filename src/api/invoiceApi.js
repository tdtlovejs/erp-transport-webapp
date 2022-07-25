import axiosClient from "./axiosClient";

const invoiceApi = {
    getAllInvoice: async () => {
        try {
            return await axiosClient.get(`api/v1/invoice/list?maxPerPageAll=1`);
        } catch (error) {
            throw error;
        }
    },
    deleteInvoiceById: async (id) => {
        try {
            return await axiosClient.delete(`api/v1/invoice/delete/${id}`);
        } catch (error) {
            throw error;
        }
    },
    editInvoiceById: async (id, data) => {
        try {
            return await axiosClient.patch(`api/v1/invoice/edit/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    changeStatusInvoiceById: async (id, data) => {
        try {
            return await axiosClient.post(`api/v1/invoice/change-status/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    exportPdfInvoiceById: async (id) => {
        try {
            return await axiosClient.get(`api/v1/invoice/export-pdf/${id}`);
        } catch (error) {
            throw error;
        }
    },
    createInvoice: async (data) => {
        try {
            return await axiosClient.post(`api/v1/invoice/create`, data);
        } catch (error) {
            throw error;
        }
    },
    showInvoice: async (id) => {
        try {
            return await axiosClient.get(`api/v1/invoice/show/${id}`);
        } catch (error) {
            throw error;
        }
    },
    getTotalAmountByYear: async (year) => {
        try {
            return await axiosClient.get(`api/v1/invoice/total-amount-by-year?year=${year}`);
        } catch (error) {
            throw error;
        }
    },
    sendPdfToClient: async (id) => {
        try {
            return await axiosClient.get(`api/v1/invoice/send-pdf-to-client/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default invoiceApi;
