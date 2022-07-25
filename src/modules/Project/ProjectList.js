import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Image, notification, Popconfirm, Row, Space,} from "antd";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import projectApi from "../../api/projectApi";
import {Link, withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import CustomList from "../../theme/CustomList";
import {AppContext} from "../../contexts/AppContext";
import ViewItem from "../../theme/ViewItem";
import ViewBlock from "../../theme/ViewBlock";
const styles = {
    logo: {
        height: 48,
    },
    rowRender: {
        '& table': {
            maxWidth: 800,
            margin: 'auto'
        },
        '& .equipmentItem': {
            width: 400,
            padding: '5px 0',
        },
        '& .equipmentItemCell': {
            borderBottom: '1px solid #002140',
            padding: 0,
        },
        '& .equipmentItemCellContent': {
            padding: '5px 0',
            display: 'flex',
            alignItems: 'center',
            '& img': {
                paddingRight: 10,
            },
            '&.right': {
                justifyContent: 'flex-end'
            }
        },
        '& .listEquipmentWrapper': {
            margin: 'auto',
        },
        // '& .equipmentItem': {
        //     display: 'flex',
        //     alignItems: 'center',
        //     width: 300,
        //     padding: '5px 0',
        //     '& .equipmentItemLeft': {
        //         display: 'flex',
        //         alignItems: 'center',
        //         flex: 1,
        //     },
        //     '& .equipmentItemRight': {
        //
        //     },
        //     '& .equipmentItemText': {
        //         padding: 5,
        //     }
        // },
    }
}
function ProjectList(props) {
    const {
        setLoading
    } = useContext(AppContext);
    const {
        classes
    } = props;
    const {t} = useTranslation();
    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false);
        }
    }, [forceUpdate])
    const handleDelete = async (id) => {
        setLoading(true);
        const res = await projectApi.deleteProjectById(id);
        if (res.status === 200) {
            notification.success({message: t('label.delete_success')});
        }
        setForceUpdate(true);
        setLoading(false);
    };
    const columns = [
        {
            title: t('field.logo'),
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
            title: t('project.field.startDate'),
            dataIndex: "startDate",
            key: "startDate",
            render: (text, record) => {
                return (
                    <>
                        {text ? moment(text).format('DD-MM-YYYY') : ''}
                    </>
                )
            }
        },
        {
            title: t('project.field.endDate'),
            dataIndex: "endDate",
            key: "endDate",
            render: (text, record) => {
                return (
                    <>
                        {text ? moment(text).format('DD-MM-YYYY') : ''}
                    </>
                )
            }
        },
        {
            title: t('vehicle.field.type'),
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
                        to={links.PROJECT_EDIT.replace(':id', record._id)}
                    >
                        <FiEdit color={"green"} size={"18px"}/>
                    </Link>
                    <Popconfirm
                        title={t('label.want_delete')}
                        onConfirm={() => handleDelete(record._id)}
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
            <Link
                to={links.PROJECT_NEW}
            >
                <Button
                    type="primary"
                    onClick={() => {

                    }}
                >
                    {t('project.label.add_new_project')}
                </Button>
            </Link>
            <CustomList
                apiNameList={'api/v1/project/list'}
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
                                                            label={t('project.field.startDate')}
                                                            view={record.startDate ? moment(record.startDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('project.field.endDate')}
                                                            view={record.endDate ? moment(record.endDate).format('DD-MM-YYYY') : ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('field.description')}
                                                            view={record.description ?? ''}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('project.field.amount')}
                                                            view={record.amount}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>
                                                        <ViewItem
                                                            label={t('project.field.days')}
                                                            view={record.days}
                                                        />
                                                    </Col>
                                                    <Col item xs={24} sm={12} md={12} lg={8} xl={8}>

                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    }
                                />
                                <ViewBlock
                                    title={t('project.label.listEquipment')}
                                    content={
                                        <table>
                                            <tr className="equipmentItem">
                                                <th className="equipmentItemCell">
                                                    <div className="equipmentItemCellContent">
                                                        {t('project.field.equipment')}
                                                    </div>
                                                </th>
                                                <th className="equipmentItemCell">
                                                    <div className="equipmentItemCellContent right">
                                                        {t('project.field.amount')}
                                                    </div>
                                                </th>
                                            </tr>
                                            {
                                                record.equipments.map((item, index) => {
                                                    const fileEquipmentLogoId = item?.equipment?.logo?.fileId;
                                                    return (
                                                        <tr className="equipmentItem">
                                                            <td className="equipmentItemCell">
                                                                <div className="equipmentItemCellContent">
                                                                    {/*{fileEquipmentLogoId && <img*/}
                                                                    {/*    style={{*/}
                                                                    {/*        height: 36*/}
                                                                    {/*    }}*/}
                                                                    {/*    src={`https://drive.google.com/uc?export=view&id=${fileEquipmentLogoId}`}*/}
                                                                    {/*/>}*/}
                                                                    {fileEquipmentLogoId && <div className="logoCellWrapper">
                                                                        <Image
                                                                            className="logoCellImg"
                                                                            src={`https://drive.google.com/uc?export=view&id=${fileEquipmentLogoId}`}
                                                                        />
                                                                    </div>}
                                                                    <div className="equipmentItemText">
                                                                        {item.equipment?.name ?? ""}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="equipmentItemCell">
                                                                <div className="equipmentItemCellContent right">
                                                                    {item.amount}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </table>
                                    }
                                    data={
                                        <div className="listEquipmentWrapper">
                                            {
                                                record.equipments.map((item, index) => {
                                                    const fileEquipmentLogoId = item?.equipment?.logo?.fileId;
                                                    return (
                                                        <div className="equipmentItem">
                                                            <div className="equipmentItemLeft">
                                                                {fileEquipmentLogoId && <img
                                                                    style={{
                                                                        height: 36
                                                                    }}
                                                                    src={`https://drive.google.com/uc?export=view&id=${fileEquipmentLogoId}`}
                                                                />}
                                                                <div className="equipmentItemText">
                                                                    {item.equipment?.name ?? ""}
                                                                </div>
                                                            </div>
                                                            <div className="equipmentItemRight">
                                                                <div className="equipmentItemText">
                                                                    {item.amount}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                />
                                {/*<div className="viewBlock">*/}
                                {/*    <div className="viewBlockTitle">*/}
                                {/*        {t('project.label.listEquipment')}*/}
                                {/*    </div>*/}
                                {/*    <div className="viewBlockContent">*/}
                                {/*        {*/}
                                {/*            record.equipments.map((item, index) => {*/}
                                {/*                const fileEquipmentLogoId = item?.equipment?.logo?.fileId;*/}
                                {/*                return (*/}
                                {/*                    <div className="equipmentItem">*/}
                                {/*                        <div className="equipmentItemLeft">*/}
                                {/*                            {fileEquipmentLogoId && <img*/}
                                {/*                                style={{*/}
                                {/*                                    height: 36*/}
                                {/*                                }}*/}
                                {/*                                src={`https://drive.google.com/uc?export=view&id=${fileEquipmentLogoId}`}*/}
                                {/*                            />}*/}
                                {/*                            <div className="equipmentItemText">*/}
                                {/*                                {item.equipment?.name ?? ""}*/}
                                {/*                            </div>*/}
                                {/*                        </div>*/}
                                {/*                        <div className="equipmentItemRight">*/}
                                {/*                            <div className="equipmentItemText">*/}
                                {/*                                {item.amount}*/}
                                {/*                            </div>*/}
                                {/*                        </div>*/}
                                {/*                    </div>*/}
                                {/*                )*/}
                                {/*            })*/}
                                {/*        }*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        )
                    },
                }}
            />
        </>
    );
}

ProjectList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), withRouter)(ProjectList);
