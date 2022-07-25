import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import * as links from "./constants/links";
import {
    DATA_USER,
} from "./constants/constants";
import * as authActions from "./redux/actions/auth";

const PrivateRoute = ({component: Component, ...rest}) => {
    let checkLogin = false;
    let dataUserLocal = localStorage.getItem(DATA_USER);
    if (dataUserLocal !== null) {
        dataUserLocal = JSON.parse(dataUserLocal)
        if (
            dataUserLocal
        ) {
            checkLogin = true;
        } else {
            rest.setDataUser(null);
        }
    } else {
        rest.setDataUser(null);
    }
    return (
        <Route {...rest} match render={props => {
            if (checkLogin === true){
                return <Component {...props} history={rest.history} />;
            } else {
              return <Redirect to={links.LOGIN}/>;
            }
        }} />
    );
};
const mapStateToProps = (state, props) => {
    return {
        dataUser: state.authReducer.dataUser,
        groupPrev: state.authReducer.groupPrev
    }
};
const mapDispatchToProps = (dispatch)=>{
    return {
        setDataUser: (dataUser) => dispatch(authActions.setDataUser(dataUser))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);

