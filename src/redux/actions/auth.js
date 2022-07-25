import * as types from "./../constants/auth";
export const setDataUser = (dataUser) => {
    return ({
        type: types.SET_DATA_USER,
        dataUser: dataUser,
    });
}
