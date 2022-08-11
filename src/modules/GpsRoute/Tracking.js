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
import {Image, Select} from "antd";
import latitudeIcon from "../../assets/images/latitude.png";
import longitudeIcon from "../../assets/images/longitude.png";


const styles = {
    container: {

    },
    header: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 10,
    },
    selectWrapper: {
        padding: '0 20px',
        '& .title': {
            fontWeight: '600',
        }
    },
    selectVehicle: {
        width: 180,
        maxHeight: 50,
        '& .ant-select-selector': {
            height: '50px!important',
        }
    },
    optionVehicle: {
        display: 'flex',
        alignItems: 'center',
        width: 240,
        '& .vehicleLeft': {
            width: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        '& img': {
            height: 24,
            width: 24
        },
        '& .vehicleRight': {
            '& .vehicleName': {

            },
        }
    },
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
        borderRadius: 20
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
    }
}

const {Option} = Select;

const Tracking = (props) => {
    const {
        classes
    } = props;
    const {t} = useTranslation();
    const socketRef = useRef();
    const [vehicles, setVehicles] = useState([]);
    const [vehicleSelected, setVehicleSelected] = useState(null);

    const [dataGpsPoint, setDataGpsPoint] = useState({});
    const [pointCenter, setPointCenter] = useState(null);
    const [loading, setLoading] = useState(false);
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
                console.log(dataGot)
                setDataGpsPoint(prev => ({
                    ...prev,
                    [vehicle._id] : {
                        ...gpsPoint,
                        gpsRoute: {
                            ...dataGot.gpsRoute,
                            // vehicle: vehicle
                        }
                    }
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



    // let latitude = null;
    // let longitude = null;
    // Object.entries(dataGpsPoint).forEach(([key, value]) => {
    //     if (!latitude || !longitude) {
    //         latitude = value.latitude;
    //         longitude = value.longitude;
    //     }
    // })
    // console.log(dataGpsPoint)
    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        }
    }, [loading])
    useEffect(() => {
        setLoading(true);
        if (vehicleSelected) {
            let latitude = null;
            let longitude = null;
            Object.entries(dataGpsPoint).forEach(([key, value]) => {
                if ((!latitude || !longitude) && value.gpsRoute?.vehicle?._id === vehicleSelected._id) {
                    latitude = value.latitude;
                    longitude = value.longitude;
                }
            })
            if (latitude && longitude) {
                setPointCenter({
                    latitude,
                    longitude
                })
            } else {
                setPointCenter(null)
            }
        } else {
            let latitude = null;
            let longitude = null;
            Object.entries(dataGpsPoint).forEach(([key, value]) => {
                if (!latitude || !longitude) {
                    latitude = value.latitude;
                    longitude = value.longitude;
                }
            })
            if (latitude && longitude) {
                setPointCenter({
                    latitude,
                    longitude
                })
            } else {
                setPointCenter(null)
            }
        }
    }, [vehicleSelected])

    const showTooltip = (gpsPoint) => {
        const gpsRoute = gpsPoint.gpsRoute;
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
    const vehiclesMoving = vehicles.filter(item => item.status === VEHICLE_STATUS_MOVING && dataGpsPoint.hasOwnProperty(item._id));
    useEffect(() => {
        if (vehicleSelected) {
            const check = vehiclesMoving.find(item => item._id === vehicleSelected);
            if (!check) {
                setVehicleSelected(null);
            }
        }
    }, [vehiclesMoving])
    console.log('vehicleSelected ',vehicleSelected)
    console.log('vehicles ',vehicles)
    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.selectWrapper}>
                    <div className="title">
                        {t('gpsRoute.field.vehicle')}
                    </div>
                    <Select
                        value={vehicleSelected}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        placeholder={t('label.select')}
                        allowClear
                        className={classes.selectVehicle}
                        onChange={(value) => {
                            setVehicleSelected(value)
                        }}
                    >
                        <Option value={null}>All vehicles</Option>
                        {
                            vehiclesMoving.map((item) => {
                                const fileId = item?.logo?.fileId;
                                const linkImage = fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : null;
                                return (
                                    <Option value={item._id}>
                                        <div className={classes.optionVehicle}>
                                            <div className="vehicleLeft">
                                                {linkImage && <div className="logoCellWrapper">
                                                    <Image
                                                        className="logoCellImg"
                                                        src={linkImage}
                                                    />
                                                </div>}
                                            </div>
                                            <div className="vehicleRight">
                                                <div className="vehicleName">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    </Option>
                                )
                            })
                        }
                    </Select>
                </div>
            </div>
            {loading ? <></> : <div style={{
                // background: 'red',
                overflow: 'hidden',
                height: 'calc(100vh - 180px)'
            }}
                 className={classes.mapElement}
            >
                <Map
                    zoom={13}
                    center={pointCenter ? [pointCenter.latitude, pointCenter.longitude] : [21.007025, 105.843136]}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        vehicles.filter(item => {
                            if (vehicleSelected) {
                                return item._id === vehicleSelected;
                            }
                            return true;
                        }).map((item) => {
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
            </div>}
        </div>
    )
}

Tracking.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(Tracking);
