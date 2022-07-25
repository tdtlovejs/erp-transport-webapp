import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Input,
    Popconfirm,
    Space,
    Modal,
    Form, notification,
} from "antd";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {
    ACTION_ADD, ACTION_EDIT,
} from "../../constants/constants";
import projectTypeApi from "../../api/projectTypeApi";
import CustomList from "../../theme/CustomList";
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {AppContext} from "../../contexts/AppContext";

function ProjectTypeList(props) {
    const {
        setLoading
    } = useContext(AppContext);
    const {t} = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [action, setAction] = useState("");
    const [editId, setEditId] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (forceUpdate) {
            setForceUpdate(false);
        }
    }, [forceUpdate])

    const onFill = (data) => {
        form.setFieldsValue(data);
        setEditId(data._id);
    };

    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };


    const onFinishModal = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('code', values.code);
        if (action === ACTION_EDIT) {
            const res = await projectTypeApi.editProjectTypeById(editId, formData);
            if (res.status === 200) {
                notification.success({message: t('label.edit_success')});
            }
        } else {
            const res = await projectTypeApi.createProjectType(formData);
            if (res.status === 200) {
                notification.success({message: t('label.new_success')});
            }
        }
        setIsModalVisible(false);
        setForceUpdate(true);
        setLoading(false);
    };

    const showModal = (type) => {
        setAction(type);
        setIsModalVisible(true);
    };

    const handleOkModal = () => {
        setIsModalVisible(false);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        const res = await projectTypeApi.deleteProjectTypeById(id);
        if (res.status === 200) {
            notification.success({message: t('label.delete_success')});
        }
        setLoading(false);
    };
    const columns = [
        {
            title: t('label.name'),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t('label.code'),
            dataIndex: "code",
            key: "code",
        },
        {
            title: t('label.action'),
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <a
                        onClick={() => {
                            onFill(record);
                            showModal(ACTION_EDIT);
                        }}
                    >
                        <FiEdit color={"green"} size={"18px"}/>
                    </a>
                    <Popconfirm
                        title={t('label.want_delete')}
                        onConfirm={() => handleDelete(record._id)}
                        okText={t('label.ok')}
                        cancelText={t('label.cancel')}
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
            <div>
                <Button
                    type="primary"
                    onClick={() => {
                        form.resetFields();
                        showModal(ACTION_ADD);
                    }}
                >
                    {t('project_type.label.add_new_project_type')}
                </Button>
                <Modal
                    footer={null}
                    title={action === ACTION_ADD ? t('project_type.label.add_new_project_type') : t('project_type.label.edit_project_type')}
                    visible={isModalVisible}
                    onOk={handleOkModal}
                    onCancel={handleCancelModal}
                >
                    <Form
                        {...layout}
                        name="nest-messages"
                        onFinish={onFinishModal}
                        form={form}
                        className={"member-manager-form"}
                    >
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
                        >
                            <Input/>
                        </Form.Item>
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
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                {t('label.save')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <CustomList
                    apiNameList={'api/v1/projectType/list'}
                    forceUpdate={forceUpdate}
                    columns={columns}
                />
            </div>
        </>
    );
}

ProjectTypeList.propTypes = {};

export default compose(
    withTranslation()
)(ProjectTypeList);
