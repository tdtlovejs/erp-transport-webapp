import React from 'react';
import {createContext, useEffect, useState} from 'react';
import {DATA_USER} from "../constants/constants";



export const AppContext = createContext({})

const AppContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     getUserFromLocalStorage();
    // }, [])
    // const getUserFromLocalStorage = () => {
    //     try {
    //         const result = localStorage.getItem(DATA_USER)
    //         setUser(JSON.parse(result));
    //         setLoadingUser(true);
    //     } catch (e) {
    //         setLoadingUser(true);
    //     }
    // }
    // const saveUserToLocalStorage = (user) => {
    //   if (user) {
    //     localStorage.setItem(DATA_USER, JSON.stringify(user))
    //   } else {
    //     localStorage.removeItem(DATA_USER)
    //   }
    // }
    //
    // useEffect(() => {
    //     saveUserToLocalStorage(user);
    // }, [user])

    const appContextData = {
        // user,
        // setUser,
        loadingUser,
        setLoadingUser,
        loading,
        setLoading
    }
    return (
        <AppContext.Provider value={appContextData}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
