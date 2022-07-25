import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import {useTranslation, withTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import gpsPointApi from "../../api/gpsPointApi";
import {Switch} from 'antd';
import GpsPointViewMap from "./GpsPointViewMap";
import GpsPointViewList from "./GpsPointViewList";

const styles = {
    container: {
        height: 'calc(100vh - 240px)!important',
        width: 'calc(100vw - 80px)!important',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        // height: 50,
    },
    switchViewType: {
        display: 'flex',
        position: 'absolute',
        top: 10,
        '& .label': {
            padding: '0 5px'
        },
        '& button': {
            backgroundColor: '#002140'
        }
    },
    body: {
        display: 'block',
        padding: 10,
    }
}
const GpsPointView = (props) => {
    const {
        classes,
        gpsRoute
    } = props;
    const {t} = useTranslation();
    const [isViewMap, setIsViewMap] = useState(false);
    const [gpsPoints, setGpsPoints] = useState([]);

    useEffect(() => {
        setIsViewMap(false);
        getGpsPoints();
    }, [gpsRoute])

    const getGpsPoints = async () => {
        setGpsPoints([])
        const res = await gpsPointApi.getAllGpsPoint({
            gpsRouteId: gpsRoute._id
        })
        if (res.status === 200 && Array.isArray(res.data.items)) {
            setGpsPoints(res.data.items.filter((item, index) => {
                if (Number(item.distance) < 20 && index !== 0) {
                    return false
                }
                return true;
            }));
        }
    }
    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.switchViewType}>
                    <div className="label">
                        {t('gpsRoute.label.list')}
                    </div>
                    <Switch
                        checked={isViewMap}
                        onChange={(checked) => {
                            setIsViewMap(checked)
                        }}
                    />
                    <div className="label">
                        {t('gpsRoute.label.map')}
                    </div>
                </div>
            </div>
            <div className={classes.body}>
                {
                    isViewMap ?
                        <GpsPointViewMap gpsPoints={gpsPoints} gpsRoute={gpsRoute}/>
                        :
                        <GpsPointViewList gpsPoints={gpsPoints} gpsRoute={gpsRoute}/>
                }
            </div>
        </div>
    )
}

GpsPointView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter, withTranslation())(GpsPointView);
