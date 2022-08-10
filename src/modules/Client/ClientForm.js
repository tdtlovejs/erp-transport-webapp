import React, {useContext, useEffect, useState} from "react";
import {Button, Checkbox, Col, DatePicker, Form, Input, notification, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import personApi from "../../api/personApi";
import clientApi from "../../api/clientApi";
import {
    CLIENT_TYPE_ORGANIZATION,
    CLIENT_TYPE_PERSONAL,
    FORM_TYPE_EDIT,
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import AddressForm from "../../theme/AddressForm";
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
    phoneNumber: '',
    prospective: true,
    manager: null,
    address_description: '',
    address_city: '',
    address_country: '',
    address_postalCode: '',
    address_province: '',
    address_district: '',
    address_ward: '',
    type: null,
    logo: null,
}

const ClientForm = (props) => {
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
    const [imageUrl, setImageUrl] = useState(false);
    const [managers, setManagers] = useState([]);
    const [initialForm, setInitialForm] = useState(null);
    useEffect(() => {
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            getDataInitialForm(match.params.id);
        } else {
            setInitialForm({...dataInitial})
        }
    }, [])
    const getDataInitialForm = async (productId) => {
        const res = await clientApi.showClient(productId);
        if (res.status === 200 && res.data.item) {
            const data = res.data.item;
            const fileId = data?.logo?.fileId;
            if (fileId) {
                setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
            }
            const dataTemp = {
                ...data,
                manager: data.manager?._id ?? null,
                address_description: data.address?.description,
                address_city: data.address?.city,
                address_country: data.address?.country,
                address_postalCode: data.address?.postalCode,
                address_province: data.address?.province?._id ?? "",
                address_district: data.address?.district?._id ?? "",
                address_ward: data.address?.ward?._id ?? "",
            }
            setInitialForm(dataTemp)
        }
    }

    useEffect(() => {
        getManagers();
    }, [])

    const getManagers = async () => {
        let res = await personApi.getAllPerson({all: 1});
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setManagers(resData)
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
        formData.append('email', values.email);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('prospective', values.prospective);
        formData.append('manager', values.manager);
        formData.append('type', values.type);
        formData.append('address_description', values.address_description);
        formData.append('address_city', "");
        formData.append('address_country', "");
        formData.append('address_postalCode', "");
        formData.append('address_province', initialForm.address_province ?? "");
        formData.append('address_district', initialForm.address_district ?? "");
        formData.append('address_ward', initialForm.address_ward ?? "");
        formData.append('logo', values.logo ? values.logo?.file?.originFileObj : initialForm?.logo?._id ?? null);
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            const res = await clientApi.editClientById(match.params.id, formData);
            if (res.status === 200) {
                history.push(links.CLIENT_LIST);
                notification.success({message: t('label.edit_success')});
            }
        } else {
            const res = await clientApi.createClient(formData);
            if (res.status === 200) {
                history.push(links.CLIENT_LIST);
                notification.success({message: t('label.new_success')});
            }
        }
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
                            <div
                                className={classes.formTitle}>{formType === FORM_TYPE_EDIT ? t('client.label.edit_client') : t('client.label.add_new_client')}</div>
                        </Col>
                        <Col item xs={24} sm={24} md={24} lg={8}>
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
                                    </div> : <UploadButton/>}

                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col item xs={24} sm={24} md={24} lg={16} className={classes.formRight}>
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
                                        name="email"
                                        label={t('client.field.email')}
                                        rules={[
                                            {
                                                type: "email",
                                                message: t('label.field_email', {
                                                    field: t('client.field.email')
                                                })
                                            },
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('client.field.email')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.email}
                                    >
                                        <Input placeholder={t('client.field.email')}/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label={t('client.field.phoneNumber')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('client.field.phoneNumber')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.phoneNumber}
                                    >
                                        <Input placeholder={t('client.field.phoneNumber')} />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="prospective"
                                        valuePropName="checked"
                                        wrapperCol={{offset: 8, span: 16}}
                                        initialValue={initialForm.prospective}
                                    >
                                        <Checkbox name="prospective">{t('client.field.prospective')}</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="type"
                                        label={t('client.field.type')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('client.field.type')
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
                                            <Option value={CLIENT_TYPE_PERSONAL}>{t('client.field.type_personal')}</Option>
                                            <Option value={CLIENT_TYPE_ORGANIZATION}>{t('client.field.type_organization')}</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col item xs={24}>
                                    <Form.Item
                                        name={"manager"}
                                        label={t('client.field.manager')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('client.field.manager')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.manager}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            placeholder={t('label.select')}
                                            allowClear
                                            defaultValue={initialForm.manager}
                                        >
                                            {
                                                managers.map(item => {
                                                    return (
                                                        <Option
                                                            value={item._id}>{item.firstName + " " + item.lastName}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <AddressForm
                                    dataInitial={{
                                        province: initialForm?.address_province ?? "",
                                        district: initialForm?.address_district ?? "",
                                        ward: initialForm?.address_ward ?? "",
                                        description: initialForm?.address_description ?? "",
                                    }}
                                    onChangeProvince={(value) => {
                                        setInitialForm(prev => ({
                                            ...prev,
                                            address_province: value
                                        }))
                                    }}
                                    onChangeDistrict={(value) => {
                                        setInitialForm(prev => ({
                                            ...prev,
                                            address_district: value
                                        }))
                                    }}
                                    onChangeWard={(value) => {
                                        setInitialForm(prev => ({
                                            ...prev,
                                            address_ward: value
                                        }))
                                    }}
                                    onChangeDescription={(value) => {
                                        setInitialForm(prev => ({
                                            ...prev,
                                            address_description: value
                                        }))
                                    }}
                                />
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

ClientForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ClientForm);
