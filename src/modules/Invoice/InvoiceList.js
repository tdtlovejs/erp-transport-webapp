import React, {useContext, useEffect, useState} from "react";
import {
    Button, Col, Image, Modal, notification,
    Popconfirm, Row,
    Space,
} from "antd";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {AiOutlineArrowRight, AiOutlineEye} from "react-icons/ai";
import {Link, withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import {AppContext} from "../../contexts/AppContext";
import CustomList from "../../theme/CustomList";
import {useTranslation} from "react-i18next";
import invoiceApi from "../../api/invoiceApi";
import ViewItem from "../../theme/ViewItem";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import ValidatedICon from "../../assets/images/invoice_validated.png";
import DraftICon from "../../assets/images/invoice_draft.png";
import PdfIcon from "../../assets/images/pdf.png"
import {INVOICE_STATUS_ACCEPTED, INVOICE_STATUS_DRAFT} from "../../constants/constants";
import moment from "moment";
import ViewBlock from "../../theme/ViewBlock";
import SendPdf from "../../assets/images/send_pdf.png";
const styles = {
    logo: {
        height: 48,
    },
    rowRender: {
        '& .btnIcon': {
            cursor: 'pointer',
        },
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
    statusInvoice: {
        display: 'flex',
        alignItems: 'center',
        background: '#00c6d1',
        padding: '2px 5px',
        justifyContent: 'center',
        borderRadius: 5,
        color: '#fff',
        textTransform: 'uppercase',
        '& img': {
            height: 24,
            marginRight: 2,
        },
        '& div': {

        }
    },
    sendPdfWrapper: {
        position: 'relative',
        '& .countSent': {
            zIndex: 999,
            fontSize: 10,
            borderRadius: 9,
            padding: '0 5px',
            position: 'absolute',
            backgroundColor: '#EB4747',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            left: 'calc(100% - 5px)',
            bottom: 'calc(100% - 5px)'
        }
    }
}

function InvoiceList(props) {
    const {
        setLoading
    } = useContext(AppContext);
    const {t} = useTranslation();
    const {
        classes
    } = props;
    const [forceUpdate, setForceUpdate] = useState(false);
    const [pdfView, setPdfView] = useState(null);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false);
        }
    }, [forceUpdate])
    const handleDelete = async (id) => {
        setLoading(true);
        const res = await invoiceApi.deleteInvoiceById(id);
        if (res.status === 200) {
            notification.success({message: t('label.delete_success')});
        }
        setForceUpdate(true);
        setLoading(false);
    };

    const handleCreatePdf = async (recordId) => {
        setLoading(true);
        const res = await invoiceApi.exportPdfInvoiceById(recordId);
        if (res.status === 200) {
            notification.success({message: t('invoice.label.export_pdf_success')});
            setForceUpdate(true);
        }
        setLoading(false);
    }

    const handleChangeStatus = async (recordId, status) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('status', status);
        const res = await invoiceApi.changeStatusInvoiceById(recordId, formData);
        if (res.status === 200) {
            notification.success({message: t('invoice.label.change_status_success')});
            setForceUpdate(true);
        }
        setLoading(false);
    }

    const sendPdfToClient = async (recordId) => {
        setLoading(true);
        const res = await invoiceApi.sendPdfToClient(recordId);
        if (res.status === 200) {
            notification.success({message: t('invoice.label.send_pdf_success')});
            setForceUpdate(true);
        }
        setLoading(false);
    }
    const columns = [
        {
            title: t('invoice.field.title'),
            dataIndex: "title",
            key: "title"
        },
        {
            title: t('invoice.field.status'),
            dataIndex: "status",
            key: "status",
            render: (text, record) => {
                const imageStatus = text === INVOICE_STATUS_ACCEPTED ? ValidatedICon : DraftICon
                return (
                   <div style={{
                       display: 'flex',
                       alignItems: 'center'
                   }}>
                       <div className={classes.statusInvoice}>
                           <img src={imageStatus} alt=""/>
                           <div>{text === INVOICE_STATUS_ACCEPTED ? t('invoice.field.status_accepted') : t('invoice.field.status_draft')}</div>
                       </div>
                   </div>
                )
            }
        },
        {
            title: t('invoice.field.client'),
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
        {
            title: t('invoice.field.project'),
            dataIndex: "project",
            key: "project",
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
            render: (text, record) => {
                const filePdfId = record?.pdf?.fileId;
                const linkPdf = filePdfId ? `https://drive.google.com/uc?export=view&id=${filePdfId}` : null;
                return (
                    <Space size="middle">
                        {record.status === INVOICE_STATUS_DRAFT && <Link
                            to={links.INVOICE_EDIT.replace(':id', record._id)}
                        >
                            <FiEdit color={"green"} size={"18px"}/>
                        </Link>}
                        <Popconfirm
                            title={t('label.want_delete')}
                            onConfirm={() => handleDelete(record._id)}
                        >
                            <a>
                                <RiDeleteBin6Line color={"red"} size={"18px"}/>
                            </a>
                        </Popconfirm>
                        {
                            record.status !== INVOICE_STATUS_ACCEPTED && <Popconfirm
                                title={t('invoice.label.confirm_change_status')}
                                onConfirm={() => handleChangeStatus(record._id, INVOICE_STATUS_ACCEPTED)}
                            >
                                <a>
                                    <AiOutlineArrowRight color={"blue"} size={"18px"}/> <img style={{
                                        height: 24,
                                }} src={ValidatedICon} alt=""/>
                                </a>
                            </Popconfirm>
                        }
                        {(record.status === INVOICE_STATUS_ACCEPTED) && <>
                            {
                                !linkPdf
                                ?
                                    <Popconfirm
                                        title={t('invoice.label.confirm_export_pdf')}
                                        onConfirm={() => handleCreatePdf(record._id)}
                                    >
                                        <a>
                                            <AiOutlineArrowRight color={"blue"} size={"18px"}/> <img style={{
                                            height: 24,
                                        }} src={PdfIcon} alt=""/>
                                        </a>
                                    </Popconfirm>
                                    :
                                    <a onClick={() => {
                                        setPdfView(linkPdf)
                                    }}>
                                        <AiOutlineEye color={"blue"} size={"18px"}/> <img style={{
                                        height: 24,
                                    }} src={PdfIcon} alt=""/>
                                    </a>
                            }
                        </>}
                        {/*{linkPdf && <img*/}
                        {/*    style={{*/}
                        {/*        width: 24,*/}
                        {/*        height: 24,*/}
                        {/*        cursor: 'pointer'*/}
                        {/*    }}*/}
                        {/*    src={SendPdf}*/}
                        {/*    alt=""*/}
                        {/*    onClick={() => {*/}
                        {/*        */}
                        {/*    }}*/}
                        {/*/>}*/}
                        {linkPdf && <Popconfirm
                            title={t('invoice.label.confirm_send_pdf')}
                            onConfirm={() => sendPdfToClient(record._id)}
                        >
                            <div className={classes.sendPdfWrapper}>
                                <img
                                    style={{
                                        width: 24,
                                        height: 24,
                                        cursor: 'pointer'
                                    }}
                                    src={SendPdf}
                                    alt=""
                                    onClick={() => {

                                    }}
                                />
                                {record.countSent && <div className="countSent">{record.countSent}</div>}
                            </div>
                        </Popconfirm>}
                    </Space>
                )
            },
        },
    ];


    return (
        <>
            <div>
                <Link
                    to={links.INVOICE_NEW}
                >
                    <Button
                        type="primary"
                        onClick={() => {

                        }}
                    >
                        {t('invoice.label.add_new_invoice')}
                    </Button>
                </Link>
                <CustomList
                    apiNameList={'api/v1/invoice/list'}
                    forceUpdate={forceUpdate}
                    columns={columns}
                    expandable={{
                        expandedRowRender: record => {
                            const imageStatus = record.status === INVOICE_STATUS_ACCEPTED ? ValidatedICon : DraftICon
                            const filePdfId = record.pdf?.fileId;
                            const linkFilePdf = filePdfId ? `https://drive.google.com/uc?export=view&id=${filePdfId}` : null;

                            let totalAmount = 0;

                            record.products.forEach((item, index) => {
                                totalAmount += item.price * item.amount;
                            })
                            return (
                                <div className={classes.rowRender}>
                                    <ViewBlock
                                        content={
                                            <>
                                                <Row>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('invoice.field.title')}
                                                            view={record.title ?? ""}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={16} xl={16}>
                                                        <ViewItem
                                                            label={t('invoice.field.note')}
                                                            view={record.note ?? ""}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('invoice.field.exportDate')}
                                                            view={record.exportDate ? moment(record.exportDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('invoice.field.expiryDate')}
                                                            view={record.expiryDate ? moment(record.expiryDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('invoice.field.status')}
                                                            view={
                                                                <div className={classes.statusInvoice}>
                                                                    <img style={{
                                                                        height: 36,
                                                                    }} src={imageStatus} alt=""/>
                                                                    <div>{record.status === INVOICE_STATUS_ACCEPTED ? t('invoice.field.status_accepted') : t('invoice.field.status_draft')}</div>
                                                                </div>
                                                            }
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('invoice.field.project')}
                                                            view={record.project?.name ?? ""}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('invoice.field.transportOrder')}
                                                            view={
                                                                <div>
                                                                    <div>
                                                                        {record.transportOrder?.title ?? ""}
                                                                    </div>
                                                                </div>
                                                            }
                                                        />
                                                    </Col>
                                                    {linkFilePdf && <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('invoice.field.pdf')}
                                                            isViewComponent={true}
                                                            view={
                                                                <div className="btnIcon" onClick={() => {
                                                                    setPdfView(linkFilePdf)
                                                                }}>
                                                                    <img style={{
                                                                        height: 36,
                                                                    }} src={PdfIcon} alt=""/>
                                                                </div>
                                                            }
                                                        />
                                                    </Col>}
                                                    <Col xs={24}>
                                                        <ViewItem
                                                            label={t('invoice.field.comment')}
                                                            view={record.comment ?? ""}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    />

                                    <ViewBlock
                                        content={
                                            <Row>
                                                <Col item xs={24}>
                                                    <ViewItem
                                                        label={t('invoice.field.client')}
                                                        view={record.client?.name ?? ""}
                                                    />
                                                </Col>
                                                {record.addInfoClient && <Col xs={24}>
                                                    <ViewBlock
                                                        title={t('invoice.field.addInfoClient')}
                                                        content={
                                                            <Row>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('invoice.field.clientName')}
                                                                        view={record.clientName}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('invoice.field.clientEmail')}
                                                                        view={record.clientEmail}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('invoice.field.clientPhoneNumber')}
                                                                        view={record.clientPhoneNumber}
                                                                    />
                                                                </Col>
                                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                                    <ViewItem
                                                                        label={t('invoice.field.clientDescription')}
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
                {pdfView && <Modal
                    visible={!!pdfView}
                    onCancel={() => {
                        setPdfView(null)
                    }}
                    className={classes.pdfViewModal}
                    footer={null}
                >
                    <div className={classes.pdfViewWrapper}>
                        <iframe src={pdfView}/>
                    </div>
                </Modal>}
            </div>
        </>
    );
}

InvoiceList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(InvoiceList);
