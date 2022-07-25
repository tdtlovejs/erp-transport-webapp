import React, {Suspense, useEffect} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
import {compose} from "redux";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import axios from "axios";
import PrivateRoute from "./PrivateRoute";
import * as links from "./constants/links";
import arrayRoutesPrivate from "./constants/routesPrivate";
import Page404 from "./theme/PageError/Page404";
import LayoutMenu from "./modules/Layout/LayoutMenu";


const styles = {
    mainContent: {
        // background: '#f8f8ff',
        height: 'calc(100% - 50px)',
        padding: '0 1.875rem 1rem',
        overflow: 'auto',
        '&$adminContent': {
            // height: '100vh'
        },
        '&.notLogin': {
            height: 0,
            padding: 0
        },
        '&.pageError': {
            height: 0
        }
    },
    adminContent: {}
};

const RoutesMap = (props) => {
    const {
        isPublicRoute
    } = props;
    const {
        dataUser
    } = useSelector(state => state.authReducer);
    const dispatch = useDispatch();
    if (!dataUser) {
        if (isPublicRoute) {
            return (
                <></>
            )
        }
        return <Redirect to={links.LOGIN}/>
    }

    const role = dataUser?.data?.role;
    const routesMap = arrayRoutesPrivate.filter((route) => {
        return dataUser?.data?.role && (!route.permission || route.permission.length < 1 || (route.permission.length > 0 && route.permission.includes(role)));
    }).map((route, index) => {
        const component = route.component;
        return <PrivateRoute
            key={index}
            path={route.path}
            exact={route.exact}
            component={component}
            // history={history}
        />
    });


    return (
        <LayoutMenu>
            <Suspense fallback={<div>Loading</div>}>
                <Switch>
                    {routesMap && routesMap.length > 0 ? routesMap : ""}
                    <Route exact={true} path="*" component={Page404}/>
                </Switch>
            </Suspense>
        </LayoutMenu>
    );
}

RoutesMap.propTypes = {
    classes: PropTypes.object.isRequired
};


export default compose(withRouter)(RoutesMap);
