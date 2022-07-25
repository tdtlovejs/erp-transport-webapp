import * as links from "./links";
import React from "react";
import Login from "../modules/Login/Login";
import ForgotPassword from "../modules/Auth/ForgotPassword";
import EmployeeForm from "../modules/Employee/EmployeeForm";
import ResetPassword from "../modules/Auth/ResetPassword";

const arrayRoutesPublic = [
    {
        path: links.LOGIN,
        component: () => <Login />,
        exact: false,
    },
    {
        path: links.FORGOT_PASSWORD,
        component: () => <ForgotPassword />,
        exact: false,
    },
    {
        path: links.RESET_PASSWORD,
        component: (match) => <ResetPassword match={match} />,
        exact: false,
    },
];

export default arrayRoutesPublic;
