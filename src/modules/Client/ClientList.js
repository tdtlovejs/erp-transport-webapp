import React, {useContext, useEffect, useState} from "react";
import {
    Button, Checkbox, Col, Image, notification,
    Popconfirm, Row,
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
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import ViewItem from "../../theme/ViewItem";
import ViewBlock from "../../theme/ViewBlock";
import SendPdf from "./../../assets/images/send_pdf.png"
const styles = {
    logo: {
        height: 48,
    },
}
function ClientList(props) {
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
            title: t('client.field.email'),
            dataIndex: "email",
            key: "email"
        },
        {
            title: t('client.field.manager'),
            dataIndex: "manager",
            key: "manager",
            render: (text, record) => {
                return (
                    <div>
                        <div>{text?.firstName ?? ""}</div>
                        <div>{text?.lastName ?? ""}</div>
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
                        to={links.CLIENT_EDIT.replace(':id', record._id)}
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
                    to={links.CLIENT_NEW}
                >
                    <Button
                        type="primary"
                        onClick={() => {

                        }}
                    >
                        {t('client.label.add_new_client')}
                    </Button>
                </Link>
                <CustomList
                    apiNameList={'api/v1/client/list'}
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
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('field.name')}
                                                                view={record.name}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('field.code')}
                                                                view={record.code}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('client.field.email')}
                                                                view={record.email}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('client.field.phoneNumber')}
                                                                view={record.phoneNumber}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('client.field.type')}
                                                                view={record.type}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('client.field.manager')}
                                                                view={(record?.manager?.firstName ?? "") + " " + (record?.manager?.lastName ?? "")}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('client.field.prospective')}
                                                                isViewComponent={true}
                                                                view={
                                                                    <Checkbox
                                                                        checked={!!record?.prospective}
                                                                    />
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        }
                                    />
                                    <ViewBlock
                                        title={t('label.address_info')}
                                        content={
                                            <Row>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('field.address_province')}
                                                        view={record.address?.province?.name ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('field.address_district')}
                                                        view={record.address?.district?.name ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('field.address_ward')}
                                                        view={record.address?.ward?.name ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24}>
                                                    <ViewItem
                                                        label={t('field.address_description')}
                                                        view={record.address?.description ?? ""}
                                                    />
                                                </Col>
                                            </Row>
                                        }
                                    />
                                </div>
                            )
                        },
                    }}
                />
            </div>
        </>
    );
}
ClientList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ClientList);
