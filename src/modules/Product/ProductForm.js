import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Form, Input, notification, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import productTypeApi from "../../api/productTypeApi";
import productApi from "../../api/productApi";
import {
    FORM_TYPE_EDIT,
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import UploadButton from "../../theme/UploadButton";
import {useTranslation} from "react-i18next";
import {AppContext} from "../../contexts/AppContext";

const {Option} = Select;

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    formLeft: {
        display: 'flex',
        flexDirection: 'column',
        '& .ant-form-item-label': {
            textAlign: 'left'
        },
    },
    logo: {
        width: 180,
        height: 180,
        '& .ant-upload': {
            width: '100%',
            height: '100%'
        }
    },
    formRight: {
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        '& .ant-form-item, .ant-form-item-row': {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 2px',
            margin: '5px 0',
            width: '100%',
            '& .ant-form-item-label': {
                textAlign: 'left'
            }
        }
    },
    formFooter: {
        textAlign: 'center',
        padding: '20px 0'
    }
}

const dataInitial = {
    name: '',
    code: '',
    price: '',
    vat: '',
    type: null,
    unit: '',
    logo: null,
}

const ProductForm = (props) => {
    const {
        classes,
        history,
        formType,
        match
    } = props;
    const {t} = useTranslation();
    const {
        setLoading
    } = useContext(AppContext);
    const [imageUrl, setImageUrl] = useState(false);
    const [productTypes, setProductTypes] = useState([]);
    const [initialForm, setInitialForm] = useState(null);
    useEffect(() => {
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            getDataProduct(match.params.id);
        } else {
            setInitialForm({...dataInitial})
        }
    }, [])
    const getDataProduct = async (productId) => {
        const res = await productApi.showProduct(productId);
        if (res.status === 200 && res.data.item) {
            const data = res.data.item;
            const fileId = data?.logo?.fileId;
            if (fileId) {
                setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
            }
            const dataTemp = {
                ...data,
                type: data.type?._id ?? null
            }
            setInitialForm(dataTemp)
        }
    }

    useEffect(() => {
        getProductTypes();
    }, [])

    const getProductTypes = async () => {
        let res = await productTypeApi.getAllProductType();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setProductTypes(resData)
        }
    }
    const handleChange = info => {
        getBase64(info.file.originFileObj, imageUrl => {
            setImageUrl(imageUrl)
        });
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('code', values.code);
        formData.append('price', values.price);
        formData.append('type', values.type);
        formData.append('unit', values.unit);
        formData.append('logo', values.logo ? values.logo?.file?.originFileObj : initialForm?.logo?._id ?? null);
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            const res = await productApi.editProductById(match.params.id, formData);
            if (res.status === 200) {
                notification.success({ message: t('label.edit_success')});
            }
        } else {
            const res = await productApi.createProduct(formData);
            if (res.status === 200) {
                notification.success({ message: t('label.new_success')});
            }
        }
        history.push(links.PRODUCT_LIST);
        setLoading(false);
    }
    if (initialForm) {
        return (
            <div className={classes.container}>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                    style={{
                        width: '100%',
                        maxWidth: 800,
                    }}
                >
                    <Row>
                        <Col item xs={24} sm={24} md={12} lg={8}>
                            <Form.Item name={"logo"} label={t('field.logo')} className={classes.formLeft}>
                                <Upload
                                    name="logo"
                                    listType="picture-card"
                                    className={classes.logo}
                                    fileList={[]}
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {imageUrl ? <div style={{
                                        width: '100%',
                                        height: '100%',
                                        overflow: 'hidden'
                                    }}>
                                        <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>
                                    </div> : <UploadButton/>}

                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col item xs={24} sm={24} md={12} lg={16} className={classes.formRight}>
                            <Row>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="name"
                                        label={t('field.name')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('field.name')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.name}
                                    >
                                        <Input placeholder={t('field.name')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="code"
                                        label={t('field.code')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('field.code')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.code}
                                    >
                                        <Input placeholder={t('field.code')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="price"
                                        label={t('product.field.price') + " (VND)"}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('product.field.price')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.price}
                                    >
                                        <Input placeholder={t('product.field.price')} type="number"/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="unit"
                                        label={t('product.field.unit')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('product.field.unit')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.unit}
                                    >
                                        <Input placeholder={t('product.field.unit')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={24}>
                                    <Form.Item
                                        name={"type"}
                                        label={t('product.field.type')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('product.field.type')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.type}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            placeholder={t('label.select')}
                                            allowClear
                                            defaultValue={initialForm.type}
                                        >
                                            {
                                                productTypes.map(item => {
                                                    return (
                                                        <Option value={item._id}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col item xs={24} className={classes.formFooter}>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                >
                                    {t('label.save')}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    } else {
        return (
            <div>
                {t('label.loading')}
            </div>
        )
    }
}

ProductForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ProductForm);
