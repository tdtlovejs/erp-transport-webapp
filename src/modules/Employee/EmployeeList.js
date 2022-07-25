import React, {useContext, useEffect, useState} from "react";
import {
    Button, Checkbox, Col, Image,
    notification,
    Popconfirm, Row,
    Space, Tooltip,
} from "antd";
import {FiEdit} from "react-icons/fi";
import {IoMdFemale, IoMdMale} from "react-icons/io";
import {VscGistSecret} from "react-icons/vsc";
import personApi from "../../api/personApi";
import {Link, withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";
import {useTranslation} from "react-i18next";
import {AppContext} from "../../contexts/AppContext";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import CustomList from "../../theme/CustomList";
import ViewItem from "../../theme/ViewItem";
import {GENDER_FEMALE, GENDER_MALE, ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_SUPERADMIN} from "../../constants/constants";
import ViewBlock from "../../theme/ViewBlock";
const styles = {
    logo: {
        height: 48,
    },
    rowRender: {
        '& .viewBlock': {
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
                    width: 300,
                    padding: '5px 0',
                    '& .equipmentItemLeft': {
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                    },
                    '& .equipmentItemRight': {

                    },
                    '& .equipmentItemText': {
                        padding: 5,
                    }
                },
            }
        }
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
    genderView: {
        display: 'flex',
        alignItems: 'center',
        '& .genderText': {
            color: '#30475E',
            textTransform: 'uppercase',
            fontSize: 12,
            fontWeight: '500',
        }
    },
    userDisabled: {
        display: 'inline-block',
        textDecoration: 'line-through',
    }
}

function EmployeeList(props) {
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
        const res = await personApi.deletePersonById(id);
        if (res.status === 200) {
            notification.success({ message: t('label.delete_success')});
            setForceUpdate(true);
        }
        setLoading(false);
    };

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

    const renderViewGender = (gender) => {
        switch (gender) {
            case GENDER_MALE:
                return (
                    <div className={classes.genderView}>
                        <IoMdMale />
                        <div className="genderText">{t('employee.field.male')}</div>
                    </div>
                )
            case GENDER_FEMALE:
                return (
                    <div style={ styles.genderView}>
                        <IoMdFemale />
                        <div className="genderText">{t('employee.field.female')}</div>
                    </div>
                )
        }
        return (
            <div style={ styles.genderView}>
                <VscGistSecret />
                <div className="genderText">{t('employee.field.secret')}</div>
            </div>
        )
    }

    const columns = [
        {
            title: t('employee.field.avatar'),
            dataIndex: "avatar",
            key: "avatar",
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
            title: t('label.name'),
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return (
                    <div>
                        <div>{record?.firstName ?? ""}</div>
                        <div>{record?.lastName ?? ""}</div>
                    </div>
                )
            }
        },
        {
            title: t('employee.field.email'),
            dataIndex: "email",
            key: "email"
        },
        {
            title: t('employee.field.username'),
            dataIndex: "username",
            key: "username",
            render: (text, record) => {
                if (record?.user?.enabled) {
                    return (
                        <>
                            {record?.user?.username ?? ""}
                        </>
                    )
                }
                return (
                    <Tooltip placement="top" title={t('employee.field.disabled')}>
                        <div className={classes.userDisabled}>{record?.user?.username ?? ""}</div>
                    </Tooltip>
                )
            }
        },
        {
            title: t('employee.field.role'),
            dataIndex: "role",
            key: "role",
            render: (text, record) => {
                return (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {renderViewRole(record.user?.role)}
                    </div>
                )
            }
        },
        {
            title: t('label.action'),
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Link
                        to={links.EMPLOYEE_EDIT.replace(':id', record._id)}
                    >
                        <FiEdit color={"green"} size={"18px"}/>
                    </Link>
                    {/*<Popconfirm*/}
                    {/*    title={t('label.want_delete')}*/}
                    {/*    onConfirm={() => handleDelete(record._id)}*/}
                    {/*>*/}
                    {/*    <a>*/}
                    {/*        <RiDeleteBin6Line color={"red"} size={"18px"}/>*/}
                    {/*    </a>*/}
                    {/*</Popconfirm>*/}
                </Space>
            ),
        },
    ];

    return (
        <>
            <div>
                <Link
                    to={links.EMPLOYEE_NEW}
                >
                    <Button
                        type="primary"
                        onClick={() => {

                        }}
                    >
                        {t('employee.label.add_new_employee')}
                    </Button>
                </Link>
                <CustomList
                    apiNameList={'api/v1/person/list'}
                    forceUpdate={forceUpdate}
                    columns={columns}
                    expandable={{
                        expandedRowRender: record => {
                            const fileId = record.avatar?.fileId;
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
                                                                label={t('employee.field.isDriver')}
                                                                isViewComponent={true}
                                                                view={
                                                                    <Checkbox
                                                                        checked={!!record?.user?.isDriver}
                                                                    />
                                                                }
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('employee.field.username')}
                                                                isViewComponent={true}
                                                                view={record.user?.enabled ? <div>{record?.user?.username ?? ""}</div> : <Tooltip placement="top" title={t('employee.field.disabled')}>
                                                                    <div className={classes.userDisabled}>{record?.user?.username ?? ""}</div>
                                                                </Tooltip>}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('employee.field.role')}
                                                                isViewComponent={true}
                                                                view={renderViewRole(record.user?.role)}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('employee.field.fullName')}
                                                                view={(record?.firstName ?? "") + " "+ (record?.lastName ?? "")}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('employee.field.email')}
                                                                view={record?.email ?? ""}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('employee.field.birthday')}
                                                                view={record.birthday ? moment(record.birthday).format('DD-MM-YYYY') : ''}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('employee.field.gender')}
                                                                isViewComponent={true}
                                                                view={renderViewGender(record.gender)}
                                                            />
                                                        </Col>
                                                        <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                            <ViewItem
                                                                label={t('employee.field.phoneNumber')}
                                                                view={record?.phoneNumber ?? ""}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        }
                                    />
                                    <ViewBlock
                                        title={t('label.address_info')}
                                        content={
                                            <Row>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('field.address_province')}
                                                        view={record.address?.province?.name ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('field.address_district')}
                                                        view={record.address?.district?.name ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                    <ViewItem
                                                        label={t('field.address_ward')}
                                                        view={record.address?.ward?.name ?? ""}
                                                    />
                                                </Col>
                                                <Col item xs={24}>
                                                    <ViewItem
                                                        label={t('field.address_description')}
                                                        view={record.address?.description ?? ""}
                                                    />
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

EmployeeList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(EmployeeList);
