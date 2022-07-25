import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from "react-redux";
import * as links from "./constants/links"
import axios from "axios";
import {DATA_USER} from "./constants/constants";
import * as authActions from "./redux/actions/auth";

const PublicRoute = ({component: Component, ...rest}) => {
    let checkLogin = false;
    let dataUser = localStorage.getItem(DATA_USER);
    if (dataUser !== null) {
        dataUser = JSON.parse(dataUser);
        try {
            checkLogin = true;
        } catch (e) {
            rest.setDataUser(null);
        }
    } else {
        rest.setDataUser(null);
    }
    return (
        <Route {...rest} render={props => {
            if (checkLogin === false) {
                return <Component {...props} />;
            } else {
                return <Redirect to={links.HOME}/>;
            }
        }}/>
    );
}

const mapStateToProps = (state, props) => {
    return {
        dataUser: state.authReducer.dataUser,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        setDataUser: (dataUser) => dispatch(authActions.setDataUser(dataUser))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(PublicRoute);
