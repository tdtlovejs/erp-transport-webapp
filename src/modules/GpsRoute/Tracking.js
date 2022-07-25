import React, {useEffect, useRef, useState} from "react";
import socketIOClient from "socket.io-client";
import vehicleApi from "../../api/vehicleApi";
import L from "leaflet";
import {TileLayer, Map, Marker} from "react-leaflet";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import vehicle_active from "../../assets/images/vehicle_active.png"
import vehicle_inactive from "../../assets/images/vehicle_inactive.png"
import {
    BASE_API,
    REAL_TIME_GPS_POINT,
    VEHICLE_STATUS_MOVING,
    VEHICLE_TYPE_BICYCLE,
    VEHICLE_TYPE_CAR,
    VEHICLE_TYPE_ELECTRIC_BICYCLE,
    VEHICLE_TYPE_ELECTRIC_CAR,
    VEHICLE_TYPE_ELECTRIC_MOTORCYCLE,
    VEHICLE_TYPE_MOTORCYCLE,
    VEHICLE_TYPE_TRUCK
} from "../../constants/constants";
import {Tooltip as TooltipMap}  from 'react-leaflet'
import bicycle from "../../assets/images/bicycle.png";
import electric_bicycle from "../../assets/images/electric_bicycle.png";
import motorcycle from "../../assets/images/motorcycle.png";
import electric_motorcycle from "../../assets/images/electric_motorcycle.png";
import car from "../../assets/images/car.png";
import electric_car from "../../assets/images/electric_car.png";
import truck from "../../assets/images/truck.png";
import other from "../../assets/images/other.png";
import {useTranslation} from "react-i18next";
import ViewItem from "../../theme/ViewItem";
import {Image} from "antd";


const styles = {
    mapElement: {
        // height: 'calc(100vh - 185px)',
        position: 'relative',
        '& .leaflet-container': {
            height: '100%',
            borderRadius: 15
        },
        '& .leaflet-tooltip': {
            background: '#bed5f9'
        },
        '& .leaflet-tooltip-left': {
            '&:before': {
                borderLeftColor: '#bed5f9'
            }
        },
        '& .leaflet-tooltip-right': {
            '&:before': {
                borderRightColor: '#bed5f9'
            }
        },
        '& .my-control': {
            display: 'flex',
            color: '#46435a',
            fontSize: 10,
            background: '#ffffff47',
            padding: '9px 7px',
            borderRadius: 4,
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
            textTransform: 'uppercase',
            '& .titleControl': {
                fontWeight: 600,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                textAlign: 'center',
                letterSpacing: '3.89px',
            },
            '& .imageWrapper': {
                display: 'flex',
                alignItems: 'center',
                '& .imageCar': {
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 15,
                    '& img': {
                        width: 28,
                        height: 39,
                        marginBottom: 5
                    },
                    '& span': {}
                }
            }
        },
    },
    tooltipWrapper: {

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
    }
}
const Tracking = (props) => {
    const {
        classes
    } = props;
    const {t} = useTranslation();
    const socketRef = useRef();
    const [vehicles, setVehicles] = useState([]);
    const [dataGpsPoint, setDataGpsPoint] = useState({});
    useEffect(() => {
        getVehicles();
    }, [])
    const getVehicles = async () => {
        let res = await vehicleApi.getAllVehicle({
            showLastPoint: true
        });
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setDataGpsPoint(res.data.dataGpsPoint)
            setVehicles(resData)
        }
    }
    useEffect(() => {
        socketRef.current = socketIOClient.connect(BASE_API)

        socketRef.current.on(REAL_TIME_GPS_POINT, dataGot => {
            const vehicle = dataGot.vehicle;
            const gpsPoint = dataGot.gpsPoint;
            if (vehicle && gpsPoint) {
                setDataGpsPoint(prev => ({
                    ...prev,
                    [vehicle._id] : gpsPoint
                }))
                setVehicles(prev => prev.map(item => {
                    if (item._id === vehicle._id) {
                        return {
                            ...item,
                            status: vehicle.status
                        }
                    }
                    return item;
                }))
            }
        })
        return () => {
            socketRef.current.disconnect();
        };
    }, []);



    let latitude = null;
    let longitude = null;
    Object.entries(dataGpsPoint).forEach(([key, value]) => {
        if (!latitude || !longitude) {
            latitude = value.latitude;
            longitude = value.longitude;
        }
    })

    const showIcon = (item) => {
        switch (item?.type) {
            case VEHICLE_TYPE_BICYCLE:
                return L.icon({
                    iconUrl: bicycle,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
            case VEHICLE_TYPE_ELECTRIC_BICYCLE:
                return L.icon({
                    iconUrl: electric_bicycle,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
            case VEHICLE_TYPE_MOTORCYCLE:
                return L.icon({
                    iconUrl: motorcycle,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
            case VEHICLE_TYPE_ELECTRIC_MOTORCYCLE:
                return L.icon({
                    iconUrl: electric_motorcycle,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
            case VEHICLE_TYPE_CAR:
                return L.icon({
                    iconUrl: car,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
            case VEHICLE_TYPE_ELECTRIC_CAR:
                return L.icon({
                    iconUrl: electric_car,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
            case VEHICLE_TYPE_TRUCK:
                return L.icon({
                    iconUrl: truck,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
            default:
                return L.icon({
                    iconUrl: other,
                    iconSize: [36, 36],
                    iconAnchor: [24, 48]
                })
        }
    }

    const showTooltip = (gpsPoint) => {
        const gpsRoute = gpsPoint.gpsRoute;
        const logoVehicleId = gpsRoute?.vehicle?.logo?.fileId;
        const avatarDriverId = gpsRoute?.driver?.avatar?.fileId;

        return (
            <div className={classes.tooltipWrapper}>
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
        <div>
            <div style={{
                // background: 'red',
                overflow: 'hidden',
                height: 'calc(100vh - 180px)'
            }}
                 className={classes.mapElement}
            >
                <Map
                    zoom={13}
                    center={(latitude && longitude) ? [latitude, longitude] : [21.007025, 105.843136]}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        vehicles.map((item) => {
                            if (item.status === VEHICLE_STATUS_MOVING && dataGpsPoint.hasOwnProperty(item._id)) {
                                const latitude = dataGpsPoint[item._id]?.latitude;
                                const longitude = dataGpsPoint[item._id]?.longitude;
                                if (latitude && longitude) {
                                    return (
                                        <Marker
                                            position={[latitude, longitude]}
                                            icon={
                                                L.icon({
                                                    iconUrl: vehicle_active,
                                                    iconSize: [48, 48],
                                                    iconAnchor: [48, 48]
                                                })
                                            }
                                        >
                                            <TooltipMap offset={[12.5, -22.5]}>
                                                {showTooltip(dataGpsPoint[item._id])}
                                            </TooltipMap>
                                        </Marker>
                                    )
                                }
                            }
                            return (
                                <></>
                            )
                        })
                    }

                </Map>
            </div>
        </div>
    )
}

Tracking.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(Tracking);
