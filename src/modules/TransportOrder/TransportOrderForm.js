import React, {useContext, useEffect, useState} from "react";
import {Button, Checkbox, Col, DatePicker, Form, Input, notification, Row, Select, TimePicker} from "antd";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import clientApi from "../../api/clientApi";
import {
    FORM_TYPE_EDIT,
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import projectApi from "../../api/projectApi";
import productApi from "../../api/productApi";
import AddressForm from "../../theme/AddressForm";
import {PlusOutlined} from "@ant-design/icons";
import {RiDeleteBin6Line} from "react-icons/ri";
import {AppContext} from "../../contexts/AppContext";
import moment from "moment";
import transportApi from "../../api/transportApi";
const {TextArea} = Input;
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
                '& .inputPrice': {
                    textAlign: 'right',
                    backgroundColor: '#F5F5F5!important',
                    borderRadius: 5,
                    padding: '12px 10px!important'
                },
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
    title: '',
    note: '',
    exportDate: null,
    expiryDate: null,
    expectedDepartAt: null,
    expectedArrivalAt: null,
    departAt: null,
    arrivalAt: null,
    status: '',
    project: '',
    client: '',
    // transportOrder: '',
    clientName: '',
    clientEmail: '',
    clientPhoneNumber: '',
    clientDescription: '',
    clientAddress_address_description: '',
    clientAddress_address_city: '',
    clientAddress_address_country: '',
    clientAddress_address_postalCode: '',
    clientAddress_address_province: '',
    clientAddress_address_district: '',
    clientAddress_address_ward: '',
    comment: '',
    products: [],
    addInfoClient: false,
    prices: []
}

const TransportOrderForm = (props) => {
    const {
        setLoading
    } = useContext(AppContext);
    const {
        classes,
        history,
        formType,
        match
    } = props;
    const {
        dataUser
    } = useSelector(state => state.authReducer);
    const {t} = useTranslation();
    const [initialForm, setInitialForm] = useState(null);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [addInfoClient, setAddInfoClient] = useState(false);

    useEffect(() => {
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            getDataInitialForm(match.params.id);
        } else {
            setInitialForm({...dataInitial})
        }
    }, [])
    const getDataInitialForm = async (productId) => {
        const res = await transportApi.showTransport(productId);
        if (res.status === 200 && res.data.item) {
            const data = res.data.item;
            const dataTemp = {
                ...dataInitial,
                ...data,
                clientAddress_address_description: data.clientAddress?.description,
                clientAddress_address_city: data.clientAddress?.city,
                clientAddress_address_country: data.clientAddress?.country,
                clientAddress_address_postalCode: data.clientAddress?.postalCode,
                clientAddress_address_province: data.clientAddress?.province?._id ?? '',
                clientAddress_address_district: data.clientAddress?.district?._id ?? '',
                clientAddress_address_ward: data.clientAddress?.ward?._id ?? '',
                exportDate: data.exportDate ? moment(data.exportDate) : '',
                expiryDate: data.expiryDate ? moment(data.expiryDate) : '',
                expectedDepartAt: data.expectedDepartAt ? moment(data.expectedDepartAt) : '',
                expectedArrivalAt: data.expectedArrivalAt ? moment(data.expectedArrivalAt) : '',
                departAt: data.departAt ? moment(data.departAt) : '',
                arrivalAt: data.arrivalAt ? moment(data.arrivalAt) : '',
                prices: data.products.map(item => item.price),
                products: Array.isArray(data.products) ? data.products.map(item => {
                    return ({
                        ...item,
                        product: item.product?._id
                    })
                }) : [],
                addInfoClient: !!data.addInfoClient,
                project: data.project?._id ?? null,
                client: data.client?._id ?? null,
            }

            setAddInfoClient(!!data.addInfoClient);
            setInitialForm(dataTemp)
        }
    }

    useEffect(() => {
        getClients();
        getProjects();
        getProducts();
    }, [])

    const getClients = async () => {
        let res = await clientApi.getAllClient();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setClients(resData)
        }
    }
    const getProjects = async () => {
        let res = await projectApi.getAllProject();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setProjects(resData)
        }
    }
    const getProducts = async () => {
        let res = await productApi.getAllProduct();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return {...item, key: index};
            });
            setProducts(resData)
        }
    }

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('note', values.note);
        formData.append('expectedDepartAt', values.expectedDepartAt ? moment(values.expectedDepartAt).format('YYYY-MM-DD') :'');
        formData.append('expectedArrivalAt', values.expectedArrivalAt ? moment(values.expectedArrivalAt).format('YYYY-MM-DD') :'');
        formData.append('departAt', values.departAt ? moment(values.departAt).format('YYYY-MM-DD') :'');
        formData.append('arrivalAt', values.arrivalAt ? moment(values.arrivalAt).format('YYYY-MM-DD') :'');
        formData.append('project', values.project ?? "");
        formData.append('client', values.client ?? "");
        formData.append('clientName', values.clientName ?? "");
        formData.append('clientEmail', values.clientEmail ?? "");
        formData.append('clientPhoneNumber', values.clientPhoneNumber ?? "");
        formData.append('clientDescription', values.clientDescription ?? "");
        formData.append('clientAddress_address_description', values.address_description ?? "");
        formData.append('clientAddress_address_city', values.clientAddress_address_city ?? "");
        formData.append('clientAddress_address_country', values.clientAddress_address_country ?? "");
        formData.append('clientAddress_address_postalCode', values.clientAddress_address_postalCode ?? "");
        formData.append('addInfoClient', !!values.addInfoClient);
        formData.append('clientAddress_address_province', initialForm.clientAddress_address_province ?? "");
        formData.append('clientAddress_address_district', initialForm.clientAddress_address_district ?? "");
        formData.append('clientAddress_address_ward', initialForm.clientAddress_address_ward ?? "");
        formData.append('comment', values.comment);
        if (Array.isArray(values.products)) {
            formData.append('products', JSON.stringify(values.products.map((item, index) => {
                return ({
                    ...item,
                    amount: item.amount ?? 0,
                    price: (Array.isArray(initialForm?.prices) && initialForm.prices.length > index) ? initialForm.prices[index] : ''
                })
            })));
        }
        if (formType === FORM_TYPE_EDIT && match.params.id) {
            const res = await transportApi.editTransportById(match.params.id, formData);
            if (res.status === 200) {
                notification.success({ message: t('label.edit_success')});
            }
        } else {
            const res = await transportApi.createTransport(formData);
            if (res.status === 200) {
                notification.success({ message: t('label.new_success')});
            }
        }
        history.push(links.TRANSPORT_ORDER_LIST)
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
                        <Col item xs={24} className={classes.formRight}>
                            <Row>
                                <Col item xs={24}>
                                    <Form.Item
                                        name="title"
                                        label={t('transportOrder.field.title')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('transportOrder.field.title')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.title}
                                    >
                                        <Input placeholder={t('transportOrder.field.title')}/>
                                    </Form.Item>
                                </Col>
                                {/*<Col item xs={12}>*/}
                                {/*    <Form.Item*/}
                                {/*        name="note"*/}
                                {/*        label={t('transportOrder.field.note')}*/}
                                {/*        rules={[*/}
                                {/*            {*/}
                                {/*                required: true,*/}
                                {/*                message: t('label.field_required', {*/}
                                {/*                    field: t('transportOrder.field.note')*/}
                                {/*                })*/}
                                {/*            },*/}
                                {/*        ]}*/}
                                {/*        initialValue={initialForm.note}*/}
                                {/*    >*/}
                                {/*        <TextArea rows={4}  placeholder={t('transportOrder.field.note')}/>*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col item xs={12}>*/}
                                {/*    <Form.Item*/}
                                {/*        name="expectedDepartAt"*/}
                                {/*        label={t('transportOrder.field.expectedDepartAt')}*/}
                                {/*        rules={[*/}
                                {/*            {*/}
                                {/*                required: true,*/}
                                {/*                message: t('label.field_required', {*/}
                                {/*                    field: t('transportOrder.field.expectedDepartAt')*/}
                                {/*                })*/}
                                {/*            },*/}
                                {/*        ]}*/}
                                {/*        initialValue={initialForm.expectedDepartAt}*/}
                                {/*    >*/}
                                {/*        <DatePicker/>*/}

                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col item xs={12}>*/}
                                {/*    <Form.Item*/}
                                {/*        name="expectedArrivalAt"*/}
                                {/*        label={t('transportOrder.field.expectedArrivalAt')}*/}
                                {/*        rules={[*/}
                                {/*            {*/}
                                {/*                required: true,*/}
                                {/*                message: t('label.field_required', {*/}
                                {/*                    field: t('transportOrder.field.expectedArrivalAt')*/}
                                {/*                })*/}
                                {/*            },*/}
                                {/*        ]}*/}
                                {/*        initialValue={initialForm.expectedArrivalAt}*/}
                                {/*    >*/}
                                {/*        <DatePicker/>*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                <Col item xs={12}>
                                    <Form.Item
                                        name="departAt"
                                        label={t('transportOrder.field.departAt')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('transportOrder.field.departAt')
                                                })
                                            },
                                        ]}
                                        initialValue={initialForm.departAt}
                                    >
                                        <DatePicker showTime/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name="arrivalAt"
                                        label={t('transportOrder.field.arrivalAt')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('transportOrder.field.arrivalAt')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.arrivalAt}
                                    >
                                        <DatePicker showTime/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={12}>
                                    <Form.Item
                                        name={"project"}
                                        label={t('transportOrder.field.project')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('transportOrder.field.project')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.project}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            placeholder={t('label.select')}
                                            allowClear
                                            defaultValue={initialForm.project}
                                        >
                                            {
                                                projects.map(item => {
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
                                        name={"client"}
                                        label={t('transportOrder.field.client')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('label.field_required', {
                                                    field: t('transportOrder.field.client')
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
                                <Col item xs={24}>
                                    <Form.Item
                                        name="addInfoClient"
                                        valuePropName="checked"
                                        wrapperCol={{ offset: 8, span: 16 }}
                                        initialValue={initialForm.addInfoClient}
                                    >
                                        <Checkbox name="addInfoClient" onChange={(event) => {
                                            setAddInfoClient(event.target.checked)
                                        }}>{t('transportOrder.field.addInfoClient')}</Checkbox>
                                    </Form.Item>
                                </Col>
                                {
                                    addInfoClient
                                    &&
                                    <>
                                        <Col item xs={12}>
                                            <Form.Item
                                                name="clientName"
                                                label={t('transportOrder.field.clientName')}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('label.field_required', {
                                                            field: t('transportOrder.field.clientName')
                                                        })
                                                    },
                                                ]}
                                                initialValue={initialForm.clientName}
                                            >
                                                <Input placeholder={t('transportOrder.field.clientName')}/>
                                            </Form.Item>
                                        </Col>
                                        <Col item xs={12}>
                                            <Form.Item
                                                name="clientPhoneNumber"
                                                label={t('transportOrder.field.clientPhoneNumber')}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('label.field_required', {
                                                            field: t('transportOrder.field.clientPhoneNumber')
                                                        })
                                                    },
                                                ]}
                                                initialValue={initialForm.clientPhoneNumber}
                                            >
                                                <Input placeholder={t('transportOrder.field.clientPhoneNumber')}/>
                                            </Form.Item>
                                        </Col>
                                        <Col item xs={12}>
                                            <Form.Item
                                                name="email"
                                                label={t('transportOrder.field.clientEmail')}
                                                rules={[
                                                    {
                                                        type: "email",
                                                        message: t('label.field_email', {
                                                            field: t('transportOrder.field.clientEmail')
                                                        })
                                                    },
                                                    {
                                                        required: true,
                                                        message: t('label.field_required', {
                                                            field: t('transportOrder.field.clientEmail')
                                                        })
                                                    },
                                                ]}
                                                initialValue={initialForm.clientEmail}
                                            >
                                                <Input placeholder={t('transportOrder.field.clientEmail')}/>
                                            </Form.Item>
                                        </Col>
                                        <Col item xs={12}>
                                            <Form.Item
                                                name="clientDescription"
                                                label={t('transportOrder.field.clientDescription')}
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: t('label.field_required', {
                                                //             field: t('transportOrder.field.clientDescription')
                                                //         })
                                                //     },
                                                // ]}
                                                initialValue={initialForm.clientDescription}
                                            >
                                                <TextArea rows={4}  placeholder={t('transportOrder.field.clientDescription')}/>
                                            </Form.Item>
                                        </Col>
                                        <AddressForm
                                            dataInitial={{
                                                province: initialForm?.clientAddress_address_province ?? null,
                                                district: initialForm?.clientAddress_address_district ?? null,
                                                ward: initialForm?.clientAddress_address_ward ?? null,
                                                description: initialForm?.clientAddress_address_description ?? "",
                                            }}
                                            onChangeProvince={(value) => {
                                                setInitialForm(prev => ({
                                                    ...prev,
                                                    clientAddress_address_province: value
                                                }))
                                            }}
                                            onChangeDistrict={(value) => {
                                                setInitialForm(prev => ({
                                                    ...prev,
                                                    clientAddress_address_district: value
                                                }))
                                            }}
                                            onChangeWard={(value) => {
                                                setInitialForm(prev => ({
                                                    ...prev,
                                                    clientAddress_address_ward: value
                                                }))
                                            }}
                                            onChangeDescription={(value) => {
                                                setInitialForm(prev => ({
                                                    ...prev,
                                                    clientAddress_address_description: value
                                                }))
                                            }}
                                        />

                                    </>
                                }
                                <Col item xs={24}>
                                    <Form.Item
                                        name="comment"
                                        label={t('transportOrder.field.comment')}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: t('label.field_required', {
                                        //             field: t('transportOrder.field.comment')
                                        //         })
                                        //     },
                                        // ]}
                                        initialValue={initialForm.comment}
                                    >
                                        <TextArea rows={4}  placeholder={t('transportOrder.field.comment')}/>
                                    </Form.Item>
                                </Col>
                                <Col item xs={24}>
                                    <div className={classes.viewBlock}>
                                        <div className="viewBlockTitle">
                                            {t('transportOrder.label.listProduct')}
                                        </div>
                                        <div className="viewBlockContent">
                                            <Form.List name="products" initialValue={initialForm.products}>
                                                {(fields, { add, remove }) => {
                                                    return (
                                                        <>
                                                            {fields.map((field, index) => {
                                                                return (
                                                                    <div className="equipmentItem">
                                                                        <Form.Item
                                                                            name={[index, "product"]}
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: t('label.field_required', {
                                                                                        field: t('transportOrder.field.product')
                                                                                    })
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                                                placeholder={t('label.select')}
                                                                                // allowClear
                                                                                onChange={(value) => {
                                                                                    const productItem = products.find(item => item._id === value);
                                                                                    const pricesTemp = Array.isArray(initialForm?.prices) ? initialForm.prices.map((item1, index1) => {
                                                                                        if (index1 === index) {
                                                                                            return productItem.price ?? ''
                                                                                        }
                                                                                        return item1;
                                                                                    }) : []
                                                                                    fields[index].price = productItem.price ?? ''
                                                                                    setInitialForm(prev => ({
                                                                                        ...prev,
                                                                                        prices: pricesTemp
                                                                                    }))
                                                                                }}
                                                                            >
                                                                                {
                                                                                    products.map(item => {
                                                                                        return (
                                                                                            <Option value={item._id}>{item.name}</Option>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            name={[index, "price"]}
                                                                        >
                                                                            <div className="inputPrice">
                                                                                {(Array.isArray(initialForm?.prices) && initialForm.prices.length > index) ? initialForm.prices[index] + " VND" : ''}
                                                                            </div>
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            name={[index, "amount"]}
                                                                        >
                                                                            <Input
                                                                                placeholder={t('transportOrder.field.amount')}
                                                                                type="number"
                                                                            />
                                                                        </Form.Item>
                                                                        <RiDeleteBin6Line
                                                                            onClick={() => {
                                                                                setInitialForm(prev => ({
                                                                                    ...prev,
                                                                                    prices: (Array.isArray(initialForm?.prices) ? initialForm.prices : []).filter((item1, index1) => index1 === index)
                                                                                }))
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
                                                                    onClick={() => {
                                                                        setInitialForm(prev => ({
                                                                            ...prev,
                                                                            prices: [
                                                                                ...(Array.isArray(initialForm?.prices) ? initialForm.prices : []),
                                                                                ''
                                                                            ]
                                                                        }))
                                                                        add();
                                                                    }}
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

TransportOrderForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(TransportOrderForm);
