import React, {useContext, useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, notification, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import projectTypeApi from "../../api/projectTypeApi";
import projectApi from "../../api/projectApi";
import {FORM_TYPE_EDIT,} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";
import UploadButton from "../../theme/UploadButton";
import {useTranslation} from "react-i18next";
import clientApi from "../../api/clientApi";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import equipmentApi from "../../api/equipmentApi";
import {AppContext} from "../../contexts/AppContext";
import {RiDeleteBin6Line} from "react-icons/ri";

const {Option} = Select;
const {TextArea} = Input;
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
    viewBlock: {
        '& .viewBlockTitle': {
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontSize: '1rem',
            marginTop: 20,
        },
        '& .viewBlockContent': {
            '& .equipmentItem': {
                display: 'flex',
                alignItems: 'center',
                '& .equipmentItemLeft': {
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                },
                '& .equipmentItemRight': {

                },
                '& .equipmentItemText': {
                    padding: 5,
                },
                '& .ant-form-item, .ant-form-item-row': {
                    flex: 1,
                    width: '100%',
                }
            },
        }
    }
}

const dataInitial = {
    name: '',
    code: '',
    description: '',
    startDate: '',
    endDate: '',
    days: '',
    amount: '',
    type: null,
    logo: null,
    client: null
}

const ProjectForm = (props) => {
    const {
        classes,
        history,
        formType,
        match
    } = props;
    const {
        setLoading
    } = useContext(AppContext);
    const {t} = useTranslation();
    const [imageUrl, setImageUrl] = useState(false);
    const [projectTypes, setProjectTypes] = useState([]);
    const [clients, setClients] = useState([]);
    const [initialForm, setInitialForm] = useState(null);
    const [equipments, setEquipments] = useState([]);
    useEffect(() => {
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            getDataInitialForm(match.params.id);
        } else {
            setInitialForm({...dataInitial})
        }
    }, [])
    const getDataInitialForm = async (productId) => {
        const res = await projectApi.showProject(productId);
        if (res.status === 200 && res.data.item) {
            const data = res.data.item;
            const fileId = data?.logo?.fileId;
            if (fileId) {
                setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
            }
            const dataTemp = {
                ...data,
                type: data.type?._id ?? null,
                client: data.client?._id ?? null,
                startDate: data.startDate ? moment(data.startDate) : '',
                endDate: data.endDate ? moment(data.endDate) : '',
                equipments: Array.isArray(data.equipments) ? data.equipments.map((item, index) => ({
                    ...item,
                    equipment: item.equipment?._id,
                })) : []
            }
            setInitialForm(dataTemp)
        }
    }

    useEffect(() => {
        getProjectTypes();
        getClients();
        getEquipments();
    }, [])

    const getProjectTypes = async () => {
        let res = await projectTypeApi.getAllProjectType();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setProjectTypes(resData)
        }
    }

    const getClients = async () => {
        let res = await clientApi.getAllClient();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setClients(resData)
        }
    }

    const getEquipments = async () => {
        let res = await equipmentApi.getAllEquipment();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setEquipments(resData)
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
        formData.append('description', values.description);
        formData.append('startDate', values.startDate ? moment(values.startDate).format('YYYY-MM-DD') : '');
        formData.append('endDate', values.endDate ? moment(values.endDate).format('YYYY-MM-DD') : '');
        formData.append('days', values.days);
        formData.append('amount', values.amount);
        formData.append('type', values.type ?? '');
        formData.append('client', values.client ?? '');
        formData.append('logo', values.logo ? values.logo?.file?.originFileObj : initialForm?.logo?._id ?? null);
        if (Array.isArray(values.equipments)) {
            formData.append('equipments', JSON.stringify(values.equipments));
        }
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            const res = await projectApi.editProjectById(match.params.id, formData);
            if (res.status === 200) {
                notification.success({message: t('label.edit_success')});
            }
        } else {
            const res = await projectApi.createProject(formData);
            if (res.status === 200) {
                notification.success({message: t('label.new_success')});
            }
        }
        history.push(links.PROJECT_LIST);
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
                                        <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>
                                    </div> : <UploadButton />}
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
                                        name="days"
                                        label={t('project.field.days')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('project.field.days')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.days}
                                    >
                                        <Input placeholder={t('project.field.days')} type="number"/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="amount"
                                        label={t('project.field.amount')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('project.field.amount')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.amount}
                                    >
                                        <Input placeholder={t('project.field.amount')} type="number"/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="startDate"
                                        label={t('project.field.startDate')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('project.field.startDate')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.startDate}
                                    >
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="endDate"
                                        label={t('project.field.endDate')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('project.field.endDate')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.endDate}
                                    >
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name={"client"}
                                        label={t('project.field.client')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('project.field.client')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.client}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            placeholder={t('label.select')}
                                            allowClear
                                            defaultValue={initialForm.client}
                                        >
                                            {
                                                clients.map(item => {
                                                    return (
                                                        <Option value={item._id}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name={"type"}
                                        label={t('project.field.type')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('project.field.type')
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
                                                projectTypes.map(item => {
                                                    return (
                                                        <Option value={item._id}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col item xs={24}>
                                    <div className={classes.viewBlock}>
                                        <div className="viewBlockTitle">
                                            {t('project.label.listEquipment')}
                                        </div>
                                        <div className="viewBlockContent">
                                            <Form.List name="equipments" initialValue={initialForm.equipments}>
                                                {(fields, { add, remove }) => {
                                                    return (
                                                        <>
                                                            {fields.map((field, index) => {
                                                                return (
                                                                    <div className="equipmentItem">
                                                                        <Form.Item
                                                                            name={[index, "equipment"]}
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: t('label.field_required', {
                                                                                        field: t('project.field.equipment')
                                                                                    })
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                                                placeholder={t('label.select')}
                                                                                allowClear
                                                                            >
                                                                                {
                                                                                    equipments.map(item => {
                                                                                        return (
                                                                                            <Option value={item._id}>{item.name}</Option>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            name={[index, "amount"]}
                                                                        >
                                                                            <Input
                                                                                placeholder={t('project.field.amount')}
                                                                                type="number"
                                                                            />
                                                                        </Form.Item>
                                                                        <RiDeleteBin6Line
                                                                            onClick={() => {
                                                                                remove(index);
                                                                            }}
                                                                            color={"red"}
                                                                            size={"18px"}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                            <Form.Item>
                                                                <Button
                                                                    type="dashed"
                                                                    onClick={() => add()}
                                                                    style={{ width: 160 }}
                                                                >
                                                                    <PlusOutlined /> {t('label.add')}
                                                                </Button>
                                                            </Form.Item>
                                                        </>
                                                    )
                                                }}
                                            </Form.List>
                                        </div>
                                    </div>
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

ProjectForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ProjectForm);
