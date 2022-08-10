import React, {useContext, useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, notification, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import {PlusOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import equipmentTypeApi from "../../api/equipmentTypeApi";
import equipmentApi from "../../api/equipmentApi";
import {
    FORM_TYPE_EDIT,
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";
import {AppContext} from "../../contexts/AppContext";
import {withTranslation} from "react-i18next";
import UploadButton from "../../theme/UploadButton";

const {Option} = Select;
const {TextArea} = Input
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
            },
            '& .ant-picker': {
                width: '100%'
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
    description: '',
    serialNumber: '',
    mark: '',
    model: '',
    version: '',
    purchaseDate: '',
    transferDate: '',
    lossDate: '',
    maintenanceDate: '',
    type: null,
    logo: null,
}

const EquipmentForm = (props) => {
    const {
        classes,
        history,
        formType,
        match,
        t
    } = props;
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
        const res = await equipmentApi.showEquipment(productId);
        if (res.status === 200 && res.data.item) {
            const data = res.data.item;
            const fileId = data?.logo?.fileId;
            if (fileId) {
                setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
            }
            const dataTemp = {
                ...data,
                type: data.type?._id ?? null,
                purchaseDate: data.purchaseDate ? moment(data.purchaseDate) : '',
                transferDate: data.transferDate ? moment(data.transferDate) : '',
                lossDate: data.lossDate ? moment(data.lossDate) : '',
                maintenanceDate: data.maintenanceDate ? moment(data.maintenanceDate) : '',
            }
            setInitialForm(dataTemp)
        }
    }

    useEffect(() => {
        getProductTypes();
    }, [])

    const getProductTypes = async () => {
        let res = await equipmentTypeApi.getAllEquipmentType();
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
        setLoading(true)
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('code', values.code);
        formData.append('description', values.description);
        formData.append('serialNumber', values.serialNumber);
        formData.append('mark', values.mark);
        formData.append('unit', values.unit);
        formData.append('model', values.model);
        formData.append('version', values.version);
        formData.append('purchaseDate', values.purchaseDate ? moment(values.purchaseDate).format('YYYY-MM-DD') : '');
        formData.append('transferDate', values.lossDate ? moment(values.lossDate).format('YYYY-MM-DD') : '');
        formData.append('lossDate', values.lossDate ? moment(values.lossDate).format('YYYY-MM-DD') : '');
        formData.append('maintenanceDate', values.maintenanceDate ? moment(values.maintenanceDate).format('YYYY-MM-DD') : '');
        formData.append('type', values.type);
        formData.append('logo', values.logo ? values.logo?.file?.originFileObj : initialForm?.logo?._id ?? null);
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            const res = await equipmentApi.editEquipmentById(match.params.id, formData);
            if (res.status === 200) {
                notification.success({ message: t('label.edit_success')});
            }
        } else {
            const res = await equipmentApi.createEquipment(formData);
            if (res.status === 200) {
                notification.success({ message: t('label.new_success')});
            }
        }
        history.push(links.EQUIPMENT_LIST)
        setLoading(false)
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
                                    </div> : <UploadButton />}

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
                                <Col item xs={24}>
                                    <Form.Item
                                        name="description"
                                        label={t('field.description')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('field.description')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.description}
                                    >
                                        <TextArea rows={4} placeholder={t('field.description')}/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="serialNumber"
                                        label={t('equipment.field.serialNumber')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('equipment.field.serialNumber')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.serialNumber}
                                    >
                                        <Input placeholder={t('equipment.field.serialNumber')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="mark"
                                        label={t('equipment.field.mark')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('equipment.field.mark')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.mark}
                                    >
                                        <Input placeholder={t('equipment.field.mark')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="model"
                                        label={t('equipment.field.model')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('equipment.field.model')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.model}
                                    >
                                        <Input placeholder={t('equipment.field.model')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="version"
                                        label={t('equipment.field.version')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('equipment.field.version')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.version}
                                    >
                                        <Input placeholder={t('equipment.field.version')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="purchaseDate"
                                        label={t('equipment.field.purchaseDate')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('equipment.field.purchaseDate')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.purchaseDate}
                                    >
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="transferDate"
                                        label={t('equipment.field.transferDate')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('equipment.field.transferDate')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.transferDate}
                                    >
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                {/*<Col item xs={12}>*/}
                                {/*    <Form.Item*/}
                                {/*        name="lossDate"*/}
                                {/*        label={t('equipment.field.lossDate')}*/}
                                {/*        // rules={[*/}
                                {/*        //     {*/}
                                {/*        //         required: true,*/}
                                {/*        //         message: t('label.field_required', {*/}
                                {/*        //             field: t('equipment.field.lossDate')*/}
                                {/*        //         })*/}
                                {/*        //     },*/}
                                {/*        // ]}*/}
                                {/*        initialValue={initialForm.lossDate}*/}
                                {/*    >*/}
                                {/*        <DatePicker/>*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col item xs={12}>*/}
                                {/*    <Form.Item*/}
                                {/*        name="maintenanceDate"*/}
                                {/*        label={t('equipment.field.maintenanceDate')}*/}
                                {/*        // rules={[*/}
                                {/*        //     {*/}
                                {/*        //         required: true,*/}
                                {/*        //         message: t('label.field_required', {*/}
                                {/*        //             field: t('equipment.field.maintenanceDate')*/}
                                {/*        //         })*/}
                                {/*        //     },*/}
                                {/*        // ]}*/}
                                {/*        initialValue={initialForm.maintenanceDate}*/}
                                {/*    >*/}
                                {/*        <DatePicker/>*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                <Col item xs={24}>
                                    <Form.Item
                                        name={"type"}
                                        label={t('equipment.field.type')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('equipment.field.type')
                                        //         })
                                        //     },
                                        // ]}
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

EquipmentForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter,  withTranslation())(EquipmentForm);
