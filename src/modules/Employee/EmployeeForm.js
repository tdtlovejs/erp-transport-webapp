import React, {useContext, useEffect, useState} from "react";
import {Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import personApi from "../../api/personApi";
import {
    FORM_TYPE_EDIT,
    FORM_TYPE_NEW, GENDER_FEMALE, GENDER_MALE, GENDER_SECRET,
    ROLE_ADMIN, ROLE_EMPLOYEE,
    ROLE_SUPERADMIN
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import UploadButton from "../../theme/UploadButton";
import {useTranslation} from "react-i18next";
import AddressForm from "../../theme/AddressForm";
import {AppContext} from "../../contexts/AppContext";
import ViewItem from "../../theme/ViewItem";
import authApi from "../../api/authApi";
import {setDataUser} from "../../redux/actions/auth";
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
            },
            '& .ant-picker': {
                width: '100%'
            }
        }
    },
    formFooter: {
        textAlign: 'center',
        padding: '20px 0'
    },
    roleView: {
        padding: '2px 5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        '& .roleText': {
            fontSize: 11,
            textTransform: 'uppercase',
            fontWeight: '400',
            color: '#002140',
        }
    },
    roleSuperAdmin: {
        backgroundColor: '#0082B4',
    },
    roleAdmin: {
        backgroundColor: '#D7385E',
    },
    roleEmployee: {
        backgroundColor: '#C5C5C5'
    },
}

const dataInitial = {
    isUser: true,
    isDriver: false,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthday: '',
    gender: '',
    address_description: '',
    address_city: '',
    address_country: '',
    address_postalCode: '',
    address_province: '',
    address_district: '',
    address_ward: '',
    username: '',
    password: '',
    confirmPassword: '',
    changePassword: false,
    role: '',
    avatar: null,
}

const EmployeeForm = (props) => {
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
    const dispatch = useDispatch();

    const {t} = useTranslation();
    const [imageUrl, setImageUrl] = useState(false);
    const [initialForm, setInitialForm] = useState(null);
    const isAdmin = [ROLE_ADMIN, ROLE_SUPERADMIN].includes(dataUser?.data?.role);

    const listGender = [
        {
            value: GENDER_MALE,
            label: t('employee.field.male')
        },
        {
            value: GENDER_FEMALE,
            label: t('employee.field.female')
        },
        {
            value: GENDER_SECRET,
            label: t('employee.field.secret')
        }
    ]

    useEffect(() => {
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            getDataInitialForm(match.params.id);
        } else if (formType === "account") {
            const personId = dataUser?.data?.person?._id;
            if (personId) {
                getDataInitialForm(personId);
            } else {
                setInitialForm({...dataInitial})
            }
        } else {
            setInitialForm({...dataInitial})
        }
    }, [])
    const getDataInitialForm = async (productId) => {
        const res = await personApi.showPerson(productId);
        if (res.status === 200 && res.data.item) {
            const data = res.data.item;
            const fileId = data?.avatar?.fileId;
            if (fileId) {
                setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
            }
            const dataTemp = {
                ...dataInitial,
                ...data,
                birthday: data.birthday ? moment(data.birthday) : '',
                username: data.user?.username ?? "",
                role: data.user?.role ?? "",
                isDriver: !!data.user?.isDriver,
                address_description: data.address?.description ?? "",
                address_city: data.address?.city ?? "",
                address_country: data.address?.country ?? "",
                address_postalCode: data.address?.postalCode ?? "",
                address_province: data.address?.province?._id ?? "",
                address_district: data.address?.district?._id ?? "",
                address_ward: data.address?.ward?._id ?? "",
                isUser: data.user?.enabled
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
        formData.append('email', values.email);
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('birthday', values.birthday ? moment(values.birthday).format('YYYY-MM-DD') : '');
        formData.append('gender', values.gender);
        formData.append('address_description', values.address_description);
        formData.append('address_city', values.address_city ?? "");
        formData.append('address_country', values.address_country ?? "");
        formData.append('address_postalCode', values.address_postalCode ?? "");
        formData.append('address_province', initialForm.address_province ?? '');
        formData.append('address_district', initialForm.address_district ?? '');
        formData.append('address_ward', initialForm.address_ward ?? '');
        formData.append('avatar', values.avatar ? values.avatar?.file?.originFileObj : initialForm?.avatar?._id ?? null);
        if (initialForm.isUser) {
            formData.append('isUser', 1);
            formData.append('username', values.username ?? '');
            formData.append('password', values.password ?? '');
            formData.append('confirmPassword', values.confirmPassword ?? '');
            formData.append('changePassword', values.changePassword ? 1 : 0);
            formData.append('isDriver', !!values.isDriver);
            formData.append('role', values.role ?? initialForm.role);
        } else {
            formData.append('disabledUser', 1);
        }
        let res = null;
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            res = await personApi.editPersonById(match.params.id, formData);
        } else if (formType === "account") {
            const personId = dataUser?.data?.person?._id;
            if (personId) {
                res = await personApi.editPersonById(personId, formData);
            }
        } else {
            res = await personApi.createPerson(formData);
        }
        if (res?.status === 200) {
            if (dataUser?.data?._id === initialForm.user?._id) {
                const res1 = await authApi.showCurrentUser();
                if (res1.status === 200) {
                    dispatch(setDataUser({
                        ...dataUser,
                        ...res1.data
                    }))
                }
            }
            if (formType === "account") {
                const personId = dataUser?.data?.person?._id;
                if (personId) {
                    setInitialForm(null);
                    getDataInitialForm(personId)
                }
            } else {
                history.push(links.EMPLOYEE_LIST)
            }
        }
        setLoading(false);
    }


    const role = dataUser?.data?.role ?? "";
    const renderViewRole = (role) => {
        switch (role) {
            case ROLE_SUPERADMIN:
                return (
                    <div className={`${classes.roleView} ${classes.roleSuperAdmin}`}>
                        <div className="roleText">{t('employee.field.superadmin')}</div>
                    </div>
                )
            case ROLE_ADMIN:
                return (
                    <div className={`${classes.roleView} ${classes.roleAdmin}`}>
                        <div className="roleText">{t('employee.field.admin')}</div>
                    </div>
                )
            case ROLE_EMPLOYEE:
                return (
                    <div className={`${classes.roleView} ${classes.roleEmployee}`}>
                        <div className="roleText">{t('employee.field.employee')}</div>
                    </div>
                )
        }
        return (
            <></>
        )
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
                        <Col item xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name={"avatar"} label={t('employee.field.avatar')} className={classes.formLeft}>
                                <Upload
                                    name="avatar"
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
                        <Col item xs={24} sm={24} md={24} lg={16} className={classes.formRight}>
                            <Row>
                                <Col item xs={24}>
                                    <Form.Item
                                        name="isUser"
                                        valuePropName="checked"
                                        wrapperCol={{offset: 8, span: 16}}
                                        initialValue={initialForm.isUser}
                                    >
                                        <Checkbox
                                            name="isUser"
                                            onChange={(event) => {
                                                setInitialForm(prev => ({
                                                    ...prev,
                                                    isUser: event.target.checked
                                                }))
                                            }}
                                            disabled={formType !== FORM_TYPE_NEW && dataUser?.data?._id === initialForm.user?._id}
                                        >
                                            {t('employee.field.isUser')}
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                {
                                    initialForm.isUser ?
                                        <>
                                            <Col item xs={12}>
                                                <Form.Item
                                                    name="username"
                                                    label={t('employee.field.username')}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: t('label.field_required', {
                                                                field: t('employee.field.username')
                                                            })
                                                        },
                                                    ]}
                                                    initialValue={initialForm.username}
                                                >
                                                    <Input placeholder={t('employee.field.username')} />
                                                </Form.Item>
                                            </Col>
                                            <Col item xs={12}>
                                                {(
                                                    dataUser?.data?.person?._id === initialForm._id
                                                    || initialForm?.role === ROLE_SUPERADMIN
                                                ) ?
                                                    <>
                                                        <ViewItem
                                                            label={t('employee.field.role')}
                                                            isViewComponent={true}
                                                            view={renderViewRole(initialForm?.role)}
                                                        />
                                                    </>
                                                    :
                                                    <Form.Item
                                                        name="role"
                                                        label={t('employee.field.role')}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: t('label.field_required', {
                                                                    field: t('employee.field.role')
                                                                })
                                                            },
                                                        ]}
                                                        initialValue={initialForm.role}
                                                    >
                                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                            placeholder={t('label.select')}
                                                            allowClear
                                                            defaultValue={initialForm.role}
                                                        >
                                                            <Option value={ROLE_EMPLOYEE}>{t('employee.field.employee')}</Option>
                                                            {role === ROLE_SUPERADMIN &&
                                                                <Option value={ROLE_ADMIN}>{t('employee.field.admin')}</Option>}
                                                        </Select>
                                                    </Form.Item>
                                                }
                                            </Col>
                                            {(formType === FORM_TYPE_NEW || !initialForm.user) ? <Col item xs={12}>
                                                <Form.Item
                                                    name="password"
                                                    label="Mật khẩu"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Xin hãy nhập mật khẩu nhân viên!',
                                                        },
                                                    ]}
                                                    initialValue={initialForm.password}
                                                >
                                                    <Input.Password placeholder="Mật khẩu"/>
                                                </Form.Item>
                                            </Col> : <>
                                                <Col xs={24}>
                                                    <Form.Item
                                                        name="changePassword"
                                                        valuePropName="checked"
                                                        wrapperCol={{offset: 8, span: 16}}
                                                        initialValue={initialForm.changePassword}
                                                    >
                                                        <Checkbox
                                                            name="changePassword"
                                                            onChange={(event) => {
                                                                setInitialForm(prev => ({
                                                                    ...prev,
                                                                    changePassword: event.target.checked
                                                                }))
                                                            }}
                                                        >
                                                            {t('employee.field.changePassword')}
                                                        </Checkbox>
                                                    </Form.Item>
                                                </Col>
                                                {
                                                    initialForm.changePassword && <>
                                                        <Col xs={12}>
                                                            <Form.Item
                                                                name="confirmPassword"
                                                                label={t('employee.field.confirmPassword')}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: t('label.field_required', {
                                                                            field: t('employee.field.confirmPassword')
                                                                        })
                                                                    },
                                                                ]}
                                                                initialValue={initialForm.confirmPassword}
                                                            >
                                                                <Input.Password placeholder={t('employee.field.confirmPassword')}/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <Form.Item
                                                                name="password"
                                                                label={t('employee.field.newPassword')}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: t('label.field_required', {
                                                                            field: t('employee.field.newPassword')
                                                                        })
                                                                    },
                                                                ]}
                                                                initialValue={initialForm.password}
                                                            >
                                                                <Input.Password placeholder={t('employee.field.newPassword')}/>
                                                            </Form.Item>
                                                        </Col>
                                                    </>
                                                }
                                            </>}
                                            <Col xs={24}>
                                                <Form.Item
                                                    name="isDriver"
                                                    valuePropName="checked"
                                                    wrapperCol={{offset: 8, span: 16}}
                                                    initialValue={initialForm.isDriver}
                                                >
                                                    <Checkbox name="isDriver" disabled={!isAdmin}>{t('employee.field.isDriver')}</Checkbox>
                                                </Form.Item>
                                            </Col>
                                        </>
                                        :
                                        <>
                                        </>
                                }
                                <Col item xs={12}>
                                    <Form.Item
                                        name="firstName"
                                        label={t('employee.field.firstName')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('employee.field.firstName')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.firstName}
                                    >
                                        <Input placeholder={t('employee.field.firstName')}/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="lastName"
                                        label={t('employee.field.lastName')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('employee.field.lastName')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.lastName}
                                    >
                                        <Input placeholder={t('employee.field.lastName')}/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="email"
                                        label={t('employee.field.email')}
                                        rules={[
                                            {
                                                type: "email",
                                                message: t('label.field_email', {
                                                    field: t('employee.field.email')
                                                })
                                            },
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('employee.field.email')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.email}
                                    >
                                        <Input placeholder={t('employee.field.email')}/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label={t('employee.field.phoneNumber')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('employee.field.phoneNumber')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.phoneNumber}
                                    >
                                        <Input type="number" placeholder={t('employee.field.phoneNumber')}    />
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="birthday"
                                        label={t('employee.field.birthday')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('employee.field.birthday')
                                                })                                               },
                                        ]}
                                        initialValue={initialForm.birthday}
                                    >
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="gender"
                                        label={t('employee.field.gender')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('employee.field.gender')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.gender}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            placeholder={t('label.select')}
                                            allowClear
                                            defaultValue={initialForm.gender}
                                        >
                                            {
                                                listGender.map((item, index) => {
                                                    return (
                                                        <Option value={item.value}>{item.label}</Option>
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

EmployeeForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(EmployeeForm);
