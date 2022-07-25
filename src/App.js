import React, {Suspense, useContext} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {compose} from "redux";
import arrayRoutesPublic from "./constants/routePublic";
import PublicRoute from "./PublicRoute";
import RoutesMap from "./RoutesMap";
import {AppContext} from "./contexts/AppContext";
import LoadingAction from "./theme/LoadingAction";
import {useSelector} from "react-redux";
import {withStyles, useTheme} from "@mui/styles";
import {FORGOT_PASSWORD, LOGIN, RESET_PASSWORD} from "./constants/links";
import './App.css'
const styles = {
    main: {
        height: '100vh'
    }
}
const App = (props) => {
    const {
        classes,
        location
    } = props;
    const {
        loading
    } = useContext(AppContext);
    const {
        dataUser
    } = useSelector(state => state.authReducer);

    const isPublicRoute = [
        LOGIN,
        FORGOT_PASSWORD,
        RESET_PASSWORD
    ].includes(location.pathname) || location.pathname.includes('reset-password')

    return (
        <>
            <Switch>
                <div className={classes.main}>
                    <>
                        {arrayRoutesPublic.map(item => {
                            return <PublicRoute
                                path={item.path}
                                exact={item.exact}
                                component={item.component}
                            />;
                        })}
                        <RoutesMap isPublicRoute={isPublicRoute}/>
                    </>
                </div>
            </Switch>
            {loading && <LoadingAction />}
        </>
    );
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), withRouter,)(App);
