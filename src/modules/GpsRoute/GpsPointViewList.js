import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import {useTranslation, withTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Table} from "antd";
import latitudeIcon from "../../assets/images/latitude.png";
import longitudeIcon from "../../assets/images/longitude.png";
import moment from "moment";

const styles = {
    container: {
        height: 'calc(100vh - 240px)!important',
        width: 'calc(100vw - 80px)!important',
        overflow: 'hidden',
        overflowY: 'auto',
        padding: '40px 20px',
        paddingTop: 0,
        '& .ant-pagination': {
            display: 'none'
        },
        '& .totalDistance': {
            display: 'flex',
            justifyContent: 'flex-end',
            fontWeight: 600,
            fontSize: '1.2rem',
        }
    },
    distanceCell: {
        textAlign: 'right',
        fontWeight: 500,
        fontSize: '1rem',
    },
    coordinateCell: {
        display: 'flex',
        alignItems: 'center',
        '& img': {
            width: 24,
            height: 24,
            marginRight: 5,
        },
        '& div': {

        }
    },
    timeCell: {

    }
}
const GpsPointViewList = (props) => {
    const {
        classes,
        gpsPoints
    } = props;
    const {t} = useTranslation();
    const columns = [
        {
            title: t('gpsRoute.field.latitude'),
            dataIndex: 'latitude',
            key: 'latitude',
            render: (text, record) => {
                return (
                    <div className={classes.coordinateCell}>
                        <img src={latitudeIcon} alt=""/>
                        <div>
                            {text}
                        </div>
                    </div>
                )
            }
        },
        {
            title: t('gpsRoute.field.longitude'),
            dataIndex: 'longitude',
            key: 'longitude',
            render: (text, record) => {
                return (
                    <div className={classes.coordinateCell}>
                        <img src={longitudeIcon} alt=""/>
                        <div>
                            {text}
                        </div>
                    </div>
                )
            }
        },
        {
            title: t('gpsRoute.field.time'),
            dataIndex: 'time',
            key: 'time',
            render: (text, record) => {
                return (
                    <div className={classes.timeCell}>
                        <div>{text ? moment(text).format('LL') : ''}</div>
                        <div>{text ? moment(text).format('LT') : ''}</div>
                    </div>
                )
            }
        },
        {
            title: t('gpsRoute.field.distance'),
            dataIndex: 'distance',
            key: 'distance',
            render: (text, record) => {
                return (
                    <div className={classes.distanceCell}>
                        {text}m
                    </div>
                )
            }
        },
    ];
    let totalDistance = 0;
    gpsPoints.forEach(item => {
        totalDistance += Number(item.distance) ?? 0;
    })
    return (
        <div className={classes.container}>
            <Table
                dataSource={gpsPoints}
                columns={columns}
                pagination={{
                    pageSize: 100
                }}
            />
            <div className="totalDistance">{totalDistance/1000}km</div>
        </div>
    )
}

GpsPointViewList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter, withTranslation())(GpsPointViewList);
