import React, {useContext, useEffect, useState} from "react";
import {
    Button, Image, notification,
    Popconfirm,
    Space,
} from "antd";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import clientApi from "../../api/clientApi";
import {Link, withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import {AppContext} from "../../contexts/AppContext";
import CustomList from "../../theme/CustomList";
import {useTranslation} from "react-i18next";
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
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
const styles = {
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

function VehicleList(props) {
    const {
        setLoading
    } = useContext(AppContext);
    const {
        classes
    } = props;
    const {t} = useTranslation();
    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false);
        }
    }, [forceUpdate])
    const handleDelete = async (id) => {
        setLoading(true);
        const res = await clientApi.deleteClientById(id);
        if (res.status === 200) {
            notification.success({message: t('label.delete_success')});
        }
        setLoading(false);
    };

    const imageVehicleType = (type) => {
        switch (type) {
            case VEHICLE_TYPE_BICYCLE:
                return bicycle;
            case VEHICLE_TYPE_ELECTRIC_BICYCLE:
                return electric_bicycle;
            case VEHICLE_TYPE_MOTORCYCLE:
                return motorcycle;
            case VEHICLE_TYPE_ELECTRIC_MOTORCYCLE:
                return electric_motorcycle;
            case VEHICLE_TYPE_CAR:
                return car;
            case VEHICLE_TYPE_ELECTRIC_CAR:
                return electric_car;
            case VEHICLE_TYPE_TRUCK:
                return truck;
        }
        return other;
    }

    const textVehicleType = (vehicleType) => {
        switch (vehicleType) {
            case VEHICLE_TYPE_BICYCLE:
                return t('vehicle.label.bicycle');
            case VEHICLE_TYPE_ELECTRIC_BICYCLE:
                return t('vehicle.label.electric_bicycle');
            case VEHICLE_TYPE_MOTORCYCLE:
                return t('vehicle.label.motorcycle');
            case VEHICLE_TYPE_ELECTRIC_MOTORCYCLE:
                return t('vehicle.label.electric_motorcycle');
            case VEHICLE_TYPE_CAR:
                return t('vehicle.label.car');
            case VEHICLE_TYPE_ELECTRIC_CAR:
                return t('vehicle.label.electric_car');
            case VEHICLE_TYPE_TRUCK:
                return t('vehicle.label.truck');
        }
        return t('vehicle.label.other');
    }

    const columns = [
        {
            title: t('field.logo'),
            dataIndex: "logo",
            key: "logo",
            render: (text, record) => {
                const fileId = text?.fileId;
                if (fileId) {
                    return (
                        <div className="logoCellWrapper">
                            <Image
                                className="logoCellImg"
                                src={`https://drive.google.com/uc?export=view&id=${fileId}`}
                            />
                        </div>
                    )
                }
                return (
                    <>

                    </>
                )
            }
        },
        {
            title: t('field.name'),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t('field.code'),
            dataIndex: "code",
            key: "code"
        },
        {
            title: t('vehicle.field.type'),
            dataIndex: "type",
            key: "type",
            render: (text, record) => {
                return (
                    <div className={classes.vehicleType}>
                        <img src={imageVehicleType(record?.type ?? "")}/>
                        <div>{textVehicleType(record?.type ?? "")}</div>
                    </div>
                )
            }
        },
        {
            title: t('label.action'),
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Link
                        to={links.VEHICLE_EDIT.replace(':id', record._id)}
                    >
                        <FiEdit color={"green"} size={"18px"}/>
                    </Link>
                    <Popconfirm
                        title={t('label.want_delete')}
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <a>
                            <RiDeleteBin6Line color={"red"} size={"18px"}/>
                        </a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div>
                <Link
                    to={links.VEHICLE_NEW}
                >
                    <Button
                        type="primary"
                        onClick={() => {

                        }}
                    >
                        {t('vehicle.label.add_new_vehicle')}
                    </Button>
                </Link>
                <CustomList
                    apiNameList={'api/v1/vehicle/list'}
                    forceUpdate={forceUpdate}
                    columns={columns}
                />
            </div>
        </>
    );
}

VehicleList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), withRouter)(VehicleList);
