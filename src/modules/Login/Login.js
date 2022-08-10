import React, {Component, useContext} from "react";
import {Button, Col, Form, Input, notification, Row} from "antd";
import {connect, useDispatch} from 'react-redux';
import LoginWelcomeBackIcon from "../../assets/images/login_welcome_back.jpg";
import LoginIcon from "../../assets/images/logo.png"
import {compose} from "redux";
import {withStyles, useTheme} from "@mui/styles";
import PropTypes from 'prop-types';
import {setDataUser} from "../../redux/actions/auth";
import authApi from "../../api/authApi";
import {useTranslation} from "react-i18next";
import withWidth from '@material-ui/core/withWidth';
import {SM, XS} from "../../constants/constants";
import {AppContext} from "../../contexts/AppContext";
import {Link} from "react-router-dom";
import * as links from "../../constants/links"

const styles = {
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#2b394b',
    },
    left: {
        // padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBlock: {
        color: '#fff',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
        backgroundColor: '#24221F',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        '&.loginSmall': {
            padding: 0,
        },
        '& .loginForm': {
            '& .ant-form-item-label': {
                '& label': {
                    color: '#AFB6C2'
                }
            }
        }
    },
    welcome: {
        padding: 20,
        color: '#D4CCB6',
        '& .logoIcon': {
            height: 64,
            width: 64,
        },
        '& .welcomeText': {
            fontWeight: '600',
            fontSize: '1.5rem',
            padding: "20px 0"
        },
        '& .loginWelcomeIcon': {
            width: 360,
            height: 360,
            maxWidth: '100%',
            '&.iconSmall': {
                width: 120,
                height: 120,
            }
        }
    },
    right: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        padding: 20,
        minWidth: 300,
        width: '100%',
        '& .loginText': {
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#AFB6C2'
        },
        '& .itemInput': {
            padding: '10px 0',
            width: 360
        },
        '& .ant-form-item, .ant-form-item-row': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            '& .ant-form-item-label': {
                width: '100%',
                textAlign: 'left',
            },
            '& .ant-form-item-control': {
                width: '100%'
            },
            '& input': {
                backgroundColor: '#2b394b!important',
                color: '#ffffff!important',
                '&:-webkit-autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active': {
                    '-webkit-box-shadow': '0 0 0 30px #2b394b inset !important',
                    '-webkit-text-fill-color': '#A9AFB9!important',
                    backgroundColor: '#ffffff!important',
                },
            },
            '& .inputLogin': {
                backgroundColor: '#2b394b!important',
                borderRadius: 4,
                padding: 10,
                border: 'none',
            },
            '& .inputLoginPassword': {
                backgroundColor: '#2b394b!important',
                borderRadius: 4,
                padding: 0,
                border: 'none',
                paddingRight: 10,
                '& svg': {
                    '& path': {
                        fill: '#ffffff',
                    }
                }
            },
            '& button': {
                borderRadius: 5,
                width: '100%',
                padding: 10,
                height: 'unset',
                fontWeight: 600,
                backgroundColor: '#4196DD',
                textTransform: 'uppercase'
            }
        }
    },
    formFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& a': {
            textDecoration: 'underline',
            color: '#4599E1',
            fontWeight: 600,
        }
    }
}
const Login = (props) => {
    const {classes, width} = props;
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {
        setLoading
    } = useContext(AppContext);

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', values.username)
        formData.append('password', values.password)
        const res = await authApi.login(formData)
        if (res.status === 200 && res.data && res.data.data) {
            dispatch(setDataUser(res.data))
            notification.success({
                message: '',
                description: t('login.label.login_success'),
                duration: 4,
            });
        } else {
            dispatch(setDataUser(null))
        }
        setLoading(false);
    }

    return (
        <div className={classes.container}>
            <div className={classes.loginBlock + (width === XS ? " loginSmall" : "")}>
                <Row>
                    <Col item xs={24} sm={24} md={12} lg={12} className={classes.left}>
                        <div className={classes.welcome}>
                            <img className="logoIcon" src={LoginIcon} alt=""/>
                            <div className="welcomeText">
                                {t('login.label.welcome')}
                            </div>
                            {width !== XS &&
                                <img className={"loginWelcomeIcon" + (width === SM ? " iconSmall" : "")}
                                     src={LoginWelcomeBackIcon}
                                     alt=""/>}
                        </div>
                    </Col>
                    <Col item xs={24} sm={24} md={12} lg={12} className={classes.right}>
                        <div className={classes.login}>
                            <div className="loginText">
                                {t('login.label.loginText')}
                            </div>
                            <Form
                                name="normal_login"
                                className="loginForm"
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="username"
                                    label={t('login.field.username')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('label.field_required', {
                                                field: t('login.field.username')
                                            })
                                        },
                                    ]}
                                >
                                    <Input className="inputLogin" placeholder={t('login.field.username')}/>
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label={t('login.field.password')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('label.field_required', {
                                                field: t('login.field.password')
                                            })
                                        },
                                    ]}
                                >
                                    <Input.Password className="inputLoginPassword" placeholder={t('login.field.password')}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        {t('login.label.login')}
                                    </Button>
                                </Form.Item>
                                <div className={classes.formFooter}>
                                    <Link to={links.FORGOT_PASSWORD}>
                                        {t('login.label.forgot_password')}
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withWidth())(Login);
