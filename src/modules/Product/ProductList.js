import React, {useContext, useEffect, useState} from "react";
import {
    Button, Col, Image,
    notification,
    Popconfirm, Row,
    Space,
} from "antd";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import productApi from "../../api/productApi";
import {Link, withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import {AppContext} from "../../contexts/AppContext";
import CustomList from "../../theme/CustomList";
import {compose} from "redux";
import ViewItem from "../../theme/ViewItem";
import PropTypes from "prop-types";
import {withStyles} from "@mui/styles";
import {useTranslation} from "react-i18next";
import ViewBlock from "../../theme/ViewBlock";
const styles = {
    rowRender: {
    }
}

function ProductTypeList(props) {
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
        const res = await productApi.deleteProductById(id);
        if (res.status === 200) {
            notification.success({message: t('label.delete_success')});
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
            title: t('product.field.type'),
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
                        to={links.PRODUCT_EDIT.replace(':id', record._id)}
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
            <div>
                <Link
                    to={links.PRODUCT_NEW}
                >
                    <Button
                        type="primary"
                    >
                        {t('product.label.add_new_product')}
                    </Button>
                </Link>
                <CustomList
                    apiNameList={'api/v1/product/list'}
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
                                                                label={t('product.field.price')}
                                                                view={(record.price ?? "") + " VND"}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('product.field.unit')}
                                                                view={(record.unit ?? "")}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('product.field.type')}
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
            </div>
        </>
    );
}

ProductTypeList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), withRouter)(ProductTypeList);

