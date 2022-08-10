import React, {useEffect, useRef, useState} from "react";
import vehicleApi from "../../api/vehicleApi";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import personApi from "../../api/personApi";
import {Image, Modal, Select, Space} from "antd";
import gpsRouteApi from "../../api/gpsRouteApi";
import CustomList from "../../theme/CustomList";
import {FiEye} from "react-icons/fi";
import {withTranslation} from "react-i18next";
import GpsPointView from "./GpsPointView";
import {ROLE_ADMIN, ROLE_SUPERADMIN} from "../../constants/constants";
import {useSelector} from "react-redux";
import moment from "moment";

const styles = {
    modalGpsPoint: {
        width: 'calc(100% - 40px)!important',
        height: 'calc(100% - 100px)!important',
        '& .ant-modal-body': {
            position: 'relative',
            paddingTop: 40,
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
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
    itemCell: {
        display: 'flex',
        alignItem: 'center',
        '& img': {
            marginRight: 5,
        }
    }
}
const {Option} = Select;

const GpsRoutePage = (props) => {
    const {
        classes,
        t,
    } = props;
    const {
        dataUser
    } = useSelector(state => state.authReducer);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [vehicleSelected, setVehicleSelected] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [driverSelected, setDriverSelected] = useState(null);
    const [dataGpsRoute, setDataGpsRoute] = useState(null);
    useEffect(() => {
        if (isAdmin) {
            getVehicles();
            getDrivers();
        }
    }, [])
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false);
        }
    }, [forceUpdate])
    const getVehicles = async () => {
        let res = await vehicleApi.getAllVehicle();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setVehicles(resData)
        }
    }

    const getDrivers = async () => {
        let res = await personApi.getAllPerson({
            all: true,
            isDriver: true
        });
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setDrivers(resData)
        }
    }

    const showModal = (data) => {
        setDataGpsRoute(data)
        setIsModalVisible(true);
    };

    const handleOkModal = () => {
        setIsModalVisible(false);
        setDataGpsRoute(null)
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        setDataGpsRoute(null)
    };

    useEffect(() => {
        setForceUpdate(true);
    }, [vehicleSelected, driverSelected])
    const isAdmin = [ROLE_ADMIN, ROLE_SUPERADMIN].includes(dataUser?.data?.role);

    const columns = [
        {
            title: t('gpsRoute.field.vehicle'),
            dataIndex: "vehicle",
            key: "vehicle",
            render: (text, record) => {
                const fileId = record?.vehicle?.logo?.fileId;
                const linkImage = fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : null;
                return (
                    <div className={classes.itemCell}>
                        {linkImage && <div className="logoCellWrapper">
                            <Image
                                className="logoCellImg"
                                src={linkImage}
                            />
                        </div>}
                        <div>{record?.vehicle?.name}</div>
                    </div>
                )
            }
        },
        {
            title: t('gpsRoute.field.transportOrder'),
            dataIndex: "transportOrder",
            key: "transportOrder",
            render: (text, record) => {
                return (
                    <div>
                        <div>{record?.transportOrder?.title}</div>
                    </div>
                )
            }
        },
        {
            title: t('gpsRoute.field.driver'),
            dataIndex: "driver",
            key: "driver",
            render: (text, record) => {
                const fileId = record?.driver?.avatar?.fileId;
                const linkImage = fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : null;
                return (
                    <div className={classes.itemCell}>
                        {linkImage && <div className="logoCellWrapper">
                            <Image
                                className="logoCellImg"
                                src={linkImage}
                            />
                        </div>}
                        <div>{record?.driver?.firstName} {record?.driver?.lastName}</div>
                    </div>
                )
            }
        },
        {
            title: t('gpsRoute.field.startAt'),
            dataIndex: 'startAt',
            key: 'startAt',
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
            title: t('label.action'),
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <a
                        onClick={() => {
                            showModal(record);
                        }}
                    >
                        <FiEye color={"green"} size={"18px"}/>
                    </a>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Modal
                footer={null}
                title={t('gpsRoute.label.view_gps_point')}
                visible={isModalVisible}
                onOk={handleOkModal}
                onCancel={handleCancelModal}
                className={classes.modalGpsPoint}
            >
                {isModalVisible ? <GpsPointView gpsRoute={dataGpsRoute}/> : <></>}
            </Modal>
            {isAdmin && <div className={classes.header}>
                <div className={classes.selectWrapper}>
                    <div className="title">
                        {t('gpsRoute.field.driver')}
                    </div>
                    <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        placeholder={t('label.select')}
                        allowClear
                        className={classes.selectVehicle}
                        onChange={(value) => {
                            setDriverSelected(value)
                        }}
                    >
                        {
                            drivers.map((item) => {
                                const fileId = item?.avatar?.fileId;
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
                                                    {(item.firstName ?? "")} {item.lastName ?? ""}
                                                </div>
                                            </div>
                                        </div>
                                    </Option>
                                )
                            })
                        }
                    </Select>
                </div>
                <div className={classes.selectWrapper}>
                    <div className="title">
                        {t('gpsRoute.field.vehicle')}
                    </div>
                    <Select
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
                        {
                            vehicles.map((item) => {
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
            </div>}

            <CustomList
                apiNameList={'api/v1/gpsRoute/list'}
                forceUpdate={forceUpdate}
                columns={columns}
                params={isAdmin ? {
                    ...(vehicleSelected ? {vehicle: vehicleSelected} : {}),
                    ...(driverSelected ? {driver: driverSelected} : {})
                } : {}}
                hiddenSearch={true}
            />
        </div>
    )
}

GpsRoutePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter, withTranslation())(GpsRoutePage);
