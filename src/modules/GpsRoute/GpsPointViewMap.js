import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import {useTranslation, withTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Map, Marker, TileLayer, Tooltip as TooltipMap} from "react-leaflet";
import L from "leaflet";
import bicycle from "../../assets/images/bicycle.png";
import electric_bicycle from "../../assets/images/electric_bicycle.png";
import motorcycle from "../../assets/images/motorcycle.png";
import electric_motorcycle from "../../assets/images/electric_motorcycle.png";
import car from "../../assets/images/car.png";
import electric_car from "../../assets/images/electric_car.png";
import truck from "../../assets/images/truck.png";
import other from "../../assets/images/other.png";
import {
    VEHICLE_TYPE_BICYCLE, VEHICLE_TYPE_CAR,
    VEHICLE_TYPE_ELECTRIC_BICYCLE, VEHICLE_TYPE_ELECTRIC_CAR,
    VEHICLE_TYPE_ELECTRIC_MOTORCYCLE,
    VEHICLE_TYPE_MOTORCYCLE, VEHICLE_TYPE_TRUCK
} from "../../constants/constants";
import ViewItem from "../../theme/ViewItem";
import {Image} from "antd";
import longitudeIcon from "../../assets/images/longitude.png";
import latitudeIcon from "../../assets/images/latitude.png";

const styles = {
    container: {
        height: 'calc(100vh - 240px)!important',
        width: 'calc(100vw - 80px)!important',
        overflow: 'hidden',
    },
    mapElement:{
        // height: 'calc(100vh - 185px)',
        position: 'relative',
        height: '100%',
        width: '100%',
        '& .leaflet-container':{
            height: '100%',
            borderRadius: 15
        },
        '& .leaflet-tooltip':{
            background: '#bed5f9'
        },
        '& .leaflet-tooltip-left':{
            '&:before':{
                borderLeftColor: '#bed5f9'
            }
        },
        '& .leaflet-tooltip-right':{
            '&:before':{
                borderRightColor: '#bed5f9'
            }
        },
        '& .my-control':{
            display: 'flex',
            color: '#46435a',
            fontSize: 10,
            background: '#ffffff47',
            padding: '9px 7px',
            borderRadius: 4,
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
            textTransform: 'uppercase',
            '& .titleControl':{
                fontWeight: 600,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                textAlign: 'center',
                letterSpacing: '3.89px',
            },
            '& .imageWrapper':{
                display: 'flex',
                alignItems: 'center',
                '& .imageCar':{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 15,
                    '& img':{
                        width: 28,
                        height: 39,
                        marginBottom: 5
                    },
                    '& span':{

                    }
                }
            }
        },
    },
    tooltipWrapper: {
        borderRadius: 20,
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
    vehicleType: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& img': {
            height: 24,
            width: 24,
        },
        '& div': {
            fontSize: '0.8rem',
            paddingLeft: 10,
        }
    },
    transportOrder: {

    }
}
const GpsPointViewMap = (props) => {
    const {
        classes,
        gpsPoints,
        gpsRoute
    } = props;
    const {t} = useTranslation();
    const showIcon = () => {
        switch (gpsRoute.vehicle?.type) {
            case VEHICLE_TYPE_BICYCLE:
                return L.icon({
                    iconUrl: bicycle,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
            case VEHICLE_TYPE_ELECTRIC_BICYCLE:
                return L.icon({
                    iconUrl: electric_bicycle,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
            case VEHICLE_TYPE_MOTORCYCLE:
                return L.icon({
                    iconUrl: motorcycle,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
            case VEHICLE_TYPE_ELECTRIC_MOTORCYCLE:
                return L.icon({
                    iconUrl: electric_motorcycle,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
            case VEHICLE_TYPE_CAR:
                return L.icon({
                    iconUrl: car,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
            case VEHICLE_TYPE_ELECTRIC_CAR:
                return L.icon({
                    iconUrl: electric_car,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
            case VEHICLE_TYPE_TRUCK:
                return L.icon({
                    iconUrl: truck,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
            default:
                return L.icon({
                    iconUrl: other,
                    iconSize: [48, 48],
                    iconAnchor: [48, 48]
                })
        }
    }

    const showTooltip = (gpsPoint) => {
        const logoVehicleId = gpsRoute?.vehicle?.logo?.fileId;
        const avatarDriverId = gpsRoute?.driver?.avatar?.fileId;

        return (
            <div className={classes.tooltipWrapper}>
                <div className={classes.coordinateCell}>
                    <img src={latitudeIcon} alt=""/>
                    <div>
                        {gpsPoint?.latitude ?? ""}
                    </div>
                </div>
                <div className={classes.coordinateCell}>
                    <img src={longitudeIcon} alt=""/>
                    <div>
                        {gpsPoint?.longitude ?? ""}
                    </div>
                </div>
                <ViewItem
                    label={t('gpsRoute.field.vehicle')}
                    isViewComponent={true}
                    view={
                        <div className={classes.vehicleType}>
                            {logoVehicleId && <div className="logoCellWrapper">
                                <Image
                                    className="logoCellImg"
                                    src={`https://drive.google.com/uc?export=view&id=${logoVehicleId}`}
                                />
                            </div>}
                            <div>{gpsRoute?.vehicle?.name ?? ""}</div>
                        </div>
                    }
                />
                <ViewItem
                    label={t('gpsRoute.field.driver')}
                    isViewComponent={true}
                    view={
                        <div className={classes.vehicleType}>
                            {avatarDriverId && <div className="logoCellWrapper">
                                <Image
                                    className="logoCellImg"
                                    src={`https://drive.google.com/uc?export=view&id=${avatarDriverId}`}
                                />
                            </div>}
                            <div>{gpsRoute?.driver?.firstName ?? ""} {gpsRoute?.driver?.lastName ?? ""}</div>
                        </div>
                    }
                />
                <ViewItem
                    label={t('gpsRoute.field.transportOrder')}
                    isViewComponent={true}
                    view={
                        <div className={classes.transportOrder}>
                            {gpsRoute?.transportOrder?.title ?? ""}
                        </div>
                    }
                />
            </div>
        )
    }

    return (
        <div className={classes.container}>
            {
                gpsPoints.length ?
                <div className={classes.mapElement}>
                    <Map
                        zoom={13}
                        center={[gpsPoints[0].latitude, gpsPoints[0].longitude]}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {
                            gpsPoints.map((item, index) => {
                                return (
                                    <Marker
                                        position={[item.latitude, item.longitude]}
                                        icon={showIcon(index)}
                                    >
                                        <TooltipMap offset={[12.5, -22.5]}>
                                            {showTooltip(item)}
                                        </TooltipMap>
                                    </Marker>
                                )
                            })
                        }

                    </Map>
                </div>
                    :
                    <></>
            }

        </div>
    )
}

GpsPointViewMap.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter, withTranslation())(GpsPointViewMap);
