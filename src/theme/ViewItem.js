import React, {useContext} from 'react';
import {AppContext} from '../contexts/AppContext';
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
const styles = {
    container: {
        padding: 5,
        display: 'flex',
        // alignItems: 'center'
        flexDirection: 'column',
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    titleImage: {
        height: 36,
        width: 36,
        marginRight: 10,
    },
    titleText: {
        fontSize: 15,
        fontWeight: 600,
        textTransform: 'uppercase',
    },
    view: {
        padding: '2px 0',
        alignItems: 'flex-start',
        display: 'flex'
    },
    viewText: {
        fontSize: 14,
        fontWeight: '300',
    },
}

const ViewItem = (props) => {
    const {
        icon,
        label,
        view,
        isViewComponent,
        classes
    } = props;
    const {
        theme,
    } = useContext(AppContext);
    return (
        <div className={classes.container}>
            {(label || icon) && <div className={classes.title}>
                {
                    icon && <img
                        src={icon}
                        className={classes.titleImage}
                    />
                }
                {label && <div className={classes.titleText}>
                    {label}
                </div>}
            </div>}
            <div className={classes.view}>
                {
                    isViewComponent
                        ?
                        <>{view}</>
                        :
                        <div className={classes.viewText}>
                            {view}
                        </div>
                }
            </div>
        </div>
    )
}
ViewItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ViewItem);
