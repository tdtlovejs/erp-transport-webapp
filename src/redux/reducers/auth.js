import * as types from "../constants/auth";
import {DATA_USER, TOKEN} from "../../constants/constants";

let dataUser = null;
if (localStorage.getItem(DATA_USER) !== null) {
    try {
        if (JSON.parse(localStorage.getItem(DATA_USER)).token) {
            dataUser = JSON.parse(localStorage.getItem(DATA_USER));
        } else {
            localStorage.removeItem(DATA_USER);
            localStorage.removeItem(TOKEN);
        }
    } catch(e) {
        localStorage.removeItem(DATA_USER);
        localStorage.removeItem(TOKEN);
    }
}
const initialState = {
    isShow: false,
    dataUser: dataUser
};

export default function auth(state = initialState, action) {
    switch (action?.type) {
        case types.SET_DATA_USER:
            if (action.dataUser !== null && action.dataUser.token) {
                localStorage.setItem(DATA_USER, JSON.stringify(action.dataUser));
                localStorage.setItem(TOKEN, action.dataUser?.token);
            } else {
                localStorage.removeItem(DATA_USER);
                localStorage.removeItem(TOKEN);
            }
            return {
                ...state,
                dataUser: action.dataUser
            }
        default:
            return state;
    }
}
