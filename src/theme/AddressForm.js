import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Col, Form, Input, Select} from "antd";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import axios from "axios";
import addressApi from "../api/addressApi";

const styles = {
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        textTransform: 'uppercase',
        marginTop: 20,
    },
}
const { Option } = Select;
const { TextArea } = Input;


const AddressForm = (props) => {
    const {
        onChangeProvince,
        onChangeDistrict,
        onChangeWard,
        onChangeDescription,
        dataInitial,
        classes
    } = props;
    const {t} = useTranslation();
    const [dataAddress, setDataAddress] = useState({
        province: dataInitial.province ? dataInitial.province : null,
        district: dataInitial.district ? dataInitial.district : null,
        ward: dataInitial.ward ? dataInitial.ward : null,
        description: dataInitial.description ?? ""
    })
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const {
        province,
        district,
        ward,
        description
    } = dataAddress;

    useEffect(() => {
        getListVnProvince();
    }, [])
    const getListVnProvince = async () => {
        const res = await addressApi.getListVnProvince();
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return ({
                    ...item,
                    value: item._id,
                    label: item.name
                });
            });
            setProvinces(resData)
        }
    }
    const getListVnDistrictByProvince = async (province) => {
        const res = await addressApi.getListVnDistrictByProvince(province);
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return ({
                    ...item,
                    value: item._id,
                    label: item.name
                });
            });
            setDistricts(resData)
        }
    }
    const getListVnWardByDistrict = async (district) => {
        const res = await addressApi.getListVnWardByDistrict(district);
        if (res.status === 200 && Array.isArray(res.data.items)) {
            let resData = res.data.items.map((item, index) => {
                return ({
                    ...item,
                    value: item._id,
                    label: item.name
                });
            });
            setWards(resData)
        }
    }
    useEffect(() => {
        if (province) {
            getListVnDistrictByProvince(province)
        } else {
            if (districts.length > 0) {
                setDistricts([]);
            }
        }
    }, [province])

    useEffect(() => {
        if (district) {
            getListVnWardByDistrict(district)
        } else {
            if (wards.length > 0) {
                setWards([]);
            }
        }
    }, [district])

    useEffect(() => {
        if (dataInitial.province !== province) {
            onChangeProvince(province)
        }
    }, [province])

    useEffect(() => {
        if (dataInitial.district !== district) {
            onChangeDistrict(district);
        }
    }, [district])

    useEffect(() => {
        if (dataInitial.ward !== ward) {
            onChangeWard(ward);
        }
    }, [ward])

    useEffect(() => {
        if (dataInitial.description !== description) {
            onChangeDescription(description);
        }
    }, [description])

    return (
        <>
            <Col item xs={24}>
                <div className={classes.headerText}>
                    {t('label.address_info')}
                </div>
            </Col>
            <Col item xs={8}>
                <Form.Item
                    label={t('field.address_province')}
                >
                    <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        placeholder={t('label.select')}
                        allowClear
                        value={province}
                        onChange={(value) => {
                            setDataAddress(prev => ({
                                ...prev,
                                province: value,
                                district: null,
                                ward: null
                            }))
                        }}
                    >
                        {
                            provinces.map(item => {
                                return (
                                    <Option value={item.value}>{item.label}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col item xs={8}>
                <Form.Item
                    label={t('field.address_district')}
                >
                    <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        placeholder={t('label.select')}
                        allowClear
                        value={district}
                        onChange={(value) => {
                            setDataAddress(prev => ({
                                ...prev,
                                district: value,
                                ward: null
                            }))
                        }}
                        disabled={!province}
                    >
                        {
                            districts.map(item => {
                                return (
                                    <Option value={item.value}>{item.label}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col item xs={8}>
                <Form.Item
                    label={t('field.address_ward')}
                >
                    <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        placeholder={t('label.select')}
                        allowClear
                        value={ward}
                        onChange={(value) => {
                            setDataAddress(prev => ({
                                ...prev,
                                ward: value
                            }))
                        }}
                        disabled={!(province && district)}
                    >
                        {
                            wards.map(item => {
                                return (
                                    <Option value={item.value}>{item.label}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col item xs={24}>
                <Form.Item
                    name={"address_description"}
                    label={t('field.address_description')}
                    initialValue={dataInitial.description}
                >
                    <TextArea
                        rows={4}
                        value={description}
                        onChange={(event) => {
                            setDataAddress(prev => ({
                                ...prev,
                                description: event.target.value
                            }))
                        }}
                        placeholder={t('field.address_description')}
                    />
                </Form.Item>
            </Col>
        </>
    )
}
AddressForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(AddressForm);
