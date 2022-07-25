import React, {useContext} from "react";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import syncIcon from "../../assets/images/sync.png"
import {AppContext} from "../../contexts/AppContext";
import {useTranslation} from "react-i18next";
import equipmentTypeApi from "../../api/equipmentTypeApi";
import addressApi from "../../api/addressApi";
import {notification} from "antd";
const styles = {
    container: {
        display: 'flex',
        padding: 20,
    },
    syncAddress: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        textTransform: 'uppercase',
        backgroundColor: '#e8ecf6!important',
        borderRadius: 5,
        padding: '10px 20px',
        '& img': {
            width: 80,
        }
    }
}

const BackOffice = (props) => {
    const {
        children,
        classes
    } = props;
    const {
        setLoading
    } = useContext(AppContext);

    const syncAddress = async () => {
        setLoading(true);
        let res = await addressApi.initVnAddress();
        if (res.status === 200) {
            notification.success({ message: t('backoffice.label.sync_address_success')});
        }
        setLoading(false);
    }
    const {t} = useTranslation();
    return (
        <div className={classes.container}>
            <div className={classes.syncAddress} onClick={() => {
                syncAddress();
            }}>
                <img src={syncIcon} alt=""/>
                <div>
                    {t('backoffice.label.sync_address')}
                </div>
            </div>
        </div>
    )
}

BackOffice.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), withRouter)(BackOffice);
