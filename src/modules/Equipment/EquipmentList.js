import React, {useContext, useEffect, useState} from "react";
import {
    Button, Col, Image,
    notification,
    Popconfirm, Row,
    Space,
} from "antd";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import equipmentApi from "../../api/equipmentApi";
import {Link, withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";
import {AppContext} from "../../contexts/AppContext";
import CustomList from "../../theme/CustomList";
import {compose} from "redux";
import {useTranslation, withTranslation} from "react-i18next";
import ViewItem from "../../theme/ViewItem";
import PropTypes from "prop-types";
import {withStyles} from "@mui/styles";
import ViewBlock from "../../theme/ViewBlock";
const styles = {
    rowRender: {
    }
}
function EquipmentList(props) {
    const {
        setLoading
    } = useContext(AppContext);
    const {t} = useTranslation();
    const {
        classes
    } = props;
    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false);
        }
    }, [forceUpdate])
    const handleDelete = async (id) => {
        setLoading(true);
        const res = await equipmentApi.deleteEquipmentById(id);
        if (res.status === 200) {
            notification.success({ message: t('label.delete_success')});
            setForceUpdate(true);
        }
        setLoading(false);
    };
    const columns = [
        {
            title: t('label.logo'),
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
            title: t('label.name'),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t('label.code'),
            dataIndex: "code",
            key: "code",
        },
        {
            title: t('equipment.label.purchaseDate'),
            dataIndex: "purchaseDate",
            key: "purchaseDate",
            render: (text, record) => {
                return (
                    <>
                        {text ? moment(text).format('DD-MM-YYYY') : ''}
                    </>
                )
            }
        },
        {
            title: t('vehicle.field.type'),
            dataIndex: "type",
            key: "type",
            render: (text, record) => {
                return (
                    <>
                        {text?.name ?? ""}
                    </>
                )
            }
        },
        {
            title: t('label.action'),
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Link
                        to={links.EQUIPMENT_EDIT.replace(':id', record._id)}
                    >
                        <FiEdit color={"green"} size={"18px"}/>
                    </Link>
                    <Popconfirm
                        title={t('label.want_delete')}
                        onConfirm={() => handleDelete(record._id)}
                        okText={t('label.ok')}
                        cancelText={t('label.cancel')}
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
            <Link
                to={links.EQUIPMENT_NEW}
            >
                <Button
                    type="primary"
                >
                    {t('equipment.label.add_new_equipment')}
                </Button>
            </Link>
            <CustomList
                apiNameList={'api/v1/equipment/list'}
                forceUpdate={forceUpdate}
                columns={columns}
                expandable={{
                    expandedRowRender: record => {
                        const fileId = record.logo?.fileId;
                        return (
                            <div className={classes.rowRender}>
                                <ViewBlock
                                    content={
                                        <Row>
                                            <Col item xs={24} sm={24} md={8} lg={4} xl={4} style={{
                                                padding: 10,
                                            }}>
                                                {fileId && <div
                                                    className="imageLogoWrapper"
                                                >
                                                    <Image
                                                        width="100%"
                                                        className="imageLogo"
                                                        src={`https://drive.google.com/uc?export=view&id=${fileId}`}
                                                    />
                                                </div>}
                                            </Col>
                                            <Col item xs={24} sm={24} md={16} lg={20} xl={20}>
                                                <Row>
                                                    <Col item xs={24} sm={12} md={12} lg={12} xl={12}>
                                                        <ViewItem
                                                            label={t('field.name')}
                                                            view={record.name}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={12} xl={12}>
                                                        <ViewItem
                                                            label={t('field.code')}
                                                            view={record.code}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={24} md={24} lg={24} xl={24}>
                                                        <ViewItem
                                                            label={t('field.description')}
                                                            view={record.description}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.serialNumber')}
                                                            view={record.serialNumber}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.mark')}
                                                            view={record.mark}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.model')}
                                                            view={record.model}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.version')}
                                                            view={record.version}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.purchaseDate')}
                                                            view={record.purchaseDate ? moment(record.purchaseDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.transferDate')}
                                                            view={record.transferDate ? moment(record.transferDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.lossDate')}
                                                            view={record.lossDate ? moment(record.lossDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.maintenanceDate')}
                                                            view={record.maintenanceDate ? moment(record.maintenanceDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('equipment.field.type')}
                                                            view={record.type?.name ?? ""}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    }
                                />
                            </div>
                        )
                    },
                }}
            />
        </>
    );
}

EquipmentList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(EquipmentList);

