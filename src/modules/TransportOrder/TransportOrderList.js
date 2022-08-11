import React, {useContext, useEffect, useState} from "react";
import {
    Button, Col, Dropdown, Image, Modal, notification,
    Popconfirm, Row,
    Space,
} from "antd";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {Link, withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import {AppContext} from "../../contexts/AppContext";
import CustomList from "../../theme/CustomList";
import {useTranslation} from "react-i18next";

import ViewItem from "../../theme/ViewItem";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import InvoiceICon from "../../assets/images/invoice.png";
import {
    TRANSPORT_STATUS_CANCELED,
    TRANSPORT_STATUS_COMPLETED, TRANSPORT_STATUS_MOVING,
    TRANSPORT_STATUS_WAITING
} from "../../constants/constants";
import transportApi from "../../api/transportApi";
import transport_completed from "../../assets/images/transport_completed.png";
import transport_canceled from "../../assets/images/transport_canceled.png";
import transport_waiting from "../../assets/images/transport_waiting.png";
import transport_moving from "../../assets/images/transport_moving.png";
import {AiOutlineArrowRight} from "react-icons/ai";
import ViewBlock from "../../theme/ViewBlock";
import moment from "moment";

const styles = {
    rowRender: {
        '& .equipmentItem': {
            width: 400,
            padding: '5px 0',
        },
        '& .equipmentItemCell': {
            borderBottom: '1px solid #002140',
            padding: 0,
        },
        '& .equipmentItemCellContent': {
            padding: '5px 0',
            display: 'flex',
            alignItems: 'center',
            '& img': {
                paddingRight: 10,
            },
            '&.right': {
                justifyContent: 'flex-end'
            }
        }
    },
    pdfViewModal: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%!important',
        padding: 40,
        '& .ant-modal-content': {
            height: '100%',
            width: '100%'
        },
        '& .ant-modal-body': {
            height: '100%',
            width: '100%'
        }
    },
    pdfViewWrapper: {
        height: '100%',
        width: '100%',
        padding: '0 20px',
        '& iframe': {
            height: '100%',
            width: '100%'
        }
    },
    btnMenuChangeStatus: {
        margin: 'auto',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: 24,
    }
}

function TransportOrderList(props) {
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
        const res = await transportApi.deleteTransportById(id);
        if (res.status === 200) {
            notification.success({message: t('label.delete_success')});
        }
        setForceUpdate(true);
        setLoading(false);
    };
    const handleCreateInvoice = async (recordId) => {
        setLoading(true);
        const res = await transportApi.createInvoiceById(recordId);
        if (res.status === 200) {
            notification.success({message: t('transportOrder.label.create_invoice_success')});
            setForceUpdate(true);
        }
        setLoading(false);
    }

    const handleChangeStatus = async (recordId, status) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('status', status);
        const res = await transportApi.changeStatusTransportById(recordId, formData);
        if (res.status === 200) {
            notification.success({message: t('transportOrder.label.change_status_success')});
            setForceUpdate(true);
        }
        setLoading(false);
    }
    const columns = [
        {
            title: t('transportOrder.field.title'),
            dataIndex: "title",
            key: "title"
        },
        {
            title: t('transportOrder.field.client'),
            dataIndex: "client",
            key: "client",
            render: (text, record) => {
                return (
                    <>
                        {text?.name ?? ""}
                    </>
                )
            }
        },
        // {
        //     title: t('transportOrder.field.project'),
        //     dataIndex: "project",
        //     key: "project",
        //     render: (text, record) => {
        //         return (
        //             <>
        //                 {text?.name ?? ""}
        //             </>
        //         )
        //     }
        // },
        {
            title: t('transportOrder.field.status'),
            dataIndex: "status",
            key: "status",
            render: (text, record) => {
                const imageStatus =
                    text === TRANSPORT_STATUS_WAITING
                        ? transport_waiting
                        :
                        text === TRANSPORT_STATUS_COMPLETED
                            ?
                            transport_completed
                            :
                            text === TRANSPORT_STATUS_CANCELED
                                ?
                                transport_canceled
                                :
                                text === TRANSPORT_STATUS_MOVING
                                    ?
                                    transport_moving
                                    :
                                null;
                return (
                    <>
                        <img style={{
                            height: 36,
                        }} src={imageStatus} alt=""/>
                    </>
                )
            }
        },
        {
            title: t('transportOrder.field.invoice'),
            dataIndex: "invoice",
            key: "invoice",
            render: (text, record) => {
                return (
                    <>
                        {text?.title ?? ""}
                    </>
                )
            }
        },
        {
            title: t('label.action'),
            key: "action",
            render: (text, record) => {
                return (
                    <Space size="middle">
                        {record.status === TRANSPORT_STATUS_WAITING && <Link
                            to={links.TRANSPORT_ORDER_EDIT.replace(':id', record._id)}
                        >
                            <FiEdit color={"green"} size={"18px"}/>
                        </Link>}
                        {/*<Popconfirm*/}
                        {/*    title={t('label.want_delete')}*/}
                        {/*    onConfirm={() => handleDelete(record._id)}*/}
                        {/*>*/}
                        {/*    <a>*/}
                        {/*        <RiDeleteBin6Line color={"red"} size={"18px"}/>*/}
                        {/*    </a>*/}
                        {/*</Popconfirm>*/}
                        {record.status === TRANSPORT_STATUS_COMPLETED && <>
                            {
                                !record.invoice &&
                                <Popconfirm
                                    title={t('transportOrder.label.confirm_create_invoice')}
                                    onConfirm={() => handleCreateInvoice(record._id)}
                                >
                                    <a>
                                        <div>
                                            <AiOutlineArrowRight color={"blue"} size={"18px"}/> <img style={{
                                            height: 24,
                                        }} src={InvoiceICon} alt=""/>
                                        </div>
                                        <div>
                                            {t('transportOrder.field.invoice')}
                                        </div>
                                    </a>
                                </Popconfirm>
                            }
                        </>}
                    </Space>
                )
            },
        },
        {
            title: t('transportOrder.label.changeStatus'),
            key: "changeStatus",
            render: (text, record) => {
                if (record.invoice) {
                    return (
                        <></>
                    )
                }
                return (
                    <Space size="middle">
                        {record.status === TRANSPORT_STATUS_WAITING && <>
                            <Popconfirm
                                title={t('transportOrder.label.confirm_change_status')}
                                onConfirm={() => handleChangeStatus(record._id, TRANSPORT_STATUS_COMPLETED)}
                            >
                                <a>
                                   <div>
                                       <AiOutlineArrowRight color={"blue"} size={"18px"}/> <img style={{
                                       height: 24,
                                   }} src={transport_completed} alt=""/>
                                   </div>
                                    <div>
                                        {t('transportOrder.field.status_completed')}
                                    </div>
                                </a>
                            </Popconfirm>
                        </>}
                        {/*{record.status !== TRANSPORT_STATUS_WAITING && <>*/}
                        {/*    <Popconfirm*/}
                        {/*        title={t('transportOrder.label.confirm_change_status')}*/}
                        {/*        onConfirm={() => handleChangeStatus(record._id, TRANSPORT_STATUS_WAITING)}*/}
                        {/*    >*/}
                        {/*        <a>*/}
                        {/*            <div>*/}
                        {/*                <AiOutlineArrowRight color={"blue"} size={"18px"}/> <img style={{*/}
                        {/*                height: 24,*/}
                        {/*            }} src={transport_waiting} alt=""/>*/}
                        {/*            </div>*/}
                        {/*            <div>*/}
                        {/*                {t('transportOrder.field.status_waiting')}*/}
                        {/*            </div>*/}
                        {/*        </a>*/}
                        {/*    </Popconfirm>*/}
                        {/*</>}*/}
                        {/*{record.status !== TRANSPORT_STATUS_CANCELED && <>*/}
                        {/*    <Popconfirm*/}
                        {/*        title={t('transportOrder.label.confirm_change_status')}*/}
                        {/*        onConfirm={() => handleChangeStatus(record._id, TRANSPORT_STATUS_CANCELED)}*/}
                        {/*    >*/}
                        {/*        <a>*/}
                        {/*           <div>*/}
                        {/*               <AiOutlineArrowRight color={"blue"} size={"18px"}/> <img style={{*/}
                        {/*               height: 24,*/}
                        {/*           }} src={transport_canceled} alt=""/>*/}
                        {/*           </div>*/}
                        {/*            <div>*/}
                        {/*                {t('transportOrder.field.status_cancelled')}*/}
                        {/*            </div>*/}
                        {/*        </a>*/}
                        {/*    </Popconfirm>*/}
                        {/*</>}*/}
                    </Space>
                )
            },
        },
    ];

    return (
        <>
            <div>
                <Link
                    to={links.TRANSPORT_ORDER_NEW}
                >
                    <Button
                        type="primary"
                        onClick={() => {

                        }}
                    >
                        {t('transportOrder.label.add_new_transport')}
                    </Button>
                </Link>
                <CustomList
                    apiNameList={'api/v1/transportOrder/list'}
                    forceUpdate={forceUpdate}
                    columns={columns}
                    expandable={{
                        expandedRowRender: record => {
                            const imageStatus =
                                record.status === TRANSPORT_STATUS_WAITING
                                    ? transport_waiting
                                    :
                                    record.status === TRANSPORT_STATUS_COMPLETED
                                        ?
                                        transport_completed
                                        :
                                        record.status === TRANSPORT_STATUS_CANCELED
                                            ?
                                            transport_canceled
                                            :
                                            record.status === TRANSPORT_STATUS_MOVING
                                                ?
                                                transport_moving
                                            :
                                            null;
                            // const addressClientProvince = record.clientAddress?.province ? JSON.parse(record.clientAddress.province)?.label ?? "" : '';
                            // const addressClientDistrict = record.clientAddress?.district ? JSON.parse(record.clientAddress.district)?.label ?? "" : '';
                            // const addressClientWard = record.clientAddress?.ward ? JSON.parse(record.clientAddress.ward)?.label ?? "" : '';


                            let totalAmount = 0;

                            record.products.forEach((item, index) => {
                                totalAmount += item.price * item.amount;
                            })
                            return (
                                <div className={classes.rowRender}>
                                    <ViewBlock
                                        content={
                                            <Row>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.title')}
                                                        view={record.title ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={16} xl={16}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.note')}
                                                        view={record.note ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    {imageStatus && <ViewItem
                                                        label={t('transportOrder.field.status')}
                                                        view={
                                                            <img style={{
                                                                height: 36,
                                                            }} src={imageStatus} alt=""/>
                                                        }
                                                    />}
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.project')}
                                                        view={record.project?.name ?? ""}
                                                    />
                                                </Col>
                                                {/*<Col item xs={24} sm={12} md={12} lg={8} xl={8}>*/}
                                                {/*    <ViewItem*/}
                                                {/*        label={t('transportOrder.field.client')}*/}
                                                {/*        view={record.client?.name ?? ""}*/}
                                                {/*    />*/}
                                                {/*</Col>*/}
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.invoice')}
                                                        view={record.invoice?.title ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.departAt')}
                                                        view={
                                                            record.departAt
                                                            ?
                                                            <div className={classes.timeCell}>
                                                                <div>{record.departAt  ? moment(record.departAt ).format('LL') : ''}</div>
                                                                <div>{record.departAt  ? moment(record.departAt ).format('LT') : ''}</div>
                                                            </div>
                                                                :
                                                                <></>
                                                        }
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.arrivalAt')}
                                                        view={
                                                            record?.arrivalAt
                                                                ?
                                                                <div className={classes.timeCell}>
                                                                    <div>{record.arrivalAt  ? moment(record.arrivalAt ).format('LL') : ''}</div>
                                                                    <div>{record.arrivalAt  ? moment(record.arrivalAt ).format('LT') : ''}</div>
                                                                </div>
                                                                :
                                                                <></>
                                                        }
                                                    />
                                                </Col>
                                                <Col xs={24}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.comment')}
                                                        view={record.comment ?? ""}
                                                    />
                                                </Col>
                                            </Row>
                                        }
                                    />
                                    <ViewBlock
                                        content={
                                            <Row>
                                                <Col item xs={24}>
                                                    <ViewItem
                                                        label={t('transportOrder.field.client')}
                                                        view={record.client?.name ?? ""}
                                                    />
                                                </Col>
                                                {record.addInfoClient && <Col xs={24}>
                                                    <ViewBlock
                                                        title={t('transportOrder.field.addInfoClient')}
                                                        content={
                                                            <Row>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('transportOrder.field.clientEmail')}
                                                                        view={record.clientEmail}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('transportOrder.field.clientPhoneNumber')}
                                                                        view={record.clientPhoneNumber}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('transportOrder.field.clientPhoneNumber')}
                                                                        view={record.clientPhoneNumber}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('transportOrder.field.clientDescription')}
                                                                        view={record.clientDescription}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('field.address_province')}
                                                                        view={record.clientAddress?.province?.name ?? ""}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('field.address_district')}
                                                                        view={record.clientAddress?.district?.name ?? ""}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('field.address_ward')}
                                                                        view={record.clientAddress?.ward?.name ?? ""}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('field.address_description')}
                                                                        view={record.clientAddress?.description ?? ""}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        }
                                                    />
                                                </Col>}
                                            </Row>
                                        }
                                    />
                                    <ViewBlock
                                        title={t('invoice.label.listProduct')}
                                        content={
                                            <table>
                                                <tr className="equipmentItem">
                                                    <th className="equipmentItemCell">
                                                        <div className="equipmentItemCellContent">
                                                            {t('invoice.field.product')}
                                                        </div>
                                                    </th>
                                                    <th className="equipmentItemCell">
                                                        <div className="equipmentItemCellContent right">
                                                            {t('invoice.field.price')}
                                                        </div>
                                                    </th>
                                                    <th className="equipmentItemCell">
                                                        <div className="equipmentItemCellContent right">
                                                            {t('invoice.field.amount')}
                                                        </div>
                                                    </th>
                                                    <th className="equipmentItemCell">

                                                    </th>
                                                </tr>
                                                {
                                                    record.products.map((item, index) => {
                                                        const fileProductLogoId = item?.product?.logo?.fileId;
                                                        return (
                                                            <tr className="equipmentItem">
                                                                <td className="equipmentItemCell">
                                                                    <div className="equipmentItemCellContent">
                                                                        {fileProductLogoId && <div className="logoCellWrapper">
                                                                            <Image
                                                                                className="logoCellImg"
                                                                                src={`https://drive.google.com/uc?export=view&id=${fileProductLogoId}`}
                                                                            />
                                                                        </div>}
                                                                        {item.product?.name ?? ""}
                                                                    </div>
                                                                </td>
                                                                <td className="equipmentItemCell">
                                                                    <div className="equipmentItemCellContent right">
                                                                        {item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} VND
                                                                    </div>
                                                                </td>
                                                                <td className="equipmentItemCell">
                                                                    <div className="equipmentItemCellContent right">
                                                                        {item.amount}
                                                                    </div>
                                                                </td>
                                                                <td className="equipmentItemCell">
                                                                    <div className="equipmentItemCellContent right">
                                                                        {(item.amount * item.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} VND
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                <tr>
                                                    <th colSpan={4}>
                                                        <div className="equipmentItemCellContent right">
                                                            {totalAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} VND
                                                        </div>
                                                    </th>
                                                </tr>
                                            </table>
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

TransportOrderList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(TransportOrderList);
