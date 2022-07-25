import React from "react";
import "./LoadingAction.css"
import PropTypes from "prop-types";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {withStyles} from "@mui/styles";
import {Spin} from "antd";
const styles = {
    loadingActionWrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(255,255,255,0.5)',
    }
}
const LoadingAction = (props) => {
    const {classes} = props;
    return (
        <div className={classes.loadingActionWrapper}>
            <div className="loading-action-content">
                <Spin size="large" />
            </div>
        </div>
    );
}
LoadingAction.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(LoadingAction);
