import React, {useContext, useEffect, useState} from "react";
import {Button, Checkbox, Col, Form, Input, notification, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {
    FORM_TYPE_EDIT,
    VEHICLE_TYPE_BICYCLE, VEHICLE_TYPE_CAR,
    VEHICLE_TYPE_ELECTRIC_BICYCLE, VEHICLE_TYPE_ELECTRIC_CAR, VEHICLE_TYPE_ELECTRIC_MOTORCYCLE,
    VEHICLE_TYPE_MOTORCYCLE, VEHICLE_TYPE_OTHER, VEHICLE_TYPE_TRUCK
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import {useSelector} from "react-redux";
import vehicleApi from "../../api/vehicleApi";
import {useTranslation} from "react-i18next";
import UploadButton from "../../theme/UploadButton";
import {AppContext} from "../../contexts/AppContext";
const {Option} = Select;

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    formTitle: {
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '1.2rem',
        textTransform: 'uppercase',
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
    type: null,
    logo: '',
}

const VehicleForm = (props) => {
    const {
        classes,
        history,
        formType,
        match
    } = props;
    const {
        dataUser
    } = useSelector(state => state.authReducer);
    const {
        setLoading
    } = useContext(AppContext);
    const {t} = useTranslation();
    const listVehicle = [
        {
            value: VEHICLE_TYPE_BICYCLE,
            label: t('vehicle.label.bicycle')
        },
        {
            value: VEHICLE_TYPE_ELECTRIC_BICYCLE,
            label: t('vehicle.label.electric_bicycle')
        },
        {
            value: VEHICLE_TYPE_MOTORCYCLE,
            label: t('vehicle.label.motorcycle')
        },
        {
            value: VEHICLE_TYPE_ELECTRIC_MOTORCYCLE,
            label: t('vehicle.label.electric_motorcycle')
        },
        {
            value: VEHICLE_TYPE_CAR,
            label: t('vehicle.label.car')
        },
        {
            value: VEHICLE_TYPE_ELECTRIC_CAR,
            label: t('vehicle.label.electric_car')
        },
        {
            value: VEHICLE_TYPE_TRUCK,
            label: t('vehicle.label.truck')
        },
        {
            value: VEHICLE_TYPE_OTHER,
            label: t('vehicle.label.other')
        }
    ]

    const [imageUrl, setImageUrl] = useState(false);
    const [initialForm, setInitialForm] = useState(null);
    useEffect(() => {
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            getDataInitialForm(match.params.id);
        } else {
            setInitialForm({...dataInitial})
        }
    }, [])
    const getDataInitialForm = async (productId) => {
        const res = await vehicleApi.showVehicle(productId);
        if (res.status === 200 && res.data.item) {
            const data = res.data.item;
            const fileId = data?.logo?.fileId;
            if (fileId) {
                setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
            }
            const dataTemp = {
                ...dataInitial,
                ...data,
            }
            setInitialForm(dataTemp)
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
        formData.append('prospective', values.prospective);
        formData.append('manager', values.manager);
        formData.append('type', values.type);
        formData.append('address_description', values.address_description);
        formData.append('address_city', values.address_city);
        formData.append('address_country', values.address_country);
        formData.append('address_postalCode', values.address_postalCode);
        formData.append('manager', values.manager);
        formData.append('logo', values.logo ? values.logo?.file?.originFileObj : initialForm?.logo?._id ?? null);
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            const res = await vehicleApi.editVehicleById(match.params.id, formData);
            if (res.status === 200) {
                notification.success({ message: t('label.edit_success')});
            }
        } else {
            const res = await vehicleApi.createVehicle(formData);
            if (res.status === 200) {
                notification.success({ message: t('label.new_success')});
            }
        }
        history.push(links.VEHICLE_LIST);
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
                        <Col item xs={24}>
                            <div className={classes.formTitle}>{formType === FORM_TYPE_EDIT ? t('vehicle.label.edit_vehicle') : t('vehicle.label.add_new_vehicle')}</div>
                        </Col>
                        <Col item xs={24} sm={12} md={12} lg={8}>
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
                                        <img src={imageUrl} alt="logo" style={{width: '100%'}}/>
                                    </div> : <UploadButton />}

                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col item xs={24} sm={12} md={12} lg={16} className={classes.formRight}>
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
                                        name={"type"}
                                        label={t('vehicle.field.type')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('vehicle.field.type')
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
                                                listVehicle.map((item, index) => {
                                                    return (
                                                        <Option value={item.value}>{item.label}</Option>
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

VehicleForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(VehicleForm);
