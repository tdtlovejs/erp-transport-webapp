import axios from 'axios';

import {BASE_API, DATA_USER, TOKEN} from "../constants/constants";
import {notifFailure} from "../theme/Notification";
import {notification} from "antd";
import i18n from "i18next";
import * as links from "../constants/links"
const axiosClient = axios.create({
    baseURL: BASE_API,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
    },
});

axiosClient.interceptors.request.use(async (config) => {
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
        language: i18n.language
    };
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            console.log(error.response.status);
            localStorage.removeItem(DATA_USER);
            localStorage.removeItem(TOKEN);
            window.location.href = links.LOGIN
        }
        const response = error.response;
        const message = (Array.isArray(response?.data?.message) && response?.data?.message.length > 0)
            ? response?.data?.message[0]
            :
            response?.data?.message
                ?
                response?.data?.message
                :
                response?.data
                    ?
                    response?.data
                    :
                    null
        if (message) {
            notification.error({
                message: '',
                description: message,
                duration: 4,
            });
        }
        return response;
    },
);

export default axiosClient;
